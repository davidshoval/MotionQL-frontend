/**
 * Reads the output of MongoDB's explain() (find, aggregate, sharded, classic and SBE engines)
 * and turns it into a stage tree, plain-language findings and an index suggestion.
 * Reference: https://www.mongodb.com/docs/manual/reference/explain-results/
 *
 * The input is plain JavaScript (parse Extended JSON / shell output first, e.g. with ./ejson toPlain).
 */

type Obj = Record<string, unknown>;

export type PlanNode = {
  stage: string;
  /** e.g. shard name for a shard's subtree. */
  label?: string;
  indexName?: string;
  keyPattern?: Obj;
  filter?: unknown;
  sortPattern?: Obj;
  nReturned?: number;
  docsExamined?: number;
  keysExamined?: number;
  timeMs?: number;
  usedDisk?: boolean;
  isMultiKey?: boolean;
  children: PlanNode[];
};

export type Finding = { level: "error" | "warning" | "info" | "good"; title: string; detail?: string };

export type IndexSuggestion = { keys: [string, 1 | -1][]; command: string; reason: string };

export type ExplainSection = {
  label: string;
  namespace?: string;
  root: PlanNode | null;
  nReturned?: number;
  totalDocsExamined?: number;
  totalKeysExamined?: number;
  executionTimeMillis?: number;
  rejectedPlans: number;
  engine?: string;
};

export type ExplainReport = {
  sections: ExplainSection[];
  pipeline: { name: string; detail?: string }[];
  findings: Finding[];
  suggestions: IndexSuggestion[];
  hasExecutionStats: boolean;
};

const isObj = (x: unknown): x is Obj => typeof x === "object" && x !== null && !Array.isArray(x);
const num = (x: unknown): number | undefined => (typeof x === "number" && Number.isFinite(x) ? x : undefined);

function buildNode(raw: unknown, label?: string): PlanNode | null {
  if (!isObj(raw)) return null;
  // SBE plans wrap the classic-style tree in queryPlan.
  if (isObj(raw.queryPlan) && typeof raw.stage !== "string") return buildNode(raw.queryPlan, label);
  if (typeof raw.stage !== "string") {
    if (isObj(raw.winningPlan)) return buildNode(raw.winningPlan, label);
    if (isObj(raw.executionStages)) return buildNode(raw.executionStages, label);
    return null;
  }
  const node: PlanNode = {
    stage: raw.stage,
    label,
    indexName: typeof raw.indexName === "string" ? raw.indexName : undefined,
    keyPattern: isObj(raw.keyPattern) ? raw.keyPattern : undefined,
    filter: raw.filter,
    sortPattern: isObj(raw.sortPattern) ? raw.sortPattern : undefined,
    nReturned: num(raw.nReturned),
    docsExamined: num(raw.docsExamined),
    keysExamined: num(raw.keysExamined),
    timeMs: num(raw.executionTimeMillisEstimate) ?? num(raw.executionTimeMillis),
    usedDisk: raw.usedDisk === true || (num(raw.spills) ?? 0) > 0,
    isMultiKey: raw.isMultiKey === true,
    children: [],
  };
  const kids: unknown[] = [];
  for (const k of ["inputStage", "outerStage", "innerStage", "thenStage", "elseStage"]) if (raw[k]) kids.push(raw[k]);
  if (Array.isArray(raw.inputStages)) kids.push(...raw.inputStages);
  for (const c of kids) {
    const n = buildNode(c);
    if (n) node.children.push(n);
  }
  if (Array.isArray(raw.shards)) {
    for (const s of raw.shards) {
      if (!isObj(s)) continue;
      const n = buildNode(s.executionStages ?? s.winningPlan, typeof s.shardName === "string" ? s.shardName : undefined);
      if (n) node.children.push(n);
    }
  }
  return node;
}

export function walk(node: PlanNode | null, fn: (n: PlanNode, parent: PlanNode | null) => void, parent: PlanNode | null = null) {
  if (!node) return;
  fn(node, parent);
  for (const c of node.children) walk(c, fn, node);
}

function sectionFrom(explain: Obj, label: string): ExplainSection | null {
  const qp = isObj(explain.queryPlanner) ? explain.queryPlanner : null;
  const es = isObj(explain.executionStats) ? explain.executionStats : null;
  if (!qp && !es) return null;
  const winning = qp && isObj(qp.winningPlan) ? qp.winningPlan : null;
  // SBE: the execution tree uses internal slot-based stage names, so show the classic-style queryPlan instead.
  const sbe = winning && isObj(winning.queryPlan);
  let root = !sbe && es && isObj(es.executionStages) ? buildNode(es.executionStages) : null;
  if (!root && winning) root = buildNode(winning);
  return {
    label,
    namespace: qp && typeof qp.namespace === "string" ? qp.namespace : undefined,
    root,
    nReturned: es ? num(es.nReturned) : undefined,
    totalDocsExamined: es ? num(es.totalDocsExamined) : undefined,
    totalKeysExamined: es ? num(es.totalKeysExamined) : undefined,
    executionTimeMillis: es ? num(es.executionTimeMillis) : undefined,
    rejectedPlans: qp && Array.isArray(qp.rejectedPlans) ? qp.rejectedPlans.length : 0,
    engine: typeof explain.explainVersion === "string" ? (explain.explainVersion === "2" ? "SBE" : "classic") : undefined,
  };
}

type Context = { sections: ExplainSection[]; pipeline: { name: string; raw: Obj }[]; commands: Obj[]; parsedQueries: unknown[] };

function collect(explain: unknown, label: string, ctx: Context) {
  if (Array.isArray(explain)) {
    explain.forEach((e, i) => collect(e, `${label}#${i + 1}`, ctx));
    return;
  }
  if (!isObj(explain)) return;
  if (isObj(explain.command)) ctx.commands.push(explain.command);
  const qp = isObj(explain.queryPlanner) ? explain.queryPlanner : null;
  if (qp && "parsedQuery" in qp) ctx.parsedQueries.push(qp.parsedQuery);
  const s = sectionFrom(explain, label);
  if (s) ctx.sections.push(s);
  if (Array.isArray(explain.stages)) {
    for (const st of explain.stages) {
      if (!isObj(st)) continue;
      const name = Object.keys(st).find((k) => k.startsWith("$"));
      if (!name) continue;
      if (name === "$cursor") collect(st.$cursor, label, ctx);
      else ctx.pipeline.push({ name, raw: st });
    }
  }
  if (isObj(explain.shards)) {
    for (const [shard, sub] of Object.entries(explain.shards)) collect(sub, shard, ctx);
  }
}

/* ---------------- index suggestion (Equality, Sort, Range) ---------------- */

const RANGE_OPS = new Set(["$gt", "$gte", "$lt", "$lte", "$ne", "$nin", "$regex", "$exists", "$not", "$type", "$mod", "$size", "$all"]);

type Preds = { eq: string[]; range: string[]; unsupported: string[] };

function classify(filter: unknown, out: Preds) {
  if (!isObj(filter)) return;
  for (const [k, v] of Object.entries(filter)) {
    if (k === "$and" && Array.isArray(v)) v.forEach((f) => classify(f, out));
    else if (k.startsWith("$")) out.unsupported.push(k);
    else if (isObj(v) && Object.keys(v).some((o) => o.startsWith("$"))) {
      const ops = Object.keys(v);
      if (ops.every((o) => o === "$eq" || o === "$in" || o === "$elemMatch")) out.eq.push(k);
      else if (ops.some((o) => RANGE_OPS.has(o))) out.range.push(k);
      else out.unsupported.push(k);
    } else if (!(v instanceof RegExp) && !(typeof v === "string" && /^\/.*\/[a-z]*$/.test(v))) out.eq.push(k);
    else out.range.push(k);
  }
}

function suggestIndex(filter: unknown, sort: Obj | undefined, ns: string | undefined, reason: string): IndexSuggestion | null {
  const preds: Preds = { eq: [], range: [], unsupported: [] };
  classify(filter, preds);
  const keys: [string, 1 | -1][] = [];
  const add = (f: string, d: 1 | -1) => {
    if (!keys.some(([k]) => k === f)) keys.push([f, d]);
  };
  preds.eq.forEach((f) => add(f, 1));
  if (sort) for (const [f, d] of Object.entries(sort)) add(f, d === -1 ? -1 : 1);
  preds.range.forEach((f) => add(f, 1));
  if (!keys.length || (keys.length === 1 && keys[0][0] === "_id")) return null;
  const coll = ns ? ns.slice(ns.indexOf(".") + 1) : "<collection>";
  const spec = keys.map(([k, d]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${d}`).join(", ");
  const target = /^[A-Za-z_$][\w$]*$/.test(coll) ? `db.${coll}` : `db.getCollection(${JSON.stringify(coll)})`;
  return { keys, command: `${target}.createIndex({ ${spec} })`, reason };
}

/* ---------------- analysis ---------------- */

const fmt = (n: number) => n.toLocaleString("en-US");

export function analyzeExplain(explain: unknown): ExplainReport {
  const ctx: Context = { sections: [], pipeline: [], commands: [], parsedQueries: [] };
  collect(explain, "plan", ctx);
  if (!ctx.sections.length && !ctx.pipeline.length) {
    throw new Error("This doesn't look like explain() output: no queryPlanner, executionStats or stages found.");
  }
  const findings: Finding[] = [];
  const hasExec = ctx.sections.some((s) => s.nReturned !== undefined || s.totalDocsExamined !== undefined);
  let collscan = false;
  let memSort = false;
  let poorRatio = false;
  let sortPattern: Obj | undefined;
  let collscanFilter: unknown;

  const multi = ctx.sections.length > 1;
  for (const s of ctx.sections) {
    const where = multi ? ` (${s.label})` : "";
    const stages: string[] = [];
    walk(s.root, (n) => {
      stages.push(n.stage);
      if (n.stage === "COLLSCAN") {
        collscan = true;
        collscanFilter ??= n.filter;
        findings.push({
          level: "error",
          title: `Collection scan${where}`,
          detail: `MongoDB read every document${n.docsExamined !== undefined ? ` (${fmt(n.docsExamined)} examined)` : ""} because no index matched the query. This gets slower as the collection grows.`,
        });
      }
      if (n.stage === "SORT") {
        memSort = true;
        sortPattern ??= n.sortPattern;
        findings.push({
          level: n.usedDisk ? "error" : "warning",
          title: n.usedDisk ? `In-memory sort spilled to disk${where}` : `In-memory (blocking) sort${where}`,
          detail: `Results are sorted after they are fetched${n.sortPattern ? ` on ${JSON.stringify(n.sortPattern)}` : ""}. An index whose keys match the sort lets MongoDB return documents already in order, and avoids the 100 MB sort memory limit.`,
        });
      }
      if (n.stage === "FETCH" && n.filter && n.children.some((c) => c.stage === "IXSCAN")) {
        findings.push({
          level: "info",
          title: `Filter applied after the index${where}`,
          detail: `The index ${n.children.find((c) => c.indexName)?.indexName ?? ""} narrowed the search, but some conditions (${Object.keys(isObj(n.filter) ? n.filter : {}).join(", ") || "see filter"}) were checked by loading documents. A compound index can cover them.`,
        });
      }
      if (n.isMultiKey)
        findings.push({
          level: "info",
          title: `Multikey index ${n.indexName ?? ""}${where}`,
          detail: "The index includes array fields, which can't be used to cover a query and may examine more keys.",
        });
      if (n.stage === "EOF")
        findings.push({
          level: "info",
          title: `EOF stage${where}`,
          detail: "The collection doesn't exist or the query can never match; nothing was read.",
        });
    });
    const hasFetch = stages.includes("FETCH");
    const usesIndex = stages.some(
      (x) => x === "IXSCAN" || x === "IDHACK" || x === "EXPRESS_IXSCAN" || x === "COUNT_SCAN" || x === "DISTINCT_SCAN",
    );
    if (usesIndex && !collscan) findings.push({ level: "good", title: `Uses an index${where}`, detail: undefined });
    if (usesIndex && !hasFetch && s.totalDocsExamined === 0 && (s.nReturned ?? 0) > 0) {
      findings.push({
        level: "good",
        title: `Covered query${where}`,
        detail: "Everything came from the index; no documents had to be loaded.",
      });
    }
    const ret = s.nReturned;
    if (ret !== undefined && s.totalDocsExamined !== undefined) {
      const docs = s.totalDocsExamined;
      if (docs > 100 && docs > ret * 10) {
        poorRatio = true;
        findings.push({
          level: "warning",
          title: `Examined ${fmt(docs)} documents to return ${fmt(ret)}${where}`,
          detail: `That is ${ret ? `${fmt(Math.round(docs / ret))}x` : "far"} more than returned. A more selective index would read fewer documents.`,
        });
      } else if (docs > 0 && docs <= Math.max(ret, 1) * 1.5 && !collscan) {
        findings.push({ level: "good", title: `Efficient: ${fmt(docs)} examined for ${fmt(ret)} returned${where}` });
      }
    }
    if (ret !== undefined && s.totalKeysExamined !== undefined && s.totalKeysExamined > 1000 && s.totalKeysExamined > ret * 10) {
      findings.push({
        level: "warning",
        title: `Scanned ${fmt(s.totalKeysExamined)} index keys for ${fmt(ret)} results${where}`,
        detail: "The index bounds are wide. Put equality fields first, then sort fields, then range fields (the ESR rule).",
      });
    }
    if (s.executionTimeMillis !== undefined && s.executionTimeMillis >= 100) {
      findings.push({
        level: "warning",
        title: `Took ${fmt(s.executionTimeMillis)} ms${where}`,
        detail: "Queries slower than 100 ms show up in the slow query log by default.",
      });
    }
    if (s.rejectedPlans > 0)
      findings.push({
        level: "info",
        title: `${s.rejectedPlans} rejected plan${s.rejectedPlans > 1 ? "s" : ""}${where}`,
        detail: "The planner tried other indexes and picked the one shown here.",
      });
  }

  // Stages after which documents no longer map to collection fields, so a later $sort can't use an index.
  const RESHAPING = new Set([
    "$group",
    "$project",
    "$unwind",
    "$addFields",
    "$set",
    "$replaceRoot",
    "$replaceWith",
    "$bucket",
    "$bucketAuto",
    "$facet",
    "$lookup",
    "$sortByCount",
    "$setWindowFields",
    "$unionWith",
  ]);
  let reshaped = false;
  for (const p of ctx.pipeline) {
    const body = p.raw[p.name];
    const usedDisk = p.raw.usedDisk === true || (num(p.raw.spills) ?? 0) > 0;
    if ((p.name === "$sort" || p.name === "$group" || p.name === "$bucketAuto" || p.name === "$setWindowFields") && usedDisk) {
      findings.push({
        level: "warning",
        title: `${p.name} spilled to disk`,
        detail: "The stage ran out of its memory budget and wrote temporary files. Filter earlier so fewer documents reach it.",
      });
    }
    if (p.name === "$sort" && !reshaped) {
      memSort = true;
      sortPattern ??= isObj(body) && isObj(body.sortKey) ? body.sortKey : undefined;
      findings.push({
        level: "warning",
        title: "$sort was not pushed down to an index",
        detail:
          "The pipeline sorts documents in memory. An index matching the $match fields and then the sort keys lets the query layer return them in order.",
      });
    } else if (p.name === "$sort") {
      findings.push({
        level: "info",
        title: "$sort on computed results",
        detail:
          "This $sort runs after the documents were reshaped, so it can't use an index. That's fine when earlier stages have already reduced the number of documents.",
      });
    }
    if (p.name === "$lookup" && (num(p.raw.collectionScans) ?? 0) > 0) {
      findings.push({
        level: "warning",
        title: "$lookup scans the foreign collection",
        detail: "Index the foreignField in the joined collection.",
      });
    }
    if (RESHAPING.has(p.name)) reshaped = true;
  }

  if (!hasExec && ctx.sections.length) {
    findings.push({
      level: "info",
      title: "No execution statistics",
      detail: 'Run explain("executionStats") to see how many documents and keys were actually examined.',
    });
  }

  const suggestions: IndexSuggestion[] = [];
  if (collscan || memSort || poorRatio) {
    const cmd = ctx.commands[0];
    const filter =
      (cmd &&
        (cmd.filter ?? (Array.isArray(cmd.pipeline) ? (cmd.pipeline as Obj[]).find((s) => isObj(s) && s.$match)?.$match : undefined))) ??
      ctx.parsedQueries[0] ??
      collscanFilter;
    const sort = (cmd && isObj(cmd.sort) ? cmd.sort : undefined) ?? sortPattern;
    const reason = collscan ? "Replaces the collection scan" : memSort ? "Removes the in-memory sort" : "Reads fewer documents";
    const sug = suggestIndex(
      filter,
      sort,
      ctx.sections.find((s) => s.namespace)?.namespace,
      `${reason}. Order: equality fields, then sort, then range (ESR).`,
    );
    if (sug) suggestions.push(sug);
  }

  const order = { error: 0, warning: 1, info: 2, good: 3 };
  findings.sort((a, b) => order[a.level] - order[b.level]);
  return {
    sections: ctx.sections,
    pipeline: ctx.pipeline.map((p) => ({ name: p.name, detail: describeStage(p.raw) })),
    findings,
    suggestions,
    hasExecutionStats: hasExec,
  };
}

function describeStage(raw: Obj): string | undefined {
  const parts: string[] = [];
  const n = num(raw.nReturned);
  const t = num(raw.executionTimeMillisEstimate);
  if (n !== undefined) parts.push(`${fmt(n)} returned`);
  if (t !== undefined) parts.push(`${fmt(t)} ms`);
  if (raw.usedDisk === true) parts.push("used disk");
  return parts.join(" · ") || undefined;
}

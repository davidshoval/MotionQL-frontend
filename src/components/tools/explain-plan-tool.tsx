"use client";

import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { analyzeExplain, type ExplainReport, type PlanNode } from "@/lib/tools/explain";
import { parseEJson, toPlain } from "@/lib/tools/ejson";
import { cn } from "@/lib/utils";
import { CodeBlock, CopyText, ErrorText, Notice, Panel, Stat, monoArea } from "./shared";

// Trimmed from real MongoDB 7.0 output: db.orders.find({ status: "A", qty: { $lt: 30 } }).sort({ createdAt: -1 }).explain("executionStats")
const EXAMPLE = `{
  "explainVersion": "1",
  "queryPlanner": {
    "namespace": "shop.orders",
    "parsedQuery": { "$and": [{ "status": { "$eq": "A" } }, { "qty": { "$lt": 30 } }] },
    "winningPlan": {
      "stage": "SORT",
      "sortPattern": { "createdAt": -1 },
      "memLimit": 104857600,
      "type": "simple",
      "inputStage": {
        "stage": "COLLSCAN",
        "filter": { "$and": [{ "status": { "$eq": "A" } }, { "qty": { "$lt": 30 } }] },
        "direction": "forward"
      }
    },
    "rejectedPlans": []
  },
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 400,
    "executionTimeMillis": 6,
    "totalKeysExamined": 0,
    "totalDocsExamined": 5000,
    "executionStages": {
      "stage": "SORT",
      "nReturned": 400,
      "executionTimeMillisEstimate": 0,
      "sortPattern": { "createdAt": -1 },
      "usedDisk": false,
      "inputStage": {
        "stage": "COLLSCAN",
        "filter": { "$and": [{ "status": { "$eq": "A" } }, { "qty": { "$lt": 30 } }] },
        "nReturned": 400,
        "executionTimeMillisEstimate": 0,
        "direction": "forward",
        "docsExamined": 5000
      }
    }
  },
  "command": { "find": "orders", "filter": { "status": "A", "qty": { "$lt": 30 } }, "sort": { "createdAt": -1 } }
}`;

const STAGE_TONE: Record<string, "destructive" | "warning" | "success" | "secondary"> = {
  COLLSCAN: "destructive",
  SORT: "warning",
  IXSCAN: "success",
  EXPRESS_IXSCAN: "success",
  IDHACK: "success",
  COUNT_SCAN: "success",
  DISTINCT_SCAN: "success",
  PROJECTION_COVERED: "success",
};

const n = (x: number | undefined) => (x === undefined ? null : x.toLocaleString("en-US"));

function StageTree({ node, depth = 0 }: { node: PlanNode; depth?: number }) {
  const stats = [
    node.nReturned !== undefined && `${n(node.nReturned)} returned`,
    node.docsExamined !== undefined && `${n(node.docsExamined)} docs examined`,
    node.keysExamined !== undefined && `${n(node.keysExamined)} keys examined`,
    node.timeMs !== undefined && `~${n(node.timeMs)} ms`,
  ].filter(Boolean);
  return (
    <li>
      <div className={cn("border-border bg-foreground/[0.02] rounded-xl border p-3", depth > 0 && "mt-2")}>
        <div className="flex flex-wrap items-center gap-2">
          {node.label && <span className="text-muted-foreground font-mono text-xs">{node.label}</span>}
          <Badge variant={STAGE_TONE[node.stage] ?? "secondary"} className="font-mono">
            {node.stage}
          </Badge>
          {node.indexName && <span className="font-mono text-xs">index {node.indexName}</span>}
          {node.keyPattern && <span className="text-muted-foreground font-mono text-xs">{JSON.stringify(node.keyPattern)}</span>}
          {node.sortPattern && <span className="text-muted-foreground font-mono text-xs">sort {JSON.stringify(node.sortPattern)}</span>}
          {node.usedDisk && <Badge variant="destructive">used disk</Badge>}
          {node.isMultiKey && <Badge variant="secondary">multikey</Badge>}
        </div>
        {stats.length > 0 && <p className="text-muted-foreground mt-1.5 text-xs">{stats.join(" · ")}</p>}
        {node.filter !== undefined && node.filter !== null && (
          <p className="text-muted-foreground mt-1.5 font-mono text-xs break-all">filter {JSON.stringify(node.filter)}</p>
        )}
      </div>
      {node.children.length > 0 && (
        <ul className="border-border ml-4 border-l pl-4">
          {node.children.map((c, i) => (
            <StageTree key={i} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Summary({ report }: { report: ExplainReport }) {
  return (
    <>
      {report.sections.map((s, i) => {
        const ratio = s.nReturned && s.totalDocsExamined !== undefined ? s.totalDocsExamined / s.nReturned : undefined;
        return (
          <Panel key={i} title={report.sections.length > 1 ? `Plan: ${s.label}` : `Plan${s.namespace ? ` for ${s.namespace}` : ""}`}>
            {(s.nReturned !== undefined || s.totalDocsExamined !== undefined) && (
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Returned" value={n(s.nReturned) ?? "-"} />
                <Stat
                  label="Docs examined"
                  value={n(s.totalDocsExamined) ?? "-"}
                  hint={
                    ratio !== undefined
                      ? `${ratio < 10 ? ratio.toFixed(1) : Math.round(ratio).toLocaleString("en-US")} per result`
                      : undefined
                  }
                  tone={ratio !== undefined ? (ratio > 10 ? "warning" : "good") : undefined}
                />
                <Stat label="Keys examined" value={n(s.totalKeysExamined) ?? "-"} />
                <Stat label="Time" value={s.executionTimeMillis !== undefined ? `${n(s.executionTimeMillis)} ms` : "-"} />
              </div>
            )}
            {s.root ? (
              <>
                <p className="text-muted-foreground mb-2 text-xs">Stages run from the innermost (bottom) up to the top.</p>
                <ul>
                  <StageTree node={s.root} />
                </ul>
              </>
            ) : (
              <p className="text-muted-foreground text-sm">No plan tree in this section.</p>
            )}
          </Panel>
        );
      })}
      {report.pipeline.length > 0 && (
        <Panel title="Pipeline stages after the query">
          <ol className="grid gap-2 text-sm">
            {report.pipeline.map((p, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground w-5 text-right font-mono text-xs">{i + 1}</span>
                <Badge variant="secondary" className="font-mono">
                  {p.name}
                </Badge>
                {p.detail && <span className="text-muted-foreground text-xs">{p.detail}</span>}
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </>
  );
}

export function ExplainPlanTool() {
  const [input, setInput] = useState(EXAMPLE);
  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return { report: analyzeExplain(toPlain(parseEJson(input))) };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [input]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Panel
        title={<label htmlFor="explain-input">explain() output (JSON or mongosh)</label>}
        actions={
          <>
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput(EXAMPLE)}>
              Example
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setInput("")}>
              Clear
            </Button>
          </>
        }
        className="lg:sticky lg:top-24 lg:self-start"
      >
        <Textarea
          id="explain-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          wrap="off"
          rows={22}
          className={`${monoArea} min-h-[30rem]`}
          aria-invalid={!!result && "error" in result}
          placeholder={'db.orders.find({ ... }).explain("executionStats")'}
        />
        {result && "error" in result && <ErrorText>{result.error}</ErrorText>}
        <p className="text-muted-foreground mt-2 text-xs">
          Tip: run <code className="font-mono">.explain(&quot;executionStats&quot;)</code> for real counts. Find, aggregate, count,
          distinct, sharded and SBE plans are supported.
        </p>
      </Panel>

      <div className="grid content-start gap-4">
        {result && "report" in result && result.report && (
          <>
            <Panel title="Findings">
              <div className="grid gap-2">
                {result.report.findings.length === 0 && <Notice level="good" title="Nothing stands out in this plan" />}
                {result.report.findings.map((f, i) => (
                  <Notice key={i} level={f.level} title={f.title}>
                    {f.detail}
                  </Notice>
                ))}
              </div>
            </Panel>
            {result.report.suggestions.map((s, i) => (
              <Panel key={i} title="Suggested index" actions={<CopyText value={s.command} />}>
                <CodeBlock value={s.command} wrap />
                <p className="text-muted-foreground mt-2 text-xs">
                  {s.reason} Check it against your other queries and existing indexes before creating it; every index slows writes a little.
                </p>
              </Panel>
            ))}
            <Summary report={result.report} />
          </>
        )}
      </div>
    </div>
  );
}

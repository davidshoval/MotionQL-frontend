// Self-checks for the free tools' parsing and size logic (src/lib/tools).
// Run: npm run test:tools   (Node 22.18+ runs the TypeScript sources directly.)
// The fixtures in ./fixtures were produced by a real MongoDB 7.0 server: explain() output and
// $bsonSize results, so the size calculator is checked against the server's own numbers. (In
// bson-sizes.json, "dbl" was written as Double(5); mongosh read it back as a plain number, so the
// fixture spells it {"$numberDouble": "5.0"} to match what the server stored and measured.)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseEJson, stringifyEJson, toPlain } from "../src/lib/tools/ejson.ts";
import { analyzeSize, documentSize, BSON_MAX_SIZE } from "../src/lib/tools/bson-size.ts";
import { decodeObjectId, decodeMany, generateObjectIds, objectIdForDate } from "../src/lib/tools/objectid.ts";
import { buildConnectionString, maskConnectionString, parseConnectionString } from "../src/lib/tools/connection-string.ts";
import { analyzeExplain } from "../src/lib/tools/explain.ts";
import { OPERATORS } from "../src/lib/tools/operators.ts";

const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");

/* ---------------- Extended JSON ---------------- */

test("ejson: shell syntax converts to canonical", () => {
  const v = parseEJson(
    `{ _id: ObjectId("507f1f77bcf86cd799439011"), n: NumberLong(5), at: ISODate("2024-01-02T03:04:05Z"), re: /a/i, x: 1, d: 2.5 }`,
  );
  const c = JSON.parse(stringifyEJson(v, "canonical"));
  assert.deepEqual(c, {
    _id: { $oid: "507f1f77bcf86cd799439011" },
    n: { $numberLong: "5" },
    at: { $date: { $numberLong: "1704164645000" } },
    re: { $regularExpression: { pattern: "a", options: "i" } },
    x: { $numberInt: "1" },
    d: { $numberDouble: "2.5" },
  });
});

test("ejson: relaxed output follows the spec", () => {
  const v = parseEJson(
    `{"a": {"$numberInt": "1"}, "b": {"$numberLong": "9007199254740993"}, "c": {"$date": {"$numberLong": "0"}}, "d": {"$numberDouble": "Infinity"}, "e": {"$date": {"$numberLong": "-1000"}}}`,
  );
  const r = JSON.parse(stringifyEJson(v, "relaxed"));
  assert.equal(r.a, 1);
  assert.deepEqual(r.b, { $numberLong: "9007199254740993" }); // unsafe integer keeps its wrapper
  assert.deepEqual(r.c, { $date: "1970-01-01T00:00:00.000Z" });
  assert.deepEqual(r.d, { $numberDouble: "Infinity" });
  assert.deepEqual(r.e, { $date: { $numberLong: "-1000" } }); // before 1970 stays canonical
});

test("ejson: canonical and shell round-trip without losing types", () => {
  for (const { ejson } of JSON.parse(fixture("bson-sizes.json"))) {
    const v = parseEJson(ejson);
    const canonical = stringifyEJson(v, "canonical");
    assert.equal(stringifyEJson(parseEJson(stringifyEJson(v, "shell")), "canonical"), canonical);
    assert.equal(stringifyEJson(parseEJson(canonical), "canonical"), canonical);
    assert.deepEqual(JSON.parse(canonical), JSON.parse(ejson), "canonical output matches mongosh's EJSON.stringify");
  }
});

test("ejson: legacy and lenient inputs", () => {
  const v = parseEJson(`// comment
  { 'a': BinData(0, "AQID"), b: {"$binary": "AQID", "$type": "00"}, c: NumberInt("4"), d: Timestamp(5, 6), e: [1, 2,], f: new Date(0), g: {"$uuid": "123e4567-e89b-12d3-a456-426614174000"} }`);
  const c = JSON.parse(stringifyEJson(v, "canonical"));
  assert.deepEqual(c.a, c.b);
  assert.deepEqual(c.c, { $numberInt: "4" });
  assert.deepEqual(c.d, { $timestamp: { t: 5, i: 6 } });
  assert.equal(c.e.length, 2);
  assert.equal(
    stringifyEJson(parseEJson(`{"g": {"$uuid": "123e4567-e89b-12d3-a456-426614174000"}}`), "shell").includes(
      "UUID('123e4567-e89b-12d3-a456-426614174000')",
    ),
    true,
  );
});

test("ejson: query operators are not mistaken for type wrappers", () => {
  const c = JSON.parse(stringifyEJson(parseEJson(`{ qty: { $gt: 5 }, $or: [{ a: 1 }] }`), "relaxed"));
  assert.deepEqual(c, { qty: { $gt: 5 }, $or: [{ a: 1 }] });
});

test("ejson: errors carry a position", () => {
  assert.throws(() => parseEJson(`{ a: 1,\n b: }`), /line 2/);
  assert.throws(() => parseEJson(`{ "_id": {"$oid": "123"} }`), /24 hex/);
  assert.throws(() => parseEJson(`NumberLong("99999999999999999999")`), /64-bit/);
});

/* ---------------- BSON size ---------------- */

test("bson size matches the server's $bsonSize", () => {
  for (const { ejson, size } of JSON.parse(fixture("bson-sizes.json"))) {
    assert.equal(documentSize(parseEJson(ejson)), size, ejson.slice(0, 60));
  }
});

test("bson size report lists biggest fields and the 16 MB limit", () => {
  const r = analyzeSize(parseEJson(`{ a: "x".repeat }`.replace('"x".repeat', `"${"x".repeat(1000)}"`)));
  assert.equal(r.bytes, 4 + 1 + (1 + 2 + 4 + 1000 + 1));
  assert.equal(r.largest[0].path, "a");
  assert.equal(BSON_MAX_SIZE, 16777216);
  const nested = analyzeSize(parseEJson(`{ a: { b: [1, 2] } }`));
  assert.deepEqual(
    nested.largest.map((f) => f.path),
    ["a", "a.b", "a.b.0", "a.b.1"],
  );
});

/* ---------------- ObjectId ---------------- */

test("objectid: decode", () => {
  const d = decodeObjectId(`ObjectId("507f1f77bcf86cd799439011")`);
  assert.equal(d.seconds, 0x507f1f77);
  assert.equal(d.date.toISOString(), "2012-10-17T21:13:27.000Z");
  assert.equal(d.random, "bcf86cd799");
  assert.equal(d.counter, 0x439011);
  const many = decodeMany(`507f1f77bcf86cd799439011\n\n{"$oid": "65a1b2c3d4e5f60718293a4b"}\nnope`);
  assert.equal(many.length, 3);
  assert.ok(many[2].error);
});

test("objectid: generate", () => {
  const date = new Date("2024-05-01T00:00:00Z");
  const ids = generateObjectIds(3, date);
  assert.equal(new Set(ids).size, 3);
  for (const id of ids) assert.equal(decodeObjectId(id).date.getTime(), date.getTime());
  assert.equal(decodeObjectId(ids[1]).counter, (decodeObjectId(ids[0]).counter + 1) & 0xffffff);
  assert.equal(objectIdForDate(date), "663186000000000000000000");
});

/* ---------------- Connection string ---------------- */

test("connection string: parse standard URI", () => {
  const r = parseConnectionString(
    "mongodb://app%40corp:p%40ss%3Aw0rd@db1:27017,db2:27018/sales?replicaSet=rs0&authSource=admin&readpreference=secondaryPreferred",
  );
  assert.ok(r.parts);
  assert.equal(r.parts.username, "app@corp");
  assert.equal(r.parts.password, "p@ss:w0rd");
  assert.deepEqual(r.parts.hosts, [
    { host: "db1", port: 27017 },
    { host: "db2", port: 27018 },
  ]);
  assert.equal(r.parts.database, "sales");
  assert.equal(r.parts.options.find((o) => o.key === "readPreference")?.value, "secondaryPreferred");
  assert.equal(r.issues.filter((i) => i.level === "error").length, 0);
});

test("connection string: catches common mistakes", () => {
  const errs = (uri) =>
    parseConnectionString(uri)
      .issues.filter((i) => i.level === "error")
      .map((i) => i.message);
  assert.match(errs("mongodb+srv://u:p@cluster0.abc.mongodb.net:27017/")[0], /cannot have a port/);
  assert.match(errs("mongodb+srv://a.example.com,b.example.com/")[0], /exactly one host/);
  assert.match(errs("mongodb://u:p@ss@host/")[0], /reserved character/);
  assert.match(errs("mongodb://h1,h2/?directConnection=true")[0], /exactly one host/);
  assert.match(errs("mongodb://h/?retryWrites=yes")[0], /true or false/);
  assert.match(errs("mongodb://h/?readPreference=SECONDARY")[0], /Did you mean "secondary"/);
  assert.match(errs("http://h")[0], /must start with/);
  assert.match(errs("mongodb://h:99999")[0], /1 to 65535/);
  assert.match(errs("mongodb://[::1/")[0], /closing bracket/);
});

test("connection string: build round-trips and masks", () => {
  const parts = {
    scheme: "mongodb+srv",
    username: "me@x",
    password: "a/b?c#d",
    hosts: [{ host: "cluster0.abc.mongodb.net" }],
    database: "app",
    options: [
      { key: "retryWrites", value: "true" },
      { key: "authMechanismProperties", value: "ENVIRONMENT:azure,TOKEN_RESOURCE:x" },
    ],
  };
  const uri = buildConnectionString(parts);
  assert.equal(
    uri,
    "mongodb+srv://me%40x:a%2Fb%3Fc%23d@cluster0.abc.mongodb.net/app?retryWrites=true&authMechanismProperties=ENVIRONMENT:azure,TOKEN_RESOURCE:x",
  );
  const back = parseConnectionString(uri);
  assert.equal(back.parts?.password, "a/b?c#d");
  assert.equal(buildConnectionString(parts, { maskPassword: true }).includes("****@"), true);
  assert.equal(maskConnectionString("mongodb://u:s3cr@t@h/db?x=1"), "mongodb://u:****@h/db?x=1");
  assert.equal(maskConnectionString("mongodb://h:27017/"), "mongodb://h:27017/");
  assert.equal(
    buildConnectionString({ scheme: "mongodb", hosts: [{ host: "localhost", port: 27017 }], options: [] }),
    "mongodb://localhost:27017",
  );
});

/* ---------------- Explain ---------------- */

const explain = (name) => analyzeExplain(toPlain(parseEJson(fixture(name))));

test("explain: collection scan + in-memory sort", () => {
  const r = explain("collscan-sort.json");
  const titles = r.findings.map((f) => f.title).join("\n");
  assert.match(titles, /Collection scan/);
  assert.match(titles, /In-memory \(blocking\) sort/);
  assert.match(titles, /Examined 5,000 documents to return 400/);
  assert.equal(r.sections[0].root?.stage, "SORT");
  assert.equal(r.sections[0].root?.children[0].stage, "COLLSCAN");
  assert.equal(r.suggestions[0].command, "db.orders.createIndex({ status: 1, createdAt: -1, qty: 1 })");
});

test("explain: indexed query is reported as healthy", () => {
  const r = explain("ixscan.json");
  assert.equal(r.findings.filter((f) => f.level === "error").length, 0);
  assert.ok(r.findings.some((f) => f.title.startsWith("Uses an index")));
  assert.equal(r.suggestions.length, 0);
});

test("explain: covered query", () => {
  const r = explain("covered.json");
  assert.ok(
    r.findings.some((f) => f.title.startsWith("Covered query")),
    r.findings.map((f) => f.title).join(", "),
  );
});

test("explain: aggregation pipeline", () => {
  const r = explain("aggregate.json");
  assert.ok(r.sections.length >= 1);
  assert.ok(r.findings.some((f) => /Collection scan/.test(f.title)));
  // The $sort sorts $group output, so it must not end up in the index suggestion.
  assert.equal(r.suggestions[0]?.command, "db.orders.createIndex({ cust: 1 })");
  assert.ok(r.findings.some((f) => f.title === "$sort on computed results"));
});

test("explain: SBE plan uses the classic-style queryPlan tree", () => {
  const r = analyzeExplain({
    explainVersion: "2",
    queryPlanner: {
      namespace: "app.users",
      winningPlan: { queryPlan: { stage: "COLLSCAN", filter: { email: { $eq: "a@b.c" } } }, slotBasedPlan: {} },
    },
    executionStats: {
      nReturned: 1,
      totalDocsExamined: 1000,
      totalKeysExamined: 0,
      executionTimeMillis: 3,
      executionStages: { stage: "filter" },
    },
  });
  assert.equal(r.sections[0].root?.stage, "COLLSCAN");
  assert.equal(r.sections[0].engine, "SBE");
  assert.equal(r.suggestions[0].command, "db.users.createIndex({ email: 1 })");
});

test("explain: sharded plan shows each shard", () => {
  const r = analyzeExplain({
    queryPlanner: {
      winningPlan: {
        stage: "SHARD_MERGE",
        shards: [
          { shardName: "s0", winningPlan: { stage: "COLLSCAN" } },
          { shardName: "s1", winningPlan: { stage: "FETCH", inputStage: { stage: "IXSCAN", indexName: "a_1" } } },
        ],
      },
    },
  });
  const root = r.sections[0].root;
  assert.equal(root?.stage, "SHARD_MERGE");
  assert.deepEqual(
    root?.children.map((c) => c.label),
    ["s0", "s1"],
  );
  assert.equal(root?.children[1].children[0].indexName, "a_1");
});

test("explain: queryPlanner verbosity", () => {
  const r = explain("queryplanner.json");
  assert.equal(r.hasExecutionStats, false);
  assert.ok(r.findings.some((f) => f.title === "No execution statistics"));
});

test("explain: rejects unrelated JSON", () => {
  assert.throws(() => analyzeExplain({ hello: 1 }), /explain/);
});

/* ---------------- Operators ---------------- */

test("operators: unique names per category and docs links", () => {
  const seen = new Set();
  for (const o of OPERATORS) {
    const key = `${o.group}:${o.category}:${o.name}`;
    assert.ok(!seen.has(key), `duplicate ${key}`);
    seen.add(key);
    assert.match(o.docs, /^https:\/\/www\.mongodb\.com\/docs\/manual\/reference\//);
  }
  assert.ok(OPERATORS.length > 100);
});

"use client";

import { motion } from "motion/react";
import {
  ArrowLeftRight,
  CalendarClock,
  ChartColumn,
  FileSpreadsheet,
  FileCode2,
  Network,
  Rows3,
  ScanEye,
  SquareTerminal,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";

function Tile({
  icon: Icon,
  title,
  body,
  className,
  children,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={cn("min-w-0", className)}>
      <SpotlightCard className="flex h-full flex-col">
        <div className="border-border relative flex min-h-44 flex-1 items-center overflow-hidden border-b bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_2%,transparent),transparent)]">
          {children}
        </div>
        <div className="p-6">
          <h3 className="flex items-center gap-2 font-semibold tracking-tight">
            <Icon className="text-primary size-4" />
            {title}
          </h3>
          <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{body}</p>
        </div>
      </SpotlightCard>
    </Reveal>
  );
}

const code = "font-mono text-[12px]";

function EnginesVisual() {
  const engines = [
    { n: "PostgreSQL", b: "PG" },
    { n: "MySQL", b: "MY" },
    { n: "SQL Server", b: "MS" },
    { n: "Oracle", b: "OR" },
    { n: "MongoDB", b: "MG" },
    { n: "Redis", b: "RD" },
    { n: "ClickHouse", b: "CH" },
    { n: "Snowflake", b: "SF" },
    { n: "BigQuery", b: "BQ" },
    { n: "Elasticsearch", b: "ES" },
    { n: "DynamoDB", b: "DY" },
    { n: "Cassandra", b: "CA" },
    { n: "InfluxDB", b: "IX" },
    { n: "Neo4j", b: "N4" },
    { n: "SQLite", b: "SL" },
    { n: "DuckDB", b: "DK" },
  ];
  return (
    <div className="grid w-full grid-cols-2 gap-2 p-6 sm:grid-cols-4">
      {engines.map((e, i) => (
        <motion.div
          key={e.n}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.04 * i, duration: 0.4 }}
          className="border-border bg-background/60 flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-[13px]"
        >
          <span className={cn(code, "border-primary/30 bg-primary/10 text-primary shrink-0 rounded px-1 text-[10px]")}>{e.b}</span>
          <span className="truncate">{e.n}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ShellVisual() {
  const lines = [
    { p: "shop=#", c: "\\dt demo_store.*", tone: "text-brand-sky" },
    { p: "cache>", c: "ZREVRANGE top:products 0 4", tone: "text-destructive" },
    { p: "graph>", c: "MATCH (c)-[:BOUGHT]->(p) RETURN p", tone: "text-success" },
    { p: "shop>", c: "db.orders.find({ total: { $gt: 500 } })", tone: "text-primary" },
  ];
  return (
    <div className={cn(code, "w-full space-y-2 p-6 leading-relaxed")}>
      {lines.map((l) => (
        <p key={l.p} className="truncate">
          <span className={l.tone}>{l.p}</span> {l.c}
        </p>
      ))}
    </div>
  );
}

function SqlVisual() {
  return (
    <div className={cn(code, "grid h-full grid-rows-[auto_auto_auto] content-center gap-2 p-6")}>
      <div className="border-border bg-background/60 rounded-xl border p-3">
        <span className="text-brand-sky">SELECT</span> country, <span className="text-brand-sky">SUM</span>(total)
        <br />
        <span className="text-brand-sky">FROM</span> orders <span className="text-brand-sky">GROUP BY</span> country
      </div>
      <div className="text-muted-foreground flex justify-center">↓ explain</div>
      <div className="border-primary/25 bg-primary/[0.06] text-muted-foreground rounded-xl border p-3">
        <span className="text-primary">HashAggregate</span> → Hash Join → <span className="text-warning">Seq Scan</span> orders
      </div>
    </div>
  );
}

function DiffVisual() {
  const lines = [
    { s: " ", t: '  "sku": "MQ-2041",', c: "" },
    { s: "-", t: '  "price": 49.00,', c: "bg-destructive/10 text-destructive" },
    { s: "+", t: '  "price": 44.10,', c: "bg-success/10 text-success" },
    { s: "+", t: '  "onSale": true,', c: "bg-success/10 text-success" },
    { s: " ", t: '  "stock": 182', c: "" },
  ];
  return (
    <div className={cn(code, "p-6")}>
      <div className="text-muted-foreground mb-3 flex items-center gap-2">
        <span className="bg-foreground/5 rounded px-1.5 py-0.5">staging.products</span>
        <ArrowLeftRight className="size-3.5" />
        <span className="bg-foreground/5 rounded px-1.5 py-0.5">prod.products</span>
      </div>
      {lines.map((l, i) => (
        <p key={i} className={cn("rounded px-2 py-0.5", l.c)}>
          <span className="mr-2 opacity-60">{l.s}</span>
          {l.t}
        </p>
      ))}
    </div>
  );
}

function FormatsVisual() {
  const formats = ["CSV", "JSON", "JSON Lines", "Excel", "Markdown", "SQL INSERT", "BSON"];
  return (
    <div className="flex h-full flex-wrap content-center items-center justify-center gap-2 p-6">
      {formats.map((f, i) => (
        <motion.span
          key={f}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="border-border bg-background/70 rounded-full border px-3 py-1.5 font-mono text-[12px]"
        >
          .{f.toLowerCase().replace(/\s/g, "")}
        </motion.span>
      ))}
    </div>
  );
}

function LogsVisual() {
  const ops = [
    { q: "SELECT … FROM orders WHERE status = $1", ms: 412, w: 92 },
    { q: "db.events.aggregate([{ $match … }])", ms: 268, w: 64 },
    { q: "SCAN 0 MATCH session:*", ms: 121, w: 34 },
    { q: "MATCH (c:Customer)-[:BOUGHT]->(p)", ms: 74, w: 20 },
  ];
  return (
    <div className="w-full space-y-3 p-6">
      {ops.map((o, i) => (
        <div key={o.q} className="grid grid-cols-[1fr_3.5rem] items-center gap-3">
          <div className="min-w-0">
            <p className={cn(code, "text-muted-foreground truncate")}>{o.q}</p>
            <div className="bg-foreground/5 mt-1 h-1.5 overflow-hidden rounded-full">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: `${o.w}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1 * i }}
                className="bg-primary block h-full"
              />
            </div>
          </div>
          <span className={cn(code, "text-right")}>{o.ms} ms</span>
        </div>
      ))}
    </div>
  );
}

function TasksVisual() {
  const runs = ["Nightly export: orders → CSV", "Copy prod → staging (masked)", "Refresh dashboard: revenue"];
  return (
    <div className="space-y-2 p-6">
      {runs.map((r, i) => (
        <div key={r} className="border-border bg-background/60 flex items-center gap-3 rounded-xl border px-3 py-2 text-[13px]">
          <span className={cn("size-2 rounded-full", i === 1 ? "bg-warning animate-pulse" : "bg-success")} />
          <span className="flex-1 truncate">{r}</span>
          <span className={cn(code, "text-muted-foreground")}>{["02:00", "every 6h", "Mon 09:00"][i]}</span>
        </div>
      ))}
    </div>
  );
}

function MaskVisual() {
  return (
    <div className={cn(code, "grid h-full content-center gap-2 p-6")}>
      {[
        ["ava.thompson@acme.io", "a••••••@acme.io"],
        ["+1 512 555 0142", "+1 512 ••• ••••"],
        ["4111 1111 1111 1111", "•••• •••• •••• 1111"],
      ].map(([a, b]) => (
        <div key={a} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <span className="text-muted-foreground decoration-destructive/50 truncate line-through">{a}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-primary truncate">{b}</span>
        </div>
      ))}
    </div>
  );
}

function ChartVisual() {
  const bars = [38, 62, 45, 80, 56, 92, 70];
  return (
    <div className="flex h-full items-end gap-2 p-6 pb-5">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="from-primary/30 to-primary flex-1 rounded-t-md bg-gradient-to-t"
        />
      ))}
    </div>
  );
}

function ErVisual() {
  return (
    <svg viewBox="0 0 320 170" className="h-full w-full p-4" aria-hidden>
      <g className="fill-background/70 stroke-border" strokeWidth="1">
        <rect x="14" y="20" width="96" height="62" rx="10" />
        <rect x="210" y="14" width="96" height="62" rx="10" />
        <rect x="112" y="102" width="96" height="56" rx="10" />
      </g>
      <g className="fill-foreground font-mono" fontSize="10">
        <text x="26" y="38" className="fill-primary">
          customers
        </text>
        <text x="26" y="56" className="fill-muted-foreground">
          id
        </text>
        <text x="26" y="70" className="fill-muted-foreground">
          email
        </text>
        <text x="222" y="32" className="fill-primary">
          orders
        </text>
        <text x="222" y="50" className="fill-muted-foreground">
          customer_id
        </text>
        <text x="222" y="64" className="fill-muted-foreground">
          product_id
        </text>
        <text x="124" y="120" className="fill-primary">
          products
        </text>
        <text x="124" y="138" className="fill-muted-foreground">
          sku
        </text>
      </g>
      <g fill="none" strokeWidth="1.5" strokeDasharray="4 4" className="stroke-primary/70">
        <path d="M110 50 C160 50 160 46 210 46" />
        <path d="M258 76 C258 110 230 128 208 128" />
      </g>
    </svg>
  );
}

export function Bento() {
  return (
    <section id="features" className="container-page py-28">
      <SectionHeading
        eyebrow="One app, every job"
        title="Every database. One set of habits."
        description="Stop switching between pgAdmin, a Redis GUI, Compass, Kibana and a pile of scripts. MotionQL gives each database its own tools inside one workspace."
      />
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Tile
          className="md:col-span-4"
          icon={Workflow}
          title="60+ databases, each with its own tools"
          body="Relational, document, key-value, warehouse, search, time-series and graph. Not one generic grid: a key browser for Redis, Discover for Elasticsearch, Cypher graphs for Neo4j, aggregation for MongoDB."
        >
          <EnginesVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={SquareTerminal}
          title="A console for every engine"
          body="psql-style commands, Redis, Cypher, CQL, Flux and mongosh, with autocomplete and history."
          delay={0.05}
        >
          <ShellVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={FileCode2}
          title="SQL editor and query builder"
          body="Autocomplete from your schema, visual EXPLAIN plans, and a drag-and-drop builder that joins on foreign keys."
          delay={0.05}
        >
          <SqlVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={ArrowLeftRight}
          title="Compare, sync and migrate"
          body="Diff tables or collections, preview the changes, and move data between databases with type mapping."
          delay={0.1}
        >
          <DiffVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={FileSpreadsheet}
          title="Import and export anything"
          body="CSV, JSON, Excel, SQL INSERT and more, from a table, a collection or any query result. Streamed with progress and cancel."
          delay={0.15}
        >
          <FormatsVisual />
        </Tile>
        <Tile
          className="md:col-span-3"
          icon={Rows3}
          title="Logs & analytics"
          body="The server's own log, slow operations grouped by shape and live metrics, the same way for every database."
        >
          <LogsVisual />
        </Tile>
        <Tile
          className="md:col-span-3"
          icon={Network}
          title="ER diagrams"
          body="Diagrams from foreign keys in SQL databases and inferred relationships in MongoDB. Export to PNG, SVG or Mermaid."
          delay={0.05}
        >
          <ErVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={CalendarClock}
          title="Scheduled tasks"
          body="Exports, copies, syncs and scripts on a schedule, even while the app is closed, plus a --cli."
        >
          <TasksVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={ScanEye}
          title="Data masking"
          body="Eleven masking methods with preview, so you can share realistic data without sharing real people."
          delay={0.05}
        >
          <MaskVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={ChartColumn}
          title="Dashboards"
          body="Charts on live query results from any database, with shared filters, auto refresh and PDF export."
          delay={0.1}
        >
          <ChartVisual />
        </Tile>
      </div>
    </section>
  );
}

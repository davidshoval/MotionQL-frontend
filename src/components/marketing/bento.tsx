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

function PipelineVisual() {
  const stages = [
    { op: "$match", arg: '{ status: "shipped" }', n: "48,210" },
    { op: "$group", arg: '{ _id: "$customer.city", revenue: { $sum: "$total" } }', n: "312" },
    { op: "$sort", arg: "{ revenue: -1 }", n: "312" },
    { op: "$limit", arg: "5", n: "5" },
  ];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-6">
      {stages.map((s, i) => (
        <motion.div
          key={s.op}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <span className="border-border text-muted-foreground grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[10px]">
            {i + 1}
          </span>
          <div className={cn(code, "border-border bg-background/60 flex min-w-0 flex-1 items-center gap-2 rounded-xl border px-3 py-2")}>
            <span className="text-brand-violet">{s.op}</span>
            <span className="text-muted-foreground truncate">{s.arg}</span>
          </div>
          <span className={cn(code, "text-primary w-16 shrink-0 text-right")}>{s.n}</span>
        </motion.div>
      ))}
      <p className={cn(code, "text-muted-foreground mt-1 pl-9")}>documents after each stage, previewed as you type</p>
    </div>
  );
}

function ShellVisual() {
  return (
    <div className={cn(code, "space-y-1.5 p-6 leading-relaxed")}>
      <p>
        <span className="text-primary">shop&gt;</span> db.orders.find({"{"} total: {"{"} <span className="text-brand-violet">$gt</span>:{" "}
        <span className="text-warning">500</span> {"}"} {"}"})
      </p>
      <p className="text-muted-foreground">
        {" "}
        .sort({"{"} createdAt: <span className="text-warning">-1</span> {"}"}).limit(<span className="text-warning">20</span>)
      </p>
      <div className="border-border bg-popover/90 mt-3 w-fit rounded-lg border p-1 shadow-lg">
        {["limit", "lean", "length"].map((s, i) => (
          <p key={s} className={cn("rounded px-2 py-0.5", i === 0 && "bg-primary/15 text-primary")}>
            .{s}()
          </p>
        ))}
      </div>
    </div>
  );
}

function SqlVisual() {
  return (
    <div className={cn(code, "grid h-full grid-rows-[auto_auto_auto] content-center gap-2 p-6")}>
      <div className="border-border bg-background/60 rounded-xl border p-3">
        <span className="text-brand-sky">SELECT</span> city, <span className="text-brand-sky">SUM</span>(total)
        <br />
        <span className="text-brand-sky">FROM</span> orders <span className="text-brand-sky">GROUP BY</span> city
      </div>
      <div className="text-muted-foreground flex justify-center">↓ translated</div>
      <div className="border-primary/25 bg-primary/[0.06] text-muted-foreground rounded-xl border p-3">
        [{"{"} <span className="text-brand-violet">$group</span>: {"{"} _id: <span className="text-primary">&quot;$city&quot;</span> … {"}"}{" "}
        {"}"}]
      </div>
    </div>
  );
}

function DiffVisual() {
  const lines = [
    { s: " ", t: '  "sku": "XQ-2041",', c: "" },
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
  const formats = ["JSON", "JSON Lines", "CSV", "Excel", "BSON", "SQL INSERT", "mongodump"];
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

function SchemaVisual() {
  const fields = [
    {
      f: "email",
      types: [
        { t: "string", w: 97 },
        { t: "null", w: 3 },
      ],
    },
    {
      f: "total",
      types: [
        { t: "double", w: 82 },
        { t: "int", w: 18 },
      ],
    },
    {
      f: "tags",
      types: [
        { t: "array", w: 64 },
        { t: "missing", w: 36 },
      ],
    },
    { f: "createdAt", types: [{ t: "date", w: 100 }] },
  ];
  const tone = ["bg-primary", "bg-brand-sky", "bg-brand-violet"];
  return (
    <div className="w-full space-y-4 p-6">
      {fields.map((r) => (
        <div key={r.f} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
          <span className={cn(code, "text-muted-foreground")}>{r.f}</span>
          <div className="bg-foreground/5 flex h-2.5 overflow-hidden rounded-full">
            {r.types.map((t, i) => (
              <motion.span
                key={t.t}
                initial={{ width: 0 }}
                whileInView={{ width: `${t.w}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1 * i }}
                className={cn("h-full", tone[i])}
                title={`${t.t} ${t.w}%`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TasksVisual() {
  const runs = ["Nightly export → S3 folder", "Sync staging ← prod (masked)", "Index review: orders"];
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
          _id
        </text>
        <text x="26" y="70" className="fill-muted-foreground">
          email
        </text>
        <text x="222" y="32" className="fill-primary">
          orders
        </text>
        <text x="222" y="50" className="fill-muted-foreground">
          customerId
        </text>
        <text x="222" y="64" className="fill-muted-foreground">
          items[]
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
        title="From first query to production migration"
        description="XQuery covers the full life of a MongoDB project, so you stop switching between a GUI, a shell, a migration tool and a pile of scripts."
      />
      <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Tile
          className="md:col-span-4"
          icon={Workflow}
          title="Aggregation editor with stage-by-stage preview"
          body="Build pipelines stage by stage and see the documents after every stage. Full operator library, templates, and one click from a find to a pipeline."
        >
          <PipelineVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={SquareTerminal}
          title="IntelliShell"
          body="mongosh-style commands with autocomplete, history and snippets. Parsed, never eval'd."
          delay={0.05}
        >
          <ShellVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={FileCode2}
          title="SQL Query"
          body="Write SELECT with joins and GROUP BY. XQuery translates it to a find or an aggregation."
          delay={0.05}
        >
          <SqlVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={ArrowLeftRight}
          title="Data Compare & Sync"
          body="Field-level diffs between any two collections, a dry-run preview, then sync only what you choose."
          delay={0.1}
        >
          <DiffVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={FileSpreadsheet}
          title="Import and export anything"
          body="Map and type columns, then insert, upsert, replace or merge. Streamed with progress and cancel."
          delay={0.15}
        >
          <FormatsVisual />
        </Tile>
        <Tile
          className="md:col-span-3"
          icon={Rows3}
          title="Schema analysis and history"
          body="See every field's types and coverage, export reports, and track schema drift between snapshots."
        >
          <SchemaVisual />
        </Tile>
        <Tile
          className="md:col-span-3"
          icon={Network}
          title="Data Model diagrams"
          body="ER diagrams inferred from field names, DBRefs and matching values. Export to PNG, SVG or Mermaid."
          delay={0.05}
        >
          <ErVisual />
        </Tile>
        <Tile
          className="md:col-span-2"
          icon={CalendarClock}
          title="Scheduled tasks"
          body="Exports, syncs, dumps and scripts on a schedule, even while the app is closed, plus a --cli."
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
          body="Charts and metrics on live aggregations, with shared filters, auto refresh and PDF export."
          delay={0.1}
        >
          <ChartVisual />
        </Tile>
      </div>
    </section>
  );
}

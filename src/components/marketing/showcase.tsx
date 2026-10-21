"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

// Real screenshots of the desktop app (public/screens), captured against sample data.
const screens = [
  {
    id: "connection-picker",
    label: "60+ databases",
    title: "Pick a database, get its own dialog",
    text: "Relational, document, key-value, warehouse, search, time-series and graph databases, plus the hosted services you use.",
  },
  {
    id: "pg-editor",
    label: "SQL editor",
    title: "SQL editor",
    text: "Autocomplete from your schema, result grids you can chart and export, and a run-as role picker for PostgreSQL.",
  },
  {
    id: "pg-explain",
    label: "Explain",
    title: "Visual EXPLAIN plans",
    text: "Find the sequential scans and expensive joins, and ask the AI what to fix first.",
  },
  {
    id: "sql-query-builder",
    label: "Query builder",
    title: "Visual SQL query builder",
    text: "Click tables and they join on their foreign keys. The SQL updates as you go.",
  },
  {
    id: "pg-performance",
    label: "Insights",
    title: "Server insights",
    text: "pg_stat_statements, activity and locks, vacuum health, an index advisor and roles, without leaving the app.",
  },
  {
    id: "redis-keys",
    label: "Redis",
    title: "Redis and Valkey key browser",
    text: "Browse keys by namespace, edit hashes, lists, sets, sorted sets and streams, and see TTLs and memory.",
  },
  {
    id: "es-discover",
    label: "Elasticsearch",
    title: "Elasticsearch Discover",
    text: "Search an index with a time range, see the hits over time and open any document.",
  },
  {
    id: "neo4j-graph",
    label: "Neo4j",
    title: "Cypher with a graph view",
    text: "Run Cypher and explore the result as a graph or a table.",
  },
  {
    id: "clickhouse-operations",
    label: "ClickHouse",
    title: "ClickHouse query log",
    text: "Queries grouped by shape with calls, time and bytes read, plus merges, mutations and storage.",
  },
  {
    id: "aggregation-stage-preview",
    label: "MongoDB",
    title: "MongoDB aggregation editor",
    text: "See the input and output of every stage while you build the pipeline.",
  },
  {
    id: "logs-analytics",
    label: "Logs & analytics",
    title: "Logs & analytics",
    text: "The server's log, slow operations by shape and live metrics, the same way for every database.",
  },
  {
    id: "er-diagram",
    label: "ER diagram",
    title: "ER diagrams",
    text: "Tables and their foreign keys, laid out for you. Export to PNG, SVG or Mermaid.",
  },
] as const;

export function Showcase({ heading = true }: { heading?: boolean }) {
  const [active, setActive] = useState(0);
  const s = screens[active];
  return (
    <section className="container-page py-28" id="tour">
      {heading && (
        <SectionHeading
          eyebrow="Product tour"
          title="The real app, not a mockup"
          description="Every screen below is MotionQL running against the same sample shop, loaded into each database."
        />
      )}
      <Reveal className={cn("grid gap-6 lg:grid-cols-[220px_1fr]", heading && "mt-14")}>
        <div
          role="tablist"
          aria-label="Screens"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        >
          {screens.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 rounded-xl px-3.5 py-2 text-left text-sm whitespace-nowrap transition",
                i === active
                  ? "bg-primary/12 text-foreground ring-primary/30 ring-1"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
              )}
            >
              {x.label}
            </button>
          ))}
        </div>
        <div className="min-w-0">
          <div className="border-border bg-card relative overflow-hidden rounded-2xl border shadow-[0_40px_120px_-40px_color-mix(in_oklch,var(--primary)_35%,transparent)]">
            <div className="border-border flex items-center gap-1.5 border-b px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="relative aspect-[16/10]">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={s.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <Image
                    src={`/screens/dark-${s.id}.webp`}
                    alt={`${s.title} in MotionQL`}
                    fill
                    sizes="(min-width: 1024px) 960px, 100vw"
                    className="hidden object-cover object-top dark:block"
                    priority={active === 0}
                  />
                  <Image
                    src={`/screens/light-${s.id}.webp`}
                    alt={`${s.title} in MotionQL`}
                    fill
                    sizes="(min-width: 1024px) 960px, 100vw"
                    className="object-cover object-top dark:hidden"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-5" aria-live="polite">
            <p className="font-medium">{s.title}</p>
            <p className="text-muted-foreground mt-1 text-sm">{s.text}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

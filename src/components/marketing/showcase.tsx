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
    id: "collection-tree",
    label: "Documents",
    title: "Tree, table and JSON views",
    text: "Expand nested documents, see every BSON type, and edit in place.",
  },
  {
    id: "query-builder",
    label: "Query builder",
    title: "Visual query builder",
    text: "Pick fields from the schema and combine conditions without writing JSON.",
  },
  {
    id: "aggregation-stage-preview",
    label: "Aggregation",
    title: "Aggregation editor with stage preview",
    text: "See the input and output of every stage while you build the pipeline.",
  },
  {
    id: "sql-query",
    label: "SQL",
    title: "SQL against MongoDB",
    text: "Write SELECT … WHERE … ORDER BY and watch the live MongoDB translation.",
  },
  {
    id: "intellishell",
    label: "IntelliShell",
    title: "IntelliShell",
    text: "A mongosh-style shell with autocomplete and readable output.",
  },
  {
    id: "explain-plan",
    label: "Explain",
    title: "Visual explain plans",
    text: "Spot COLLSCANs and in-memory sorts before they reach production.",
  },
  {
    id: "schema-analysis",
    label: "Schema",
    title: "Schema analysis",
    text: "Types, ranges, averages and how often each field is present.",
  },
  {
    id: "data-compare-sync",
    label: "Compare & Sync",
    title: "Data Compare and Sync",
    text: "Diff two collections document by document and sync the changes.",
  },
  {
    id: "index-review",
    label: "Index review",
    title: "Index review",
    text: "Find redundant indexes and the ones your queries are missing.",
  },
  {
    id: "export-dialog",
    label: "Import / export",
    title: "Import and export",
    text: "JSON, JSONL, CSV, BSON, Excel and SQL INSERT, from any query.",
  },
  {
    id: "connection-safety-settings",
    label: "Safety",
    title: "Per-connection safety",
    text: "Read-only connections, AI opt-in and guards on risky commands, set per connection.",
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
          description="Every screen below is XQuery running against a sample shop database."
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
                    alt={`${s.title} in XQuery`}
                    fill
                    sizes="(min-width: 1024px) 960px, 100vw"
                    className="hidden object-cover object-top dark:block"
                    priority={active === 0}
                  />
                  <Image
                    src={`/screens/light-${s.id}.webp`}
                    alt={`${s.title} in XQuery`}
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

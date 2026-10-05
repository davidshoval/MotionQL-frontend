"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { OPERATOR_GROUPS, searchOperators, type Operator, type OperatorGroup } from "@/lib/tools/operators";
import { cn } from "@/lib/utils";

type Filter = OperatorGroup | "All";

export function OperatorsTool() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState<Filter>("All");
  const results = useMemo(() => searchOperators(q, group), [q, group]);

  // Keep the reference order (by group, then category) when not searching; rank by relevance otherwise.
  const sections = useMemo(() => {
    const map = new Map<string, Operator[]>();
    for (const o of results) {
      const key = q.trim() ? "Results" : `${o.group} · ${o.category}`;
      map.set(key, [...(map.get(key) ?? []), o]);
    }
    return [...map.entries()];
  }, [results, q]);

  return (
    <div>
      <div className="bg-background/80 sticky top-20 z-10 -mx-1 grid gap-3 rounded-2xl px-1 py-3 backdrop-blur-xl">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search operators, e.g. $lookup, date, array, regex"
            aria-label="Search operators"
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by kind">
          {(["All", ...OPERATOR_GROUPS] as Filter[]).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={cn(
                "border-border text-muted-foreground hover:text-foreground cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors",
                group === g && "border-primary/40 bg-primary/10 text-primary hover:text-primary",
              )}
            >
              {g}
            </button>
          ))}
        </div>
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {results.length} operator{results.length === 1 ? "" : "s"}
        </p>
      </div>

      {sections.length === 0 && <p className="text-muted-foreground py-10 text-center">No operator matches “{q}”.</p>}

      <div className="mt-4 grid gap-8">
        {sections.map(([title, ops]) => (
          <section key={title}>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {ops.map((o) => (
                <article key={`${o.group}:${o.category}:${o.name}`} className="border-border bg-card/50 min-w-0 rounded-xl border p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={o.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1 font-mono text-[15px] font-medium hover:underline"
                    >
                      {o.name}
                      <ExternalLink className="size-3 opacity-60" />
                      <span className="sr-only">(MongoDB documentation, opens in a new tab)</span>
                    </a>
                    {q.trim() && (
                      <Badge variant="secondary">
                        {o.group} · {o.category}
                      </Badge>
                    )}
                    {o.since && <Badge variant="secondary">{o.since}+</Badge>}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">{o.description}</p>
                  <pre className="bg-foreground/[0.04] mt-2 rounded-md px-2.5 py-1.5 font-mono text-[12.5px] break-words whitespace-pre-wrap">
                    <code>{o.syntax}</code>
                  </pre>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

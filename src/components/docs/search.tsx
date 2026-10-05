"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, FileText, Hash, Search } from "lucide-react";
import type { SearchEntry } from "@/lib/docs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Hit {
  href: string;
  title: string;
  context: string;
  kind: "page" | "heading";
  score: number;
}

function search(index: SearchEntry[], query: string): Hit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const matches = (text: string) => terms.every((t) => text.toLowerCase().includes(t));
  const hits: Hit[] = [];
  for (const e of index) {
    const page = `${e.title} ${e.description} ${e.section}`;
    if (matches(page)) {
      hits.push({
        href: `/docs/${e.slug}`,
        title: e.title,
        context: e.description,
        kind: "page",
        score: matches(e.title) ? 3 : 1,
      });
    }
    for (const h of e.headings) {
      // A heading hit needs at least one term in the heading itself, so a page title alone doesn't list every heading.
      if (matches(`${h.text} ${e.title}`) && terms.some((t) => h.text.toLowerCase().includes(t))) {
        hits.push({ href: `/docs/${e.slug}#${h.id}`, title: h.text, context: e.title, kind: "heading", score: matches(h.text) ? 2 : 0 });
      }
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 12);
}

export function DocsSearch({ index }: { index: SearchEntry[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const hits = useMemo(() => search(index, query), [index, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, [contenteditable=true]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(hit: Hit | undefined) {
    if (!hit) return;
    setOpen(false);
    setQuery("");
    router.push(hit.href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-border bg-card/50 text-muted-foreground hover:text-foreground flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search docs</span>
        <kbd className="border-border rounded border px-1.5 font-mono text-[10px]">/</kbd>
      </button>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setQuery("");
        }}
      >
        <DialogContent className="top-24 max-w-xl translate-y-0 gap-0 p-0" aria-describedby={undefined}>
          <DialogTitle className="sr-only">Search the documentation</DialogTitle>
          <div className="border-border flex items-center gap-3 border-b px-4">
            <Search className="text-muted-foreground size-4 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((i) => Math.min(i + 1, hits.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  go(hits[active]);
                }
              }}
              placeholder="Search titles and headings…"
              aria-label="Search the documentation"
              className="placeholder:text-muted-foreground h-14 flex-1 bg-transparent pr-8 text-[15px] outline-none"
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query && hits.length === 0 && <p className="text-muted-foreground px-3 py-8 text-center text-sm">No results for “{query}”.</p>}
            {!query && <p className="text-muted-foreground px-3 py-8 text-center text-sm">Try “SSH”, “license”, “explain” or “CSV”.</p>}
            <ul ref={listRef} role="listbox" aria-label="Results">
              {hits.map((h, i) => (
                <li key={h.href} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(h)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left",
                      i === active ? "bg-primary/10" : "hover:bg-foreground/[0.04]",
                    )}
                  >
                    {h.kind === "page" ? (
                      <FileText className="text-primary mt-0.5 size-4 shrink-0" />
                    ) : (
                      <Hash className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{h.title}</span>
                      <span className="text-muted-foreground block truncate text-xs">{h.context}</span>
                    </span>
                    {i === active && <CornerDownLeft className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

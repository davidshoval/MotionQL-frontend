"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Play, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Engine = "PG" | "MG" | "RE" | "CH";

const ENGINE_TONE: Record<Engine, string> = {
  PG: "bg-sky-400/15 text-sky-300 ring-sky-400/25",
  MG: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/25",
  RE: "bg-rose-400/15 text-rose-300 ring-rose-400/25",
  CH: "bg-amber-400/15 text-amber-200 ring-amber-400/25",
};

interface Scene {
  engine: Engine;
  connection: string;
  object: string;
  tab: string;
  label: string;
  query: string;
  columns: { key: string; align?: "right"; hide?: true }[];
  rows: Record<string, string>[];
  badge: string;
  footer: string;
}

// Four connections, four query languages, one window: the scenes cycle through them.
const SCENES: Scene[] = [
  {
    engine: "PG",
    connection: "Shop (PostgreSQL)",
    object: "demo_store.orders",
    tab: "SQL - Shop",
    label: "SQL",
    query: "SELECT country, count(*) AS orders, sum(total) AS revenue FROM orders GROUP BY 1 ORDER BY 3 DESC",
    columns: [
      { key: "country" },
      { key: "orders", align: "right" },
      { key: "revenue", align: "right" },
      { key: "avg_basket", align: "right", hide: true },
    ],
    rows: [
      { country: "United States", orders: "4,212", revenue: "512,390.40", avg_basket: "121.65" },
      { country: "Germany", orders: "2,034", revenue: "248,117.95", avg_basket: "121.98" },
      { country: "United Kingdom", orders: "1,876", revenue: "231,004.10", avg_basket: "123.14" },
      { country: "France", orders: "1,402", revenue: "166,880.25", avg_basket: "119.03" },
      { country: "Spain", orders: "988", revenue: "112,402.60", avg_basket: "113.77" },
      { country: "Canada", orders: "961", revenue: "109,775.00", avg_basket: "114.23" },
      { country: "Japan", orders: "744", revenue: "96,310.80", avg_basket: "129.45" },
    ],
    badge: "Index Only Scan",
    footer: "7 rows · 18 ms",
  },
  {
    engine: "MG",
    connection: "Catalog (MongoDB)",
    object: "shop.orders",
    tab: "orders",
    label: "Filter",
    query: '{ status: "shipped", total: { $gt: 150 } }',
    columns: [
      { key: "_id" },
      { key: "customer.name" },
      { key: "status" },
      { key: "total", align: "right" },
      { key: "items", align: "right", hide: true },
    ],
    rows: [
      { _id: "66f1a2…e41", "customer.name": "Ava Thompson", status: "shipped", total: "248.50", items: "3" },
      { _id: "66f1a2…e43", "customer.name": "Lena Fischer", status: "shipped", total: "179.99", items: "2" },
      { _id: "66f1a2…e45", "customer.name": "Yuki Tanaka", status: "shipped", total: "865.20", items: "5" },
      { _id: "66f1a2…e47", "customer.name": "Omar Haddad", status: "shipped", total: "2,310.00", items: "9" },
      { _id: "66f1a2…e49", "customer.name": "Lucas Silva", status: "shipped", total: "532.40", items: "4" },
      { _id: "66f1a2…e4c", "customer.name": "Sofia Rossi", status: "shipped", total: "1,499.00", items: "8" },
    ],
    badge: "IXSCAN",
    footer: "6 documents · 4 ms",
  },
  {
    engine: "RE",
    connection: "Cache (Valkey)",
    object: "db0",
    tab: "Console - Cache",
    label: "Command",
    query: "ZREVRANGE demo_store:leaderboard:products 0 5 WITHSCORES",
    columns: [{ key: "#", align: "right" }, { key: "member" }, { key: "score", align: "right" }],
    rows: [
      { "#": "1", member: "product:118", score: "9,412" },
      { "#": "2", member: "product:42", score: "8,977" },
      { "#": "3", member: "product:7", score: "8,031" },
      { "#": "4", member: "product:263", score: "7,650" },
      { "#": "5", member: "product:91", score: "7,288" },
      { "#": "6", member: "product:150", score: "6,940" },
    ],
    badge: "0.3 ms",
    footer: "6 members · 0.3 ms",
  },
  {
    engine: "CH",
    connection: "Events (ClickHouse)",
    object: "demo_store.events",
    tab: "SQL - Events",
    label: "SQL",
    query: "SELECT toStartOfDay(ts) AS day, type, count() AS events FROM events GROUP BY day, type ORDER BY day DESC",
    columns: [{ key: "day" }, { key: "type" }, { key: "events", align: "right" }],
    rows: [
      { day: "2025-12-31", type: "page_view", events: "1,204,551" },
      { day: "2025-12-31", type: "add_to_cart", events: "88,310" },
      { day: "2025-12-31", type: "checkout", events: "21,948" },
      { day: "2025-12-30", type: "page_view", events: "1,187,002" },
      { day: "2025-12-30", type: "add_to_cart", events: "86,775" },
      { day: "2025-12-30", type: "checkout", events: "21,330" },
    ],
    badge: "2.1M rows read",
    footer: "6 rows · 41 ms",
  },
];

const CONNECTIONS: { engine: Engine | "MS" | "ES" | "My"; name: string; env: string }[] = [
  { engine: "PG", name: "Shop (PostgreSQL)", env: "bg-rose-400" },
  { engine: "MG", name: "Catalog (MongoDB)", env: "bg-rose-400" },
  { engine: "RE", name: "Cache (Valkey)", env: "bg-amber-400" },
  { engine: "CH", name: "Events (ClickHouse)", env: "bg-amber-400" },
  { engine: "My", name: "Billing (MySQL)", env: "bg-sky-400" },
  { engine: "MS", name: "Finance (SQL Server)", env: "bg-sky-400" },
  { engine: "ES", name: "Search (Elasticsearch)", env: "bg-sky-400" },
];

const badgeTone = (e: string) => ENGINE_TONE[e as Engine] ?? "bg-violet-400/15 text-violet-300 ring-violet-400/25";

function useTyping(text: string, speed = 26) {
  const [state, setState] = useState({ text, n: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      setState((prev) => {
        const n = prev.text === text ? prev.n + 1 : 1;
        if (n >= text.length) clearInterval(t);
        return { text, n };
      });
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return state.text === text ? text.slice(0, state.n) : "";
}

/** A coded, animated replica of MotionQL moving between four databases. Crisp at any size and in both themes. */
export function ProductWindow({ className }: { className?: string }) {
  const [scene, setScene] = useState(0);
  const s = SCENES[scene];
  const typed = useTyping(s.query);
  const done = typed.length === s.query.length;

  useEffect(() => {
    const t = setTimeout(() => setScene((n) => (n + 1) % SCENES.length), 7000);
    return () => clearTimeout(t);
  }, [scene]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1119] text-[12.5px] text-slate-200 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.04)_inset]",
        className,
      )}
      role="img"
      aria-label="MotionQL with PostgreSQL, MongoDB, Valkey, ClickHouse, MySQL, SQL Server and Elasticsearch connections in one sidebar, running a query on each in turn."
    >
      {/* Title bar */}
      <div className="flex h-10 items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center text-[12px] text-slate-400">MotionQL · Acme project</div>
        <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 font-mono text-[10px] text-rose-300 ring-1 ring-rose-400/25">
          production
        </span>
      </div>

      <div className="flex h-[440px] sm:h-[480px]">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-white/[0.07] bg-white/[0.015] p-3 sm:flex">
          <div className="mb-2 px-2 font-mono text-[10px] tracking-widest text-slate-500">ACME · ALL ENVIRONMENTS</div>
          {CONNECTIONS.map((c) => (
            <TreeItem key={c.name} active={c.name === s.connection} engine={c.engine} env={c.env}>
              {c.name}
            </TreeItem>
          ))}
          <div className="mt-auto rounded-xl border border-white/[0.07] bg-gradient-to-br from-emerald-400/[0.08] to-sky-400/[0.05] p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
              <ShieldCheck className="size-3.5" /> Production asks first
            </div>
            <p className="mt-1 text-[10.5px] leading-snug text-slate-400">
              Every write on a production connection is confirmed and audited, on every engine.
            </p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-9 items-end gap-0.5 border-b border-white/[0.07] px-2">
            {SCENES.map((x, i) => (
              <Tab key={x.tab} active={i === scene} engine={x.engine} className={i > 1 ? "hidden md:flex" : undefined}>
                {x.tab}
              </Tab>
            ))}
          </div>

          {/* Query bar */}
          <div className="space-y-2 border-b border-white/[0.07] p-3">
            <div className="flex items-center gap-2">
              <span className="w-16 shrink-0 font-mono text-[11px] text-slate-500">{s.label}</span>
              <div className="flex h-8 min-w-0 flex-1 items-center rounded-lg border border-white/10 bg-black/30 px-2.5 font-mono text-[12px]">
                <SyntaxLine text={typed} />
                <span className={cn("ml-px inline-block h-4 w-[7px] shrink-0 bg-emerald-300/90", done ? "animate-blink" : "")} />
              </div>
              <button
                tabIndex={-1}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-400 px-3 text-[12px] font-semibold text-emerald-950 shadow-[0_0_20px_-4px] shadow-emerald-400/60"
              >
                <Play className="size-3 fill-current" /> Run
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 shrink-0 font-mono text-[11px] text-slate-500">On</span>
              <div className="flex h-7 flex-1 items-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-2.5 font-mono text-[12px] text-slate-300">
                <span className={cn("rounded px-1 text-[10px] ring-1", badgeTone(s.engine))}>{s.engine}</span>
                <span className="truncate">
                  {s.connection} › {s.object}
                </span>
              </div>
              <span className="hidden items-center gap-1 rounded-md bg-emerald-400/10 px-2 py-1 font-mono text-[10.5px] text-emerald-300 ring-1 ring-emerald-400/20 sm:flex">
                <Zap className="size-3" /> {s.badge}
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-[#0d141e] font-mono text-[10.5px] tracking-wide text-slate-500">
                <tr>
                  {s.columns.map((c) => (
                    <th
                      key={c.key}
                      className={cn("px-3 py-2 font-normal", c.align === "right" && "text-right", c.hide && "hidden md:table-cell")}
                    >
                      {c.key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {done &&
                    s.rows.map((r, i) => (
                      <motion.tr
                        key={`${scene}-${i}`}
                        layout
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        className="border-t border-white/[0.05] hover:bg-white/[0.03]"
                      >
                        {s.columns.map((c, k) => (
                          <td
                            key={c.key}
                            className={cn(
                              "px-3 py-2 whitespace-nowrap",
                              c.align === "right"
                                ? "text-right font-mono text-amber-200/90"
                                : k === 0
                                  ? "font-mono text-[11px] text-violet-300/90"
                                  : "",
                              c.hide && "hidden md:table-cell",
                            )}
                          >
                            {r[c.key]}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                </AnimatePresence>
              </tbody>
            </table>
            {!done && (
              <div className="absolute inset-x-0 top-10 space-y-2 px-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-6 animate-pulse rounded bg-white/[0.04]" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b1119] to-transparent" />
          </div>

          <div className="flex h-8 items-center justify-between border-t border-white/[0.07] px-3 font-mono text-[10.5px] text-slate-500">
            <span>{s.object}</span>
            <span>{done ? s.footer : "running…"}</span>
          </div>
        </div>
      </div>

      {/* AI prompt toast */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute right-4 bottom-12 hidden w-72 rounded-xl border border-violet-400/20 bg-[#131a2a]/95 p-3 shadow-2xl backdrop-blur md:block"
      >
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-violet-300">
          <Sparkles className="size-3.5" /> Ask AI
        </div>
        <p className="mt-1.5 text-[12px] text-slate-200">&ldquo;Revenue by country, biggest first&rdquo;</p>
        <p className="mt-1 text-[10.5px] text-slate-500">Schema only. No row values leave your machine.</p>
      </motion.div>
    </div>
  );
}

function TreeItem({ active, engine, env, children }: { active?: boolean; engine: string; env: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors",
        active ? "bg-emerald-400/10 text-emerald-100 ring-1 ring-emerald-400/20" : "text-slate-300",
      )}
    >
      <ChevronRight className="size-3 shrink-0 text-slate-500" />
      <span className={cn("rounded px-1 font-mono text-[9.5px] ring-1", badgeTone(engine))}>{engine}</span>
      <span className="truncate">{children}</span>
      <span className={cn("ml-auto size-1.5 shrink-0 rounded-full", env)} />
    </div>
  );
}

function Tab({ active, engine, children, className }: { active?: boolean; engine: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-t-lg px-3 text-[12px] whitespace-nowrap transition-colors",
        active ? "border border-b-0 border-white/[0.08] bg-[#0b1119] text-slate-100" : "text-slate-500",
        className,
      )}
    >
      <span className={cn("rounded px-1 font-mono text-[9.5px] ring-1", badgeTone(engine))}>{engine}</span>
      {children}
    </div>
  );
}

const KEYWORDS = /^(SELECT|FROM|WHERE|GROUP|BY|ORDER|DESC|AS|ZREVRANGE|WITHSCORES)$/;

/** Tiny highlighter for the scenes: SQL and Redis keywords, MQL operators, strings, numbers, keys. */
function SyntaxLine({ text }: { text: string }) {
  const parts = text.split(/("[^"]*"?|\$\w+|\b[A-Z]{2,}\b|\b\d+(?:\.\d+)?\b|[{}[\]:,()])/g).filter(Boolean);
  return (
    <span className="truncate whitespace-pre">
      {parts.map((p, i) => {
        const cls = KEYWORDS.test(p)
          ? "text-sky-300"
          : p.startsWith("$")
            ? "text-violet-300"
            : p.startsWith('"')
              ? "text-emerald-300"
              : /^\d/.test(p)
                ? "text-amber-200"
                : /^[{}[\]:,]$/.test(p)
                  ? "text-slate-500"
                  : "text-sky-200";
        return (
          <span key={i} className={cls}>
            {p}
          </span>
        );
      })}
    </span>
  );
}

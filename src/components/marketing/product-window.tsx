"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronRight, Database, Play, Sparkles, Table2, Terminal, Workflow, FileCode2, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "shipped" | "pending" | "delivered" | "refunded";
interface Row {
  id: string;
  name: string;
  city: string;
  status: Status;
  total: number;
  items: number;
  date: string;
}

const ROWS: Row[] = [
  { id: "66f1a2…e41", name: "Ava Thompson", city: "Austin", status: "shipped", total: 248.5, items: 3, date: "2026-09-28" },
  { id: "66f1a2…e42", name: "Noah Kim", city: "Seattle", status: "delivered", total: 1290.0, items: 7, date: "2026-09-28" },
  { id: "66f1a2…e43", name: "Lena Fischer", city: "Berlin", status: "shipped", total: 179.99, items: 2, date: "2026-09-27" },
  { id: "66f1a2…e44", name: "Mateo García", city: "Madrid", status: "pending", total: 412.3, items: 4, date: "2026-09-27" },
  { id: "66f1a2…e45", name: "Yuki Tanaka", city: "Osaka", status: "shipped", total: 865.2, items: 5, date: "2026-09-26" },
  { id: "66f1a2…e46", name: "Chloé Martin", city: "Lyon", status: "delivered", total: 102.75, items: 1, date: "2026-09-26" },
  { id: "66f1a2…e47", name: "Omar Haddad", city: "Dubai", status: "shipped", total: 2310.0, items: 9, date: "2026-09-25" },
  { id: "66f1a2…e48", name: "Priya Nair", city: "Pune", status: "refunded", total: 64.0, items: 1, date: "2026-09-25" },
  { id: "66f1a2…e49", name: "Lucas Silva", city: "Lisbon", status: "shipped", total: 532.4, items: 4, date: "2026-09-24" },
  { id: "66f1a2…e4a", name: "Emma Jansen", city: "Berlin", status: "delivered", total: 1045.0, items: 6, date: "2026-09-24" },
  { id: "66f1a2…e4b", name: "Kofi Mensah", city: "Accra", status: "shipped", total: 318.9, items: 3, date: "2026-09-23" },
  { id: "66f1a2…e4c", name: "Sofia Rossi", city: "Madrid", status: "shipped", total: 1499.0, items: 8, date: "2026-09-23" },
  { id: "66f1a2…e4d", name: "Liam O'Brien", city: "Lyon", status: "pending", total: 87.5, items: 1, date: "2026-09-22" },
  { id: "66f1a2…e4e", name: "Hana Novak", city: "Prague", status: "shipped", total: 954.0, items: 5, date: "2026-09-22" },
];

const SCENES = [
  {
    query: '{ status: "shipped", total: { $gt: 150 } }',
    filter: (r: Row) => r.status === "shipped" && r.total > 150,
    plan: "IXSCAN",
    ms: 4,
  },
  {
    query: '{ "customer.city": { $in: ["Berlin", "Lyon", "Madrid"] } }',
    filter: (r: Row) => ["Berlin", "Lyon", "Madrid"].includes(r.city),
    plan: "IXSCAN",
    ms: 6,
  },
  { query: "{ total: { $gte: 800 } }", filter: (r: Row) => r.total >= 800, plan: "IXSCAN", ms: 3 },
];

const statusTone: Record<Status, string> = {
  shipped: "bg-sky-400/12 text-sky-300 ring-sky-400/25",
  delivered: "bg-emerald-400/12 text-emerald-300 ring-emerald-400/25",
  pending: "bg-amber-400/12 text-amber-300 ring-amber-400/25",
  refunded: "bg-rose-400/12 text-rose-300 ring-rose-400/25",
};

function useTyping(text: string, speed = 32) {
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

/** A coded, animated replica of the MotionQL collection tab. Crisp at any size and in both themes. */
export function ProductWindow({ className }: { className?: string }) {
  const [scene, setScene] = useState(0);
  const s = SCENES[scene];
  const typed = useTyping(s.query);
  const done = typed.length === s.query.length;

  useEffect(() => {
    const t = setTimeout(() => setScene((n) => (n + 1) % SCENES.length), 6500);
    return () => clearTimeout(t);
  }, [scene]);

  const rows = ROWS.filter(s.filter);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1119] text-[12.5px] text-slate-200 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.7),0_0_0_1px_rgb(255_255_255/0.04)_inset]",
        className,
      )}
      role="img"
      aria-label="The MotionQL collection tab: a filter on shop.orders returns matching documents in a table, with an index scan in 4 ms."
    >
      {/* Title bar */}
      <div className="flex h-10 items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 text-center text-[12px] text-slate-400">MotionQL — Production cluster</div>
        <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 font-mono text-[10px] text-rose-300 ring-1 ring-rose-400/25">prod</span>
      </div>

      <div className="flex h-[440px] sm:h-[480px]">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-white/[0.07] bg-white/[0.015] p-3 sm:flex">
          <div className="mb-2 px-2 font-mono text-[10px] tracking-widest text-slate-500">CONNECTIONS</div>
          <TreeItem depth={0} open icon={<span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />}>
            Production cluster
          </TreeItem>
          <TreeItem depth={1} open icon={<Database className="size-3.5 text-slate-400" />}>
            shop
          </TreeItem>
          <TreeItem depth={2} active icon={<Table2 className="size-3.5" />}>
            orders
          </TreeItem>
          <TreeItem depth={2} icon={<Table2 className="size-3.5 text-slate-500" />}>
            customers
          </TreeItem>
          <TreeItem depth={2} icon={<Table2 className="size-3.5 text-slate-500" />}>
            products
          </TreeItem>
          <TreeItem depth={1} icon={<Database className="size-3.5 text-slate-400" />}>
            analytics
          </TreeItem>
          <TreeItem depth={0} icon={<span className="size-2 rounded-full bg-amber-400" />}>
            Staging
          </TreeItem>
          <TreeItem depth={0} icon={<span className="size-2 rounded-full bg-sky-400" />}>
            localhost:27017
          </TreeItem>
          <div className="mt-auto rounded-xl border border-white/[0.07] bg-gradient-to-br from-emerald-400/[0.08] to-sky-400/[0.05] p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-300">
              <ShieldCheck className="size-3.5" /> Read-only connection
            </div>
            <p className="mt-1 text-[10.5px] leading-snug text-slate-400">Writes are blocked in the app, including $out and $merge.</p>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-9 items-end gap-0.5 border-b border-white/[0.07] px-2">
            <Tab active icon={<Table2 className="size-3.5" />}>
              orders
            </Tab>
            <Tab icon={<Terminal className="size-3.5" />}>IntelliShell</Tab>
            <Tab icon={<Workflow className="size-3.5" />}>Aggregation</Tab>
            <Tab icon={<FileCode2 className="size-3.5" />} className="hidden md:flex">
              SQL
            </Tab>
          </div>

          {/* Query bar */}
          <div className="space-y-2 border-b border-white/[0.07] p-3">
            <div className="flex items-center gap-2">
              <span className="w-12 shrink-0 font-mono text-[11px] text-slate-500">Filter</span>
              <div className="flex h-8 min-w-0 flex-1 items-center rounded-lg border border-white/10 bg-black/30 px-2.5 font-mono text-[12px]">
                <SyntaxLine text={typed} />
                <span className={cn("ml-px inline-block h-4 w-[7px] bg-emerald-300/90", done ? "animate-blink" : "")} />
              </div>
              <button
                tabIndex={-1}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-400 px-3 text-[12px] font-semibold text-emerald-950 shadow-[0_0_20px_-4px] shadow-emerald-400/60"
              >
                <Play className="size-3 fill-current" /> Run
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 shrink-0 font-mono text-[11px] text-slate-500">Sort</span>
              <div className="flex h-7 flex-1 items-center rounded-lg border border-white/[0.07] bg-black/20 px-2.5 font-mono text-[12px]">
                <SyntaxLine text="{ createdAt: -1 }" />
              </div>
              <span className="hidden items-center gap-1 rounded-md bg-emerald-400/10 px-2 py-1 font-mono text-[10.5px] text-emerald-300 ring-1 ring-emerald-400/20 sm:flex">
                <Zap className="size-3" /> {s.plan} · {s.ms} ms
              </span>
            </div>
          </div>

          {/* Results */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-[#0d141e] font-mono text-[10.5px] tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-normal">_id</th>
                  <th className="px-3 py-2 font-normal">customer.name</th>
                  <th className="hidden px-3 py-2 font-normal lg:table-cell">customer.city</th>
                  <th className="px-3 py-2 font-normal">status</th>
                  <th className="px-3 py-2 text-right font-normal">total</th>
                  <th className="hidden px-3 py-2 text-right font-normal md:table-cell">items</th>
                  <th className="hidden px-3 py-2 font-normal xl:table-cell">createdAt</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {done &&
                    rows.map((r, i) => (
                      <motion.tr
                        key={`${scene}-${r.id}`}
                        layout
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                        className="border-t border-white/[0.05] hover:bg-white/[0.03]"
                      >
                        <td className="px-3 py-2 font-mono text-[11px] text-violet-300/90">{r.id}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{r.name}</td>
                        <td className="hidden px-3 py-2 text-slate-400 lg:table-cell">{r.city}</td>
                        <td className="px-3 py-2">
                          <span className={cn("rounded-full px-2 py-0.5 text-[10.5px] ring-1", statusTone[r.status])}>{r.status}</span>
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-amber-200/90">{r.total.toFixed(2)}</td>
                        <td className="hidden px-3 py-2 text-right font-mono text-sky-300/90 md:table-cell">{r.items}</td>
                        <td className="hidden px-3 py-2 font-mono text-[11px] text-slate-400 xl:table-cell">{r.date}</td>
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
            <span>shop.orders</span>
            <span>{done ? `${rows.length} documents · ${s.ms} ms` : "running…"}</span>
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
          <Sparkles className="size-3.5" /> Ask your database
        </div>
        <p className="mt-1.5 text-[12px] text-slate-200">&ldquo;Shipped orders over $150, newest first&rdquo;</p>
        <p className="mt-1 text-[10.5px] text-slate-500">Schema only. No document values leave your machine.</p>
      </motion.div>
    </div>
  );
}

function TreeItem({
  depth,
  open,
  active,
  icon,
  children,
}: {
  depth: number;
  open?: boolean;
  active?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasChildren = depth < 2;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md py-1 pr-2 text-[12px]",
        active ? "bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-400/20" : "text-slate-300",
      )}
      style={{ paddingLeft: 6 + depth * 14 }}
    >
      {hasChildren ? (
        open ? (
          <ChevronDown className="size-3 text-slate-500" />
        ) : (
          <ChevronRight className="size-3 text-slate-500" />
        )
      ) : (
        <span className="w-3" />
      )}
      {icon}
      <span className="truncate">{children}</span>
    </div>
  );
}

function Tab({
  active,
  icon,
  children,
  className,
}: {
  active?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-8 items-center gap-1.5 rounded-t-lg px-3 text-[12px]",
        active ? "border border-b-0 border-white/[0.08] bg-[#0b1119] text-slate-100" : "text-slate-500",
        className,
      )}
    >
      {icon}
      {children}
    </div>
  );
}

/** Tiny MQL highlighter: operators, strings, numbers, keys. */
function SyntaxLine({ text }: { text: string }) {
  const parts = text.split(/("[^"]*"?|\$\w+|\b\d+(?:\.\d+)?\b|[{}[\]:,])/g).filter(Boolean);
  return (
    <span className="truncate whitespace-pre">
      {parts.map((p, i) => {
        const cls = p.startsWith("$")
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

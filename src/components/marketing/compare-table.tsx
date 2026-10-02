import { Check, Minus, X } from "lucide-react";
import { comparison, type Mark } from "@/lib/content";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/site/logo";
import { Tooltip } from "@/components/ui/tooltip";

function Cell({ mark, highlight }: { mark: Mark; highlight?: boolean }) {
  if (mark === "yes")
    return (
      <span
        className={cn(
          "inline-grid size-6 place-items-center rounded-full",
          highlight ? "bg-primary/15 text-primary" : "text-foreground/80",
        )}
      >
        <Check className="size-4" strokeWidth={2.5} />
        <span className="sr-only">Yes</span>
      </span>
    );
  if (mark === "no")
    return (
      <span className="text-muted-foreground/50 inline-grid size-6 place-items-center">
        <X className="size-4" />
        <span className="sr-only">No</span>
      </span>
    );
  if (mark === "partial")
    return (
      <span className="text-warning inline-grid size-6 place-items-center">
        <Minus className="size-4" strokeWidth={2.5} />
        <span className="sr-only">Partly</span>
      </span>
    );
  if (mark === "paid")
    return (
      <span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-[11px] whitespace-nowrap">
        Paid editions
      </span>
    );
  return <span className={cn("text-[13px] leading-snug", highlight ? "text-primary font-medium" : "text-muted-foreground")}>{mark}</span>;
}

export function CompareTable({ columns = ["studio3t", "compass"] }: { columns?: ("studio3t" | "compass")[] }) {
  const names = { studio3t: "Studio 3T", compass: "Compass" } as const;
  return (
    <div className="border-border bg-card/40 overflow-x-auto rounded-3xl border backdrop-blur">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-border border-b">
            <th className="text-muted-foreground w-[46%] p-5 text-sm font-medium">Feature</th>
            <th className="relative p-5 text-center">
              <div
                className="from-primary/15 to-primary/[0.03] absolute inset-x-2 top-2 bottom-0 -z-0 rounded-t-2xl bg-gradient-to-b"
                aria-hidden
              />
              <span className="relative inline-flex items-center gap-2 font-semibold">
                <LogoMark className="size-5" /> MotionQL
              </span>
            </th>
            {columns.map((c) => (
              <th key={c} className="text-muted-foreground p-5 text-center text-sm font-medium">
                {names[c]}
              </th>
            ))}
          </tr>
        </thead>
        {comparison.map((g) => (
          <tbody key={g.group}>
            <tr>
              <th
                colSpan={2 + columns.length}
                className="text-muted-foreground px-5 pt-7 pb-2 font-mono text-[11px] font-normal tracking-[0.14em] uppercase"
              >
                {g.group}
              </th>
            </tr>
            {g.rows.map((r) => (
              <tr key={r.feature} className="border-border/60 hover:bg-foreground/[0.02] border-t transition-colors">
                <td className="px-5 py-3.5 text-[14.5px]">
                  {r.note ? (
                    <Tooltip content={r.note}>
                      <span className="decoration-muted-foreground/40 cursor-help underline decoration-dotted underline-offset-4">
                        {r.feature}
                      </span>
                    </Tooltip>
                  ) : (
                    r.feature
                  )}
                </td>
                <td className="relative px-5 py-3.5 text-center">
                  <div className="bg-primary/[0.03] absolute inset-x-2 inset-y-0" aria-hidden />
                  <span className="relative">
                    <Cell mark={r.motionql} highlight />
                  </span>
                </td>
                {columns.map((c) => (
                  <td key={c} className="px-5 py-3.5 text-center">
                    <Cell mark={r[c]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
      <p className="border-border text-muted-foreground border-t px-5 py-4 text-xs leading-relaxed">
        Based on each vendor&apos;s public documentation as of October 2026. Editions and features change; if something here is out of date,
        tell us at support@motionql.com and we&apos;ll fix it.
      </p>
    </div>
  );
}

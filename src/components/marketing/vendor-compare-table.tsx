import { platformsMotionql, type VendorRow } from "@/lib/compare-vendors";
import { PlatformsText } from "@/components/app/platforms-text";
import { LogoMark } from "@/components/site/logo";
import { Tooltip } from "@/components/ui/tooltip";
import { Cell } from "./compare-table";

/** Two-column comparison (MotionQL vs one other tool), with the vendor sources listed underneath. */
export function VendorCompareTable({
  name,
  rows,
  sources,
}: {
  name: string;
  rows: VendorRow[];
  sources: { label: string; url: string }[];
}) {
  return (
    <div className="border-border bg-card/40 overflow-x-auto rounded-3xl border backdrop-blur">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="border-border border-b">
            <th className="text-muted-foreground w-[40%] p-5 text-sm font-medium">Feature</th>
            <th className="relative p-5 text-center">
              <div
                className="from-primary/15 to-primary/[0.03] absolute inset-x-2 top-2 bottom-0 rounded-t-2xl bg-gradient-to-b"
                aria-hidden
              />
              <span className="relative inline-flex items-center gap-2 font-semibold">
                <LogoMark className="size-5" /> MotionQL
              </span>
            </th>
            <th className="text-muted-foreground p-5 text-center text-sm font-medium">{name}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
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
                  {r.motionql === platformsMotionql ? (
                    <span className="text-primary text-[13px] leading-snug font-medium">
                      <PlatformsText />
                    </span>
                  ) : (
                    <Cell mark={r.motionql} highlight />
                  )}
                </span>
              </td>
              <td className="px-5 py-3.5 text-center">
                <Cell mark={r.them} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-border text-muted-foreground border-t px-5 py-4 text-xs leading-relaxed">
        <p>
          {name} details come from its own website and documentation as of October 2026. Features {name} does not document are left out
          rather than marked missing. If something here is out of date, tell us at support@motionql.com and we&apos;ll fix it.
        </p>
        <p className="mt-2">
          Sources:{" "}
          {sources.map((s, i) => (
            <span key={s.url}>
              {i > 0 && " · "}
              <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-foreground underline underline-offset-2">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

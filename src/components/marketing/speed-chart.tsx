import { speedRows, speedSetup } from "@/lib/speed-benchmark";

const max = Math.max(...speedRows.map((r) => r.compass));

function Bar({ value, p95, label, tone }: { value: number; p95: number; label: string; tone: "us" | "them" }) {
  return (
    <div className="group/bar flex items-center gap-3" title={`${label}: ${value} ms median, ${p95} ms slow case (p95)`}>
      <div className="h-3 flex-1">
        <div
          className={tone === "us" ? "bg-primary h-full rounded-r-[4px]" : "bg-muted-foreground/45 h-full rounded-r-[4px]"}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span
        className={
          tone === "us"
            ? "w-16 text-right font-mono text-sm font-semibold tabular-nums"
            : "text-muted-foreground w-16 text-right font-mono text-sm tabular-nums"
        }
      >
        {value} ms
      </span>
    </div>
  );
}

/** MotionQL vs Compass, time from input to result on screen. Data and method: src/lib/speed-benchmark.ts. */
export function SpeedChart() {
  return (
    <figure className="border-border bg-card/50 mx-auto max-w-4xl rounded-3xl border p-6 sm:p-8">
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-2">
          <span className="bg-primary inline-block size-3 rounded-[3px]" /> MotionQL
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-muted-foreground/45 inline-block size-3 rounded-[3px]" /> MongoDB Compass
        </span>
        <span className="ml-auto">Median time to result, lower is better</span>
      </div>
      <dl className="divide-border mt-6 divide-y">
        {speedRows.map((r) => (
          <div key={r.step} className="grid gap-3 py-4 sm:grid-cols-[13rem_1fr] sm:items-center sm:gap-6">
            <dt>
              <div className="font-medium tracking-tight">{r.step}</div>
              <div className="text-muted-foreground text-xs">
                {r.detail} · <span className="text-foreground font-medium">{(r.compass / r.motionql).toFixed(1)}x faster</span>
              </div>
            </dt>
            <dd className="space-y-1.5">
              <Bar value={r.motionql} p95={r.motionqlP95} label="MotionQL" tone="us" />
              <Bar value={r.compass} p95={r.compassP95} label="Compass" tone="them" />
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className="text-muted-foreground border-border mt-4 border-t pt-4 text-xs leading-relaxed">
        Measured {speedSetup.date} on a {speedSetup.machine}. {speedSetup.server}. {speedSetup.versions}. {speedSetup.method} Your numbers
        will differ with your hardware, server and data.
      </figcaption>
    </figure>
  );
}

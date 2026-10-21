import { allDatabaseNames } from "@/lib/databases";

const targets = allDatabaseNames;

export function WorksWith() {
  return (
    <section aria-label="Works with" className="relative py-10">
      <p className="text-muted-foreground text-center font-mono text-[11px] tracking-[0.2em] uppercase">
        Connects to the databases you already run
      </p>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
          {[...targets, ...targets].map((t, i) => (
            <span
              key={i}
              aria-hidden={i >= targets.length}
              className="border-border bg-foreground/[0.03] text-muted-foreground rounded-full border px-5 py-2.5 text-[15px] font-medium whitespace-nowrap"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

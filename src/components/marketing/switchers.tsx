import Link from "next/link";
import { ArrowUpRight, Compass, Layers, SquareTerminal } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";

const items = [
  {
    icon: Compass,
    from: "Coming from Compass",
    title: "Keep the simplicity. Lose the ceiling.",
    body: "Same clean browsing and aggregation builder, plus SQL queries, Compare & Sync, import to Excel and BSON, data masking, scheduled jobs and ER diagrams.",
    href: "/compare/compass",
  },
  {
    icon: Layers,
    from: "Coming from Studio 3T",
    title: "The power features, without the per-seat bill.",
    body: "Visual query builder, IntelliShell, SQL, Query Code, migration and Tasks. Get a free Pro license for a year, and no license check-ins: it works offline.",
    href: "/compare/studio-3t",
  },
  {
    icon: SquareTerminal,
    from: "Coming from mongosh",
    title: "Your commands, with a safety net.",
    body: "Paste mongosh-style commands into IntelliShell with autocomplete and history. They are parsed, never eval'd, and a Script mode sandbox runs real JavaScript when you want it.",
    href: "/features#intellishell",
  },
];

export function Switchers() {
  return (
    <section className="container-page py-28">
      <SectionHeading
        eyebrow="Switch in minutes"
        title={<>Built for everyone who lives in MongoDB</>}
        description="Paste your connection strings and go. Every host, topology and auth method you use today already works."
      />
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.from} delay={i * 0.08}>
            <SpotlightCard className="h-full p-7">
              <Link href={it.href} className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="border-border from-primary/15 text-primary grid size-11 place-items-center rounded-2xl border bg-gradient-to-br to-transparent">
                    <it.icon className="size-5" />
                  </span>
                  <ArrowUpRight className="text-muted-foreground group-hover:text-foreground size-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-muted-foreground mt-6 font-mono text-[11px] tracking-[0.14em] uppercase">{it.from}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{it.title}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed">{it.body}</p>
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

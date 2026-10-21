import Link from "next/link";
import { ArrowUpRight, Compass, Layers, SquareTerminal } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { SpotlightCard } from "./spotlight-card";

const items = [
  {
    icon: Layers,
    from: "Coming from DBeaver or DataGrip",
    title: "One tool for everything, without the paid tiers.",
    body: "SQL and NoSQL side by side in the free app, with tools made for each engine: EXPLAIN plans, pg_stat_statements, Redis keys, Elasticsearch Discover and Cypher graphs.",
    href: "/compare/dbeaver",
  },
  {
    icon: Compass,
    from: "Coming from Compass or Studio 3T",
    title: "Your MongoDB IDE, now for every database.",
    body: "The query builder, aggregation editor, IntelliShell, SQL and Compare & Sync you know, plus your PostgreSQL, MySQL and Redis in the same window.",
    href: "/compare/studio-3t",
  },
  {
    icon: SquareTerminal,
    from: "Coming from pgAdmin, SSMS or a terminal",
    title: "The admin tools, with a safety net.",
    body: "Server insights, roles, sessions and locks, with read-only connections, typed confirmations and Production environments that ask before every write.",
    href: "/databases",
  },
];

export function Switchers() {
  return (
    <section className="container-page py-28">
      <SectionHeading
        eyebrow="Switch in minutes"
        title={<>Built for everyone who lives in a database</>}
        description="Import your connections and saved queries from DBeaver, DataGrip, pgAdmin, MySQL Workbench, Azure Data Studio, Navicat, Compass or Studio 3T in one step."
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

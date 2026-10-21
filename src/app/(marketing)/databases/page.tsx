import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { SpotlightCard } from "@/components/marketing/spotlight-card";
import { ScreenFrame } from "@/components/marketing/screen-frame";
import { Cta } from "@/components/marketing/cta";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { databaseCountText, databaseGroups, databases } from "@/lib/databases";

export const metadata: Metadata = pageMetadata({
  title: "Supported databases: PostgreSQL, MySQL, SQL Server, MongoDB, Redis and more",
  description: `MotionQL connects to ${databaseCountText} databases and cloud services: PostgreSQL, MySQL, MariaDB, SQL Server, Oracle, SQLite, DuckDB, MongoDB, Redis, Elasticsearch, ClickHouse, Snowflake, BigQuery, DynamoDB, Cassandra, InfluxDB, Neo4j and more.`,
  path: "/databases",
});

export default function DatabasesPage() {
  return (
    <>
      <PageHero
        eyebrow="Databases"
        title={`${databaseCountText} databases. One app.`}
        description="Relational, document, key-value, warehouse, search, time-series and graph databases, each with its own tools, not a lowest-common-denominator grid. Every engine below is rated by the app itself."
      >
        <p className="text-muted-foreground mt-6 text-sm">
          <Badge className="mr-2">Deep</Badge> best-in-class
          <span className="mx-3 opacity-40">·</span>
          <Badge variant="secondary" className="mr-2">
            Good
          </Badge>
          a complete everyday client
        </p>
      </PageHero>

      <section className="container-page max-w-5xl py-8">
        <Reveal>
          <ScreenFrame
            id="connection-picker"
            alt="MotionQL's Add a connection dialog with tiles for every database and hosted service"
            priority
          />
          <p className="text-muted-foreground mt-4 text-center text-sm">
            Add connection: pick a database, and its own dialog opens with the right port, TLS and service settings.
          </p>
        </Reveal>
      </section>

      {databaseGroups.map((group) => (
        <section key={group} className="container-page py-12" aria-labelledby={`g-${group}`}>
          <h2 id={`g-${group}`} className="text-2xl font-semibold tracking-tight">
            {group}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {databases
              .filter((d) => d.group === group)
              .map((d, i) => (
                <Reveal key={d.slug} delay={(i % 3) * 0.05} className="min-w-0">
                  <Link href={`/databases/${d.slug}`} className="block h-full">
                    <SpotlightCard className="flex h-full flex-col p-7">
                      <h3 className="text-lg font-semibold tracking-tight">{d.name}</h3>
                      <p className="text-muted-foreground mt-2 font-mono text-[11px] tracking-[0.08em] uppercase">{d.language}</p>
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {d.flavors.map((f) => (
                          <li key={f.name}>
                            <Badge
                              variant={f.depth === "Deep" ? "default" : "secondary"}
                              className="max-w-full font-normal whitespace-normal"
                            >
                              {f.name}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                      <p className="text-muted-foreground mt-4 line-clamp-3 flex-1 text-[15px] leading-relaxed">{d.summary}</p>
                      <span className="text-primary mt-5 inline-flex items-center gap-1 text-sm">
                        See what it does <ArrowRight className="size-4" />
                      </span>
                    </SpotlightCard>
                  </Link>
                </Reveal>
              ))}
          </div>
        </section>
      ))}

      <section className="container-page max-w-3xl py-12 text-center">
        <p className="text-muted-foreground leading-relaxed">
          Every family shares the same workspace: projects and environments, read-only and production guards, the audit log, Logs &amp;
          analytics, saved queries, notebooks and an AI assistant that only sees what you allow.{" "}
          <Link href="/features" className="text-primary hover:underline">
            See the shared features
          </Link>
          .
        </p>
      </section>

      <Cta />
      <JsonLd data={[breadcrumbLd([{ name: "Databases", path: "/databases" }])]} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CompareTable } from "@/components/marketing/compare-table";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { Cta } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";

const pages = {
  "studio-3t": {
    column: "studio3t" as const,
    name: "Studio 3T",
    title: "The Studio 3T alternative that's free for real work",
    description:
      "MotionQL covers the Studio 3T workflows you rely on: visual queries, IntelliShell, SQL, Compare & Sync, SQL migration, masking and scheduled tasks. Get a free Pro license for a year, with no license server to check in with.",
    reasons: [
      {
        t: "No per-seat bill",
        d: "Pro is free for your first year and team seats are free for now. The core app is free forever, including for commercial work.",
      },
      {
        t: "No license check-ins",
        d: "Keys are verified offline with a digital signature. Air-gapped and locked-down networks just work.",
      },
      {
        t: "Familiar workflows",
        d: "Collection tabs with tree, table and JSON views, IntelliShell, an aggregation editor, SQL Query and Query Code all work the way you expect.",
      },
      {
        t: "AI on your terms",
        d: "Bring your own Gemini, Claude or OpenAI-compatible key, or run a local model. It sees schema, never document values.",
      },
      { t: "Self-hosted Team Server", d: "SSO, SCIM, shared queries and a hash-chained audit log, hosted inside your network." },
      {
        t: "Same connections",
        d: "Paste your existing URIs. SRV, replica sets, sharded clusters, SSH jump hosts, X.509, LDAP, Kerberos, AWS IAM and OIDC are all supported.",
      },
    ],
  },
  compass: {
    column: "compass" as const,
    name: "Compass",
    title: "Love Compass? Meet what comes next.",
    description:
      "Keep the clean, fast feel of Compass and add the tools you've been missing: SQL queries, Compare & Sync, Excel and BSON import/export, masking, scheduled tasks, ER diagrams and dashboards.",
    reasons: [
      {
        t: "SQL, when you think in SQL",
        d: "Write SELECT with joins and GROUP BY; MotionQL translates it into a find or aggregation you can keep.",
      },
      {
        t: "Compare and sync collections",
        d: "Field-level diffs, a dry-run preview, and selective sync between any two collections or clusters.",
      },
      { t: "More formats", d: "Excel, BSON, SQL INSERT and mongodump archives, with column mapping and upserts." },
      { t: "Automate the boring parts", d: "Scheduled exports, syncs, dumps and scripts that run even while the app is closed." },
      { t: "Any AI provider", d: "Use your own key or a local model, instead of a single hosted service." },
      {
        t: "Guardrails for production",
        d: "Read-only connections enforced in the app, a prod banner, typed-name drop confirmation and a local audit log.",
      },
    ],
  },
};

type Slug = keyof typeof pages;

export function generateStaticParams() {
  return Object.keys(pages).map((vs) => ({ vs }));
}

export async function generateMetadata({ params }: PageProps<"/compare/[vs]">): Promise<Metadata> {
  const { vs } = await params;
  const p = pages[vs as Slug];
  if (!p) return {};
  return { title: `MotionQL vs ${p.name}`, description: p.description };
}

export default async function VsPage({ params }: PageProps<"/compare/[vs]">) {
  const { vs } = await params;
  const p = pages[vs as Slug];
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow={`MotionQL vs ${p.name}`} title={p.title} description={p.description}>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">
              Get MotionQL free <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/features">See all features</Link>
          </Button>
        </div>
      </PageHero>
      <section className="container-page py-16">
        <SectionHeading title={`Why people switch from ${p.name}`} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.reasons.map((r, i) => (
            <Reveal key={r.t} delay={(i % 3) * 0.06} className="border-border bg-card/50 rounded-3xl border p-7">
              <Check className="text-primary size-5" />
              <h3 className="mt-4 font-semibold tracking-tight">{r.t}</h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{r.d}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="container-page py-16">
        <SectionHeading title="Feature by feature" />
        <div className="mt-12">
          <CompareTable columns={[p.column]} />
        </div>
      </section>
      <Cta />
    </>
  );
}

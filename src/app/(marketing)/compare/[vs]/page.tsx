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
import { SpeedChart } from "@/components/marketing/speed-chart";
import { VendorCompareTable } from "@/components/marketing/vendor-compare-table";
import { vendors, type Vendor } from "@/lib/compare-vendors";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, faqLd, pageMetadata, softwareApplicationLd } from "@/lib/seo";

const pages = {
  "studio-3t": {
    column: "studio3t" as const,
    name: "Studio 3T",
    metaTitle: "Studio 3T alternative: MotionQL vs Studio 3T",
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
        t: "Bring your connections",
        d: "Import your saved Studio 3T connections in one step, or paste your URIs. SRV, replica sets, sharded clusters, SSH jump hosts, X.509, LDAP, Kerberos, AWS IAM and OIDC are all supported.",
      },
    ],
    // Answers use only facts from the shared comparison table (content.ts) and the docs (connections, install).
    faq: [
      {
        q: "Is MotionQL a free alternative to Studio 3T?",
        a: "Yes. The core app is free forever, including for commercial work, and every registered user gets a Pro license free for 12 months. Studio 3T's full feature set is a paid per-user subscription, and its free Community edition is for non-commercial use in recent versions.",
      },
      {
        q: "Can I import my Studio 3T connections?",
        a: "Yes. In the Connection Manager, click Import from… and choose Studio 3T. MotionQL finds the saved connections on your computer, shows what it found and imports the ones you pick. Passwords are encrypted with your operating system's keychain.",
      },
      {
        q: "Does MotionQL have SQL queries and Compare & Sync like Studio 3T?",
        a: "Yes. SQL queries against MongoDB, Data Compare and Sync, SQL to MongoDB migration and data masking are all included, without a paid tier during your free Pro year.",
      },
      {
        q: "Does MotionQL work offline?",
        a: "Yes. License keys are verified offline with a digital signature, so there is no license server to check in with. Air-gapped networks work.",
      },
      {
        q: "Which platforms does MotionQL run on?",
        a: "macOS (Apple Silicon and Intel), Windows 10 and 11, and Linux (AppImage and .deb).",
      },
    ],
  },
  compass: {
    column: "compass" as const,
    name: "Compass",
    metaTitle: "MongoDB Compass alternative: MotionQL vs Compass",
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
type Faq = { q: string; a: string }[];

export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(pages), ...Object.keys(vendors)].map((vs) => ({ vs }));
}

export async function generateMetadata({ params }: PageProps<"/compare/[vs]">): Promise<Metadata> {
  const { vs } = await params;
  const p = pages[vs as Slug] ?? vendors[vs];
  if (!p) return {};
  return pageMetadata({ title: p.metaTitle ?? `MotionQL vs ${p.name}`, description: p.description, path: `/compare/${vs}` });
}

export default async function VsPage({ params }: PageProps<"/compare/[vs]">) {
  const { vs } = await params;
  const legacy = pages[vs as Slug];
  const vendor: Vendor | undefined = legacy ? undefined : vendors[vs];
  const p = legacy ?? vendor;
  if (!p) notFound();
  const faq: Faq | undefined = "faq" in p ? p.faq : undefined;
  const path = `/compare/${vs}`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Compare", path: "/compare" },
            { name: `MotionQL vs ${p.name}`, path },
          ]),
          softwareApplicationLd({ path }),
          ...(faq ? [faqLd(faq)] : []),
        ]}
      />
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
        <SectionHeading title={legacy ? `Why people switch from ${p.name}` : "What you get with MotionQL"} />
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
      {vs === "compass" && (
        <section className="container-page py-16">
          <SectionHeading
            eyebrow="Measured, not claimed"
            title="Faster than Compass on every step we timed"
            description="Up to 7.6 times faster, with the same queries on the same data and server, timed from the click to the result on screen."
          />
          <Reveal className="mt-12">
            <SpeedChart />
          </Reveal>
        </section>
      )}
      <section className="container-page py-16">
        <SectionHeading title="Feature by feature" />
        <div className="mt-12">
          {legacy ? (
            <CompareTable columns={[legacy.column]} />
          ) : (
            vendor && <VendorCompareTable name={vendor.name} rows={vendor.rows} sources={vendor.sources} />
          )}
        </div>
        {vendor && (
          <Reveal className="border-border bg-card/50 mx-auto mt-10 max-w-3xl rounded-3xl border p-7">
            <h3 className="font-semibold tracking-tight">When {vendor.name} may suit you better</h3>
            <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{vendor.fit}</p>
          </Reveal>
        )}
      </section>
      {faq && (
        <section className="container-page max-w-3xl py-16" aria-labelledby="switch-faq">
          <h2 id="switch-faq" className="text-center text-2xl font-semibold tracking-tight">
            Switching from {p.name}: common questions
          </h2>
          <dl className="mt-10 space-y-6">
            {faq.map((f) => (
              <div key={f.q} className="border-border bg-card/50 rounded-2xl border p-6">
                <dt className="font-semibold tracking-tight">{f.q}</dt>
                <dd className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <Cta />
    </>
  );
}

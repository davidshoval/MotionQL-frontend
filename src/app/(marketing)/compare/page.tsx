import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CompareTable } from "@/components/marketing/compare-table";
import { Cta } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";
import { vendors } from "@/lib/compare-vendors";

export const metadata: Metadata = pageMetadata({
  title: "Compare MotionQL: DBeaver, DataGrip, TablePlus, Studio 3T, Compass and more",
  description:
    "How MotionQL compares with DBeaver, DataGrip and TablePlus for every database, and with Studio 3T, Compass and other MongoDB GUIs: features, licensing and AI.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="How MotionQL compares"
        description="One app for 60+ databases, next to the multi-database tools you know and the MongoDB GUIs you may be coming from. Every claim about another product links to its source."
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            { href: "/compare/dbeaver", label: "vs DBeaver" },
            { href: "/compare/datagrip", label: "vs DataGrip" },
            { href: "/compare/tableplus", label: "vs TablePlus" },
          ].map((c) => (
            <Button key={c.href} asChild variant="secondary">
              <Link href={c.href}>
                {c.label} <ArrowRight />
              </Link>
            </Button>
          ))}
        </div>
      </PageHero>
      <section className="container-page py-8" aria-labelledby="mongodb-compare">
        <h2 id="mongodb-compare" className="text-center text-2xl font-semibold tracking-tight">
          For MongoDB: MotionQL vs Studio 3T vs Compass
        </h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-center">
          Studio 3T&apos;s power features and Compass&apos;s price, in the same app as the rest of your databases.{" "}
          <Link href="/compare/studio-3t" className="text-primary hover:underline">
            Switching from Studio 3T
          </Link>{" "}
          ·{" "}
          <Link href="/compare/compass" className="text-primary hover:underline">
            Switching from Compass
          </Link>
        </p>
        <div className="mt-10">
          <CompareTable />
        </div>
      </section>
      <section className="container-page py-16" aria-labelledby="more-comparisons">
        <h2 id="more-comparisons" className="text-center text-2xl font-semibold tracking-tight">
          More comparisons
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(vendors).map(([slug, v]) => (
            <li key={slug}>
              <Link
                href={`/compare/${slug}`}
                className="border-border bg-card/50 hover:border-primary/40 flex h-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 transition"
              >
                <span className="font-medium">MotionQL vs {v.name}</span>
                <ArrowRight className="text-primary size-4 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Cta />
    </>
  );
}

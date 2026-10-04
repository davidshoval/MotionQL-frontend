import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CompareTable } from "@/components/marketing/compare-table";
import { Cta } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";
import { vendors } from "@/lib/compare-vendors";

export const metadata: Metadata = {
  title: "MotionQL vs Studio 3T vs MongoDB Compass",
  description:
    "A side-by-side comparison of MotionQL, Studio 3T and MongoDB Compass: querying, SQL, compare and sync, migration, masking, AI and licensing.",
};

export default function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="MotionQL vs Studio 3T vs Compass"
        description="Studio 3T's power features and Compass's price, in one app. Here is how the three line up, feature by feature."
      >
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/compare/studio-3t">
              Switching from Studio 3T <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/compare/compass">
              Switching from Compass <ArrowRight />
            </Link>
          </Button>
        </div>
      </PageHero>
      <section className="container-page py-8">
        <CompareTable />
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

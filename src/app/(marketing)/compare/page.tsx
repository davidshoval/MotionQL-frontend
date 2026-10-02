import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { CompareTable } from "@/components/marketing/compare-table";
import { Cta } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";

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
      <Cta />
    </>
  );
}

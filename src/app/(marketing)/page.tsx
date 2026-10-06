import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/marketing/hero";
import { WorksWith } from "@/components/marketing/works-with";
import { Switchers } from "@/components/marketing/switchers";
import { Bento } from "@/components/marketing/bento";
import { AiSection } from "@/components/marketing/ai-section";
import { SecuritySection } from "@/components/marketing/security-section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { CompareTable } from "@/components/marketing/compare-table";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Steps } from "@/components/marketing/steps";
import { Showcase } from "@/components/marketing/showcase";
import { VideoTour } from "@/components/marketing/video-tour";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationLd, softwareApplicationLd, websiteLd } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorksWith />
      <Switchers />
      <Showcase />
      <VideoTour />
      <Bento />
      <AiSection />
      <SecuritySection />
      <section className="container-page py-28">
        <SectionHeading
          eyebrow="Compare"
          title="How MotionQL stacks up"
          description="The features you'd pay for elsewhere, side by side with Studio 3T and MongoDB Compass."
        />
        <div className="mt-14">
          <CompareTable />
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="secondary">
            <Link href="/compare">
              See the full comparison <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
      <Steps />
      <section className="container-page py-28" id="pricing">
        <SectionHeading
          eyebrow="Pricing"
          title="Free. Really."
          description="Pro is free for your first year, team seats are free for now, and the core app is free forever."
        />
        <div className="mt-14">
          <PricingCards />
        </div>
      </section>
      <Faq />
      <Cta />
      <JsonLd data={[softwareApplicationLd(), organizationLd(), websiteLd()]} />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "XQuery is free. Get a free Pro license for 12 months when you create an account, and free team seats for now.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Free while we launch. Fair after."
        description="The core app is free forever. Pro is free for your first year, and you can renew free with one click while the launch offer runs. Team seats are free too."
      />
      <section className="container-page py-8">
        <PricingCards />
        <p className="text-muted-foreground mt-8 text-center text-sm">
          Need volume licensing, a signed agreement or invoicing? Write to support@xquery.io.
        </p>
      </section>
      <Faq />
      <Cta />
    </>
  );
}

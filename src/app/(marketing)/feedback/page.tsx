import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/marketing/page-hero";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Send feedback",
  description: "Tell the MotionQL team about a bug, an idea or what you like. A person reads every message.",
  alternates: { canonical: "/feedback" },
};

export default function FeedbackPage() {
  return (
    <>
      <PageHero
        eyebrow="Feedback"
        title="Tell us what you think"
        description="Found a bug, missing a feature, or love something? A person on the team reads every message."
      />
      <section className="container-page max-w-2xl pb-16">
        <Suspense>
          <FeedbackForm />
        </Suspense>
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Need help with something specific? See{" "}
          <Link href="/support" className="text-primary hover:underline">
            support
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${site.supportEmail}`} className="text-primary hover:underline">
            {site.supportEmail}
          </a>
          .
        </p>
      </section>
    </>
  );
}

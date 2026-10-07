import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Download } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { SpeedChart } from "@/components/marketing/speed-chart";
import { VideoPlayer } from "@/components/marketing/video-player";
import { DownloadPanel } from "@/components/app/download-panel";
import { Cta } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, pageMetadata, softwareApplicationLd } from "@/lib/seo";
import { features } from "@/lib/features";
import { videos } from "@/lib/videos";

// Landing page for ads and newsletters. Speed claims are only against Compass and only what
// src/lib/speed-benchmark.ts measured; no memory comparison and nothing about other tools' speed.

const path = "/mongodb-gui";
const description =
  "MotionQL is a free MongoDB GUI for Mac, Windows and Linux: visual queries, aggregations, a shell and SQL in one app. Up to 7x faster than Compass in our tests.";

export const metadata: Metadata = pageMetadata({ title: "A faster MongoDB GUI. Free.", description, path });

const KEY_FEATURES = [
  "visual-query-builder",
  "aggregation-pipeline-builder",
  "intellishell",
  "sql-query",
  "schema-analysis-er-diagram",
  "import-export",
];

const video = videos.find((v) => v.slug === "01-core-tour") ?? videos[0]!;
const keyFeatures = KEY_FEATURES.map((slug) => features.find((f) => f.slug === slug)).filter((f) => f !== undefined);

export default function MongoDbGuiPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "MongoDB GUI", path }]), softwareApplicationLd({ path, description })]} />
      <PageHero
        eyebrow="The MongoDB GUI"
        title="A faster MongoDB GUI. Free."
        description="Browse, query and fix your data without the wait. Up to 7x faster than Compass in our tests, and free for commercial work."
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href="#download">
              <Download /> Download free
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/compare/compass">
              MotionQL vs Compass <ArrowRight />
            </Link>
          </Button>
        </div>
      </PageHero>

      <section className="container-page py-12">
        <Reveal className="mx-auto max-w-5xl">
          <VideoPlayer video={video} priority />
          <p className="text-muted-foreground mt-4 text-center text-sm">{video.summary}</p>
        </Reveal>
      </section>

      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Measured, not claimed"
          title="Up to 7x faster than Compass"
          description="The same queries on the same data and server, timed from the click to the result on screen. Lower is better."
        />
        <Reveal className="mt-12">
          <SpeedChart />
        </Reveal>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="secondary">
            <Link href="/compare/compass">
              See the full comparison with Compass <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading title="Everything you reach for, in one app" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {keyFeatures.map((f, i) => (
            <Reveal key={f.slug} delay={(i % 3) * 0.06} className="border-border bg-card/50 rounded-3xl border p-7">
              <Check className="text-primary size-5" />
              <h3 className="mt-4 font-semibold tracking-tight">
                <Link href={`/features/${f.slug}`} className="hover:underline">
                  {f.title}
                </Link>
              </h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{f.summary}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="download" className="container-page scroll-mt-24 py-16">
        <SectionHeading title="Download MotionQL" description="Free for Mac, Windows and Linux. Requires MongoDB 4.4 or later." />
        <div className="mt-12">
          <DownloadPanel />
        </div>
      </section>

      <Cta />
    </>
  );
}

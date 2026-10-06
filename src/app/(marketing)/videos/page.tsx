import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { VideoPlayer } from "@/components/marketing/video-player";
import { Cta } from "@/components/marketing/cta";
import { Button } from "@/components/ui/button";
import { featureBySlug } from "@/lib/features";
import { pageMetadata } from "@/lib/seo";
import { videos } from "@/lib/videos";

export const metadata = pageMetadata({
  title: "Video tours",
  description:
    "Watch MotionQL at work: 13 short captioned tours of queries, aggregation, editing, schema, performance, dashboards, AI and SQL databases.",
  path: "/videos",
});

export default function VideosPage() {
  const [first, ...rest] = videos;
  const minutes = Math.round(videos.reduce((n, v) => n + v.seconds, 0) / 60);

  return (
    <>
      <PageHero
        eyebrow="Video tours"
        title="See every feature at work"
        description={`${videos.length} short captioned tours, about ${minutes} minutes in all, recorded in the real app on sample data. Start with the first, or jump to what you need.`}
      >
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">
              Get MotionQL free <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/features">All features</Link>
          </Button>
        </div>
      </PageHero>

      <section className="container-page max-w-5xl py-8">
        <Reveal>
          <VideoPlayer video={first} priority />
          <h2 className="mt-6 text-2xl font-semibold tracking-tight">{first.title}</h2>
          <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{first.summary}</p>
        </Reveal>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((v, i) => {
            const related = v.features.map(featureBySlug).filter((f) => f !== undefined);
            return (
              <Reveal key={v.slug} delay={(i % 3) * 0.06} id={v.slug.replace(/^\d+-/, "")} className="scroll-mt-28">
                <VideoPlayer video={v} />
                <h3 className="mt-5 font-semibold tracking-tight">{v.title}</h3>
                <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{v.summary}</p>
                {related.length > 0 && (
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {related.map((f) => (
                      <Link
                        key={f.slug}
                        href={`/features/${f.slug}`}
                        className="text-primary inline-flex items-center gap-1 hover:underline"
                      >
                        {f.name} <ArrowRight className="size-3.5" />
                      </Link>
                    ))}
                  </p>
                )}
              </Reveal>
            );
          })}
        </div>
      </section>

      <Cta />
    </>
  );
}

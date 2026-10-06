import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Gift } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { ScreenFrame } from "@/components/marketing/screen-frame";
import { SpotlightCard } from "@/components/marketing/spotlight-card";
import { Cta } from "@/components/marketing/cta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { featureBySlug, features } from "@/lib/features";
import { pageMetadata } from "@/lib/seo";
import { videosForFeature } from "@/lib/videos";
import { VideoPlayer } from "@/components/marketing/video-player";

export const dynamicParams = false;

export function generateStaticParams() {
  return features.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps<"/features/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const f = featureBySlug(slug);
  if (!f) return {};
  return pageMetadata({ title: f.metaTitle, description: f.summary, path: `/features/${f.slug}` });
}

const tierText = {
  Pro: "Part of Pro, which every registered user gets free for 12 months.",
  Enterprise: "Team Server features need an Enterprise license.",
} as const;

export default async function FeaturePage({ params }: PageProps<"/features/[slug]">) {
  const { slug } = await params;
  const f = featureBySlug(slug);
  if (!f) notFound();
  const related = f.related.map(featureBySlug).filter((r) => r !== undefined);
  const tours = videosForFeature(f.slug);

  return (
    <>
      <PageHero
        eyebrow={
          <>
            <f.icon className="size-3.5" /> {f.name}
          </>
        }
        title={f.title}
        description={f.summary}
      >
        {f.tier && (
          <p className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <Badge variant={f.tier === "Pro" ? "default" : "violet"}>{f.tier}</Badge>
            {f.tierNote ?? tierText[f.tier]}
          </p>
        )}
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

      {f.screen && (
        <section className="container-page max-w-5xl py-8">
          <Reveal>
            <ScreenFrame id={f.screen.id} alt={f.screen.alt} priority />
            <p className="text-muted-foreground mt-4 text-center text-sm">{f.screen.caption}</p>
          </Reveal>
        </section>
      )}

      {!f.screen && f.snippet && (
        <section className="container-page max-w-3xl py-8">
          <Reveal className="border-border bg-card/60 overflow-hidden rounded-2xl border">
            <p className="border-border text-muted-foreground border-b px-5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase">
              {f.snippet.label}
            </p>
            <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
              <code>{f.snippet.code}</code>
            </pre>
          </Reveal>
        </section>
      )}

      {tours.length > 0 && (
        <section className="container-page max-w-5xl py-16">
          <SectionHeading eyebrow="Watch" title={tours.length > 1 ? "See it in action" : tours[0].title} />
          <div className={tours.length > 1 ? "mt-12 grid gap-8 md:grid-cols-2" : "mt-12"}>
            {tours.map((v) => (
              <Reveal key={v.slug}>
                <VideoPlayer video={v} />
                {tours.length > 1 && <h3 className="mt-5 font-semibold tracking-tight">{v.title}</h3>}
                <p className="text-muted-foreground mt-2 text-center text-sm md:text-left">{v.summary}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="container-page py-16">
        <SectionHeading eyebrow="Capabilities" title="What you can do with it" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {f.capabilities.map((c, i) => (
            <Reveal key={c.t} delay={(i % 3) * 0.06} className="border-border bg-card/50 rounded-3xl border p-7">
              <Check className="text-primary size-5" />
              <h3 className="mt-4 font-semibold tracking-tight">{c.t}</h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{c.d}</p>
            </Reveal>
          ))}
        </div>
        {f.tier === "Pro" && (
          <p className="text-muted-foreground mt-10 flex items-center justify-center gap-2 text-center text-sm">
            <Gift className="text-primary size-4 shrink-0" /> Create a free account and your Pro key is valid for 12 months, no card needed.
          </p>
        )}
      </section>

      <section className="container-page py-16">
        <SectionHeading title="Related features" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {related.map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.06}>
              <Link href={`/features/${r.slug}`} className="block h-full">
                <SpotlightCard className="h-full p-7">
                  <span className="border-border from-primary/15 text-primary grid size-11 place-items-center rounded-2xl border bg-gradient-to-br to-transparent">
                    <r.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-semibold tracking-tight">{r.name}</h3>
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-[15px] leading-relaxed">{r.summary}</p>
                  <span className="text-primary mt-4 inline-flex items-center gap-1 text-sm">
                    Learn more <ArrowRight className="size-4" />
                  </span>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Cta />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Info } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { ScreenFrame } from "@/components/marketing/screen-frame";
import { SpotlightCard } from "@/components/marketing/spotlight-card";
import { Cta } from "@/components/marketing/cta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { databaseBySlug, databases } from "@/lib/databases";
import { featureBySlug } from "@/lib/features";
import { breadcrumbLd, pageMetadata, softwareApplicationLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return databases.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/databases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = databaseBySlug(slug);
  if (!d) return {};
  return pageMetadata({ title: d.metaTitle, description: d.summary, path: `/databases/${d.slug}` });
}

/** What every family gets from the shared workspace, linked to the feature pages. */
const shared = [
  { slug: "projects-environments", text: "Projects with Development, Staging and Production environments, enforced on every write" },
  { slug: "logs-analytics", text: "Logs & analytics: the server's log, slow operations by shape and live metrics" },
  { slug: "ai-assistant-mcp", text: "An AI assistant that writes and fixes this family's queries, with your own key" },
  { slug: "connections-security", text: "Read-only connections, typed confirmations and a local audit log" },
  { slug: "scripts-git", text: "Saved queries as files in a folder you can put in Git" },
  { slug: "notebooks", text: "Notebooks and charts on live results" },
];

export default async function DatabasePage({ params }: PageProps<"/databases/[slug]">) {
  const { slug } = await params;
  const d = databaseBySlug(slug);
  if (!d) notFound();
  const related = (d.features ?? []).map(featureBySlug).filter((f) => f !== undefined);
  const others = databases.filter((x) => x.slug !== d.slug && x.group === d.group).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={d.name} title={d.title} description={d.summary}>
        <ul className="mt-8 flex max-w-3xl flex-wrap justify-center gap-2" aria-label="Supported flavors">
          {d.flavors.map((f) => (
            <li key={f.name}>
              <Badge
                variant={f.depth === "Deep" ? "default" : "secondary"}
                className="max-w-full px-3 py-1 text-[13px] font-normal whitespace-normal"
              >
                {f.name}
                {f.note && <span className="opacity-70"> ({f.note})</span>}
              </Badge>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register">
              Get MotionQL free <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/databases">All databases</Link>
          </Button>
        </div>
      </PageHero>

      {d.screen && (
        <section className="container-page max-w-5xl py-8">
          <Reveal>
            <ScreenFrame id={d.screen.id} alt={d.screen.alt} priority />
            <p className="text-muted-foreground mt-4 text-center text-sm">{d.screen.caption}</p>
          </Reveal>
        </section>
      )}

      <section className="container-page py-16">
        <SectionHeading eyebrow={d.language} title={`What you get for ${d.name}`} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {d.highlights.map((h, i) => (
            <Reveal key={h.t} delay={(i % 3) * 0.06} className="border-border bg-card/50 rounded-3xl border p-7">
              <Check className="text-primary size-5" />
              <h3 className="mt-4 font-semibold tracking-tight">{h.t}</h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{h.d}</p>
            </Reveal>
          ))}
        </div>
        {d.notes && (
          <ul className="mx-auto mt-10 max-w-3xl space-y-2">
            {d.notes.map((n) => (
              <li key={n} className="text-muted-foreground flex gap-2 text-sm leading-relaxed">
                <Info className="mt-0.5 size-4 shrink-0" /> {n}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Same app, same habits"
          title="And everything every connection gets"
          description="Each database keeps its own tools, and shares one workspace with the others."
        />
        <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-2">
          {shared.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/features/${s.slug}`}
                className="border-border bg-card/50 hover:border-primary/40 flex h-full items-start gap-3 rounded-2xl border px-5 py-4 text-[15px] leading-relaxed transition"
              >
                <Check className="text-primary mt-1 size-4 shrink-0" />
                <span className="text-muted-foreground">{s.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading title="Features to look at next" />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {related.slice(0, 3).map((r, i) => (
              <Reveal key={r.slug} delay={i * 0.06}>
                <Link href={`/features/${r.slug}`} className="block h-full">
                  <SpotlightCard className="h-full p-7">
                    <span className="border-border from-primary/15 text-primary grid size-11 place-items-center rounded-2xl border bg-gradient-to-br to-transparent">
                      <r.icon className="size-5" />
                    </span>
                    <h3 className="mt-5 font-semibold tracking-tight">{r.name}</h3>
                    <p className="text-muted-foreground mt-2 line-clamp-3 text-[15px] leading-relaxed">{r.summary}</p>
                  </SpotlightCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="container-page pb-8">
          <p className="text-muted-foreground text-center text-sm">
            Also in {d.group.toLowerCase()}:{" "}
            {others.map((o, i) => (
              <span key={o.slug}>
                {i > 0 && ", "}
                <Link href={`/databases/${o.slug}`} className="text-primary hover:underline">
                  {o.name}
                </Link>
              </span>
            ))}
            .
          </p>
        </section>
      )}

      <Cta />
      <JsonLd
        data={[
          softwareApplicationLd({ path: `/databases/${d.slug}`, description: d.summary }),
          breadcrumbLd([
            { name: "Databases", path: "/databases" },
            { name: d.name, path: `/databases/${d.slug}` },
          ]),
        ]}
      />
    </>
  );
}

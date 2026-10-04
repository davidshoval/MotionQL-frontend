import Link from "next/link";
import { ArrowRight, Braces, BookOpen, Download, FingerprintPattern, Gauge, Link2, ListTree, ShieldCheck } from "lucide-react";
import { Eyebrow } from "@/components/marketing/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/logo";
import { site } from "@/lib/site";
import { TOOLS, getTool, type ToolSlug } from "@/lib/tools/registry";

export const toolIcons: Record<ToolSlug, React.ComponentType<{ className?: string }>> = {
  "connection-string-builder": Link2,
  "objectid-converter": FingerprintPattern,
  "extended-json-converter": Braces,
  "bson-size-calculator": Gauge,
  "explain-plan-analyzer": ListTree,
  "operators-cheat-sheet": BookOpen,
};

export type Faq = { q: string; a: string };

const ldJson = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

export function PrivacyNote({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <p className={`text-muted-foreground inline-flex items-center gap-2 text-sm ${className}`}>
      <ShieldCheck className="text-primary size-4 shrink-0" />
      {children ?? "Runs entirely in your browser. Nothing you paste is sent to any server."}
    </p>
  );
}

/** Shared layout for every free tool: compact hero, the tool, an explainer, FAQ (with FAQPage JSON-LD), related tools and a CTA. */
export function ToolPage({
  slug,
  children,
  about,
  faqs,
  cta,
  privacy,
}: {
  slug: ToolSlug;
  children: React.ReactNode;
  about?: React.ReactNode;
  faqs: Faq[];
  /** Tool-specific line for the MotionQL call to action. */
  cta?: React.ReactNode;
  /** Overrides the default "nothing is sent" line, for tools that take no input. */
  privacy?: React.ReactNode;
}) {
  const tool = getTool(slug);
  const Icon = toolIcons[slug];
  const url = `${site.url}/tools/${slug}`;
  const structured = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.title,
      description: tool.description,
      url,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any (runs in the browser)",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Tools", item: `${site.url}/tools` },
        { "@type": "ListItem", position: 2, name: tool.name, item: url },
      ],
    },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden pt-32 pb-10 sm:pt-36">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-muted-foreground mb-6 text-sm">
            <Link href="/tools" className="hover:text-foreground transition-colors">
              Free MongoDB tools
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{tool.name}</span>
          </nav>
          <div className="flex items-start gap-4">
            <span className="border-primary/25 bg-primary/[0.07] text-primary hidden size-12 shrink-0 items-center justify-center rounded-2xl border sm:flex">
              <Icon className="size-6" />
            </span>
            <div>
              <h1 className="text-gradient text-4xl leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
                {tool.heading}
              </h1>
              <p className="text-muted-foreground mt-4 max-w-3xl text-lg leading-relaxed text-pretty">{tool.description}</p>
              <PrivacyNote className="mt-4">{privacy}</PrivacyNote>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page">{children}</section>

      <ToolCta>{cta}</ToolCta>

      {about && (
        <section className="container-page py-12">
          <div className="prose prose-neutral dark:prose-invert prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-foreground/[0.06] prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none max-w-3xl [&_code]:[overflow-wrap:anywhere]">
            {about}
          </div>
        </section>
      )}

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="text-gradient mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Questions, answered</h2>
        </div>
        <Accordion type="single" collapsible defaultValue="0">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={String(i)}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <RelatedTools current={slug} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(structured) }} />
    </>
  );
}

export function ToolCard({ slug }: { slug: ToolSlug }) {
  const t = getTool(slug);
  const Icon = toolIcons[slug];
  return (
    <Link
      href={`/tools/${slug}`}
      className="group border-border bg-card/50 hover:border-primary/40 hover:bg-card flex h-full flex-col rounded-3xl border p-6 transition-colors"
    >
      <Icon className="text-primary size-6" />
      <h3 className="mt-4 font-semibold tracking-tight">{t.name}</h3>
      <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">{t.description}</p>
      <span className="text-primary mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium">
        Open tool <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function RelatedTools({ current }: { current: ToolSlug }) {
  return (
    <section className="container-page py-12">
      <h2 className="text-2xl font-semibold tracking-tight">More free MongoDB tools</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {TOOLS.filter((t) => t.slug !== current).map((t) => (
          <ToolCard key={t.slug} slug={t.slug} />
        ))}
      </div>
    </section>
  );
}

export function ToolCta({ children }: { children?: React.ReactNode }) {
  return (
    <section className="container-page py-12">
      <div className="border-border relative isolate overflow-hidden rounded-[2rem] border px-6 py-12 sm:px-12">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_100%_at_0%_0%,color-mix(in_oklch,var(--brand-mint)_22%,transparent),transparent_70%)]"
        />
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <LogoMark className="size-12 shrink-0" />
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Do this against your real data with MotionQL</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                {children ??
                  "MotionQL is a desktop MongoDB IDE with visual explain plans, an aggregation editor, SQL queries and schema tools, connecting straight from your machine."}{" "}
                Pro is free for a year.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/download">
                <Download /> Download MotionQL
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/features">See features</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

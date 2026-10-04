import { PageHero } from "@/components/marketing/page-hero";
import { PrivacyNote, ToolCard, ToolCta } from "@/components/tools/tool-page";
import { site } from "@/lib/site";
import { TOOLS, pageMetadata } from "@/lib/tools/registry";

export const metadata = pageMetadata({
  title: "Free MongoDB Tools",
  description:
    "Free, private MongoDB tools that run in your browser: connection string builder, ObjectId converter, Extended JSON converter, BSON size calculator, explain plan analyzer and an operators cheat sheet.",
  path: "/tools",
  keywords: ["mongodb tools", "free mongodb tools", "mongodb online tools", "mongodb utilities"],
});

export default function ToolsPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.title, url: `${site.url}/tools/${t.slug}` })),
  };
  return (
    <>
      <PageHero
        eyebrow="Free tools"
        title="Free MongoDB tools"
        description="Small utilities for everyday MongoDB work. No sign-up, no install, and nothing you paste leaves your browser."
      >
        <PrivacyNote className="mt-6" />
      </PageHero>
      <section className="container-page">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <ToolCard key={t.slug} slug={t.slug} />
          ))}
        </div>
      </section>
      <ToolCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
    </>
  );
}

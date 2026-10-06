import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, Rss } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { blogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

const base = pageMetadata({
  title: "Blog",
  description: "Releases, guides and MongoDB know-how from the team building MotionQL.",
  path: "/blog",
});

export const metadata: Metadata = {
  ...base,
  alternates: { ...base.alternates, types: { "application/rss+xml": "/blog/rss.xml" } },
};

export default function BlogIndex() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Notes from the team" description="Releases, guides and MongoDB know-how.">
        <a href="/blog/rss.xml" className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-1.5 text-sm">
          <Rss className="size-4" /> RSS feed
        </a>
      </PageHero>
      <section className="container-page max-w-3xl pb-8">
        <ul className="divide-border divide-y">
          {blogPosts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group block py-8">
                <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <time dateTime={p.date}>{formatDate(`${p.date}T12:00:00Z`, { dateStyle: "long" })}</time>
                  {p.tags.map((t) => (
                    <span key={t} className="text-primary font-mono text-[11px] tracking-[0.14em] uppercase">
                      {t}
                    </span>
                  ))}
                </p>
                <h2 className="group-hover:text-primary mt-2 text-2xl font-semibold tracking-tight transition-colors">{p.title}</h2>
                <p className="text-muted-foreground mt-2 leading-relaxed">{p.description}</p>
                <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  Read <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

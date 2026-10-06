import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Prose } from "@/components/docs/prose";
import { docPages, extractHeadings, getDoc, readDocSource } from "@/lib/docs";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return docPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDoc(slug);
  return d ? pageMetadata({ title: `${d.page.title} · Docs`, description: d.page.description, path: `/docs/${slug}` }) : {};
}

export default async function DocPage({ params }: PageProps<"/docs/[slug]">) {
  const { slug } = await params;
  const d = getDoc(slug);
  if (!d) notFound();
  const source = await readDocSource(slug);
  const toc = extractHeadings(source).filter((h) => h.depth === 2);

  return (
    <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_200px]">
      <article className="min-w-0">
        <p className="text-primary font-mono text-[11px] tracking-[0.14em] uppercase">{d.page.section}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{d.page.title}</h1>
        <p className="text-muted-foreground mt-3 text-lg">{d.page.description}</p>
        <Prose source={source} className="mt-10" />

        <nav aria-label="Previous and next page" className="border-border mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2">
          {d.prev ? (
            <Link
              href={`/docs/${d.prev.slug}`}
              className="border-border hover:border-primary/40 group rounded-2xl border p-5 transition-colors"
            >
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <ArrowLeft className="size-3.5" /> Previous
              </span>
              <span className="group-hover:text-primary mt-1 block font-medium transition-colors">{d.prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {d.next && (
            <Link
              href={`/docs/${d.next.slug}`}
              className="border-border hover:border-primary/40 group rounded-2xl border p-5 text-right transition-colors"
            >
              <span className="text-muted-foreground flex items-center justify-end gap-1.5 text-xs">
                Next <ArrowRight className="size-3.5" />
              </span>
              <span className="group-hover:text-primary mt-1 block font-medium transition-colors">{d.next.title}</span>
            </Link>
          )}
        </nav>
        <p className="text-muted-foreground mt-8 text-sm">
          Something unclear or out of date? Write to{" "}
          <a
            href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(`Docs: ${d.page.title}`)}`}
            className="text-primary hover:underline"
          >
            {site.contactEmail}
          </a>
          .
        </p>
      </article>

      {toc.length > 1 && (
        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <p className="text-foreground font-mono text-[11px] tracking-[0.14em] uppercase">On this page</p>
            <ul className="mt-3 space-y-2 text-sm">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-muted-foreground hover:text-foreground block leading-snug transition-colors">
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Prose } from "@/components/docs/prose";
import { Cta } from "@/components/marketing/cta";
import { blogPosts, getPost, readingMinutes, readPostSource } from "@/lib/blog";
import { ogImage } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${slug}`, types: { "application/rss+xml": "/blog/rss.xml" } },
    openGraph: {
      type: "article",
      siteName: "MotionQL",
      title: p.title,
      description: p.description,
      publishedTime: p.date,
      url: `/blog/${slug}`,
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: p.title, description: p.description, images: [ogImage] },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const source = await readPostSource(slug);

  return (
    <>
      <article className="container-page max-w-3xl pt-36 pb-8">
        <Link href="/blog" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm">
          <ArrowLeft className="size-4" /> All posts
        </Link>
        <h1 className="mt-8 text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl">{p.title}</h1>
        <p className="text-muted-foreground mt-5 flex flex-wrap gap-x-3 gap-y-1 text-sm">
          <time dateTime={p.date}>{formatDate(`${p.date}T12:00:00Z`, { dateStyle: "long" })}</time>
          <span aria-hidden>·</span>
          <span>{p.author}</span>
          <span aria-hidden>·</span>
          <span>{readingMinutes(source)} min read</span>
        </p>
        <Prose source={source} className="prose-lg mt-10" />
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: p.title,
            description: p.description,
            datePublished: p.date,
            author: { "@type": "Organization", name: site.name },
            publisher: { "@type": "Organization", name: site.name },
            mainEntityOfPage: `${site.url}/blog/${p.slug}`,
            image: `${site.url}${ogImage.url}`,
          }),
        }}
      />
      <Cta />
    </>
  );
}

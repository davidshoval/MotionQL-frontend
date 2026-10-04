import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { docPages } from "@/lib/docs";
import { blogPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/features",
    "/compare",
    "/compare/studio-3t",
    "/compare/compass",
    "/pricing",
    "/security",
    "/download",
    "/changelog",
    "/register",
    "/docs",
    ...docPages.map((d) => `/docs/${d.slug}`),
    "/blog",
    ...blogPosts.map((b) => `/blog/${b.slug}`),
    "/faq",
    "/roadmap",
    "/support",
  ];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}

import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { features } from "@/lib/features";
import { vendors } from "@/lib/compare-vendors";
import { docPages } from "@/lib/docs";
import { blogPosts } from "@/lib/blog";
import { TOOLS } from "@/lib/tools/registry";

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
    ...features.map((f) => `/features/${f.slug}`),
    ...Object.keys(vendors).map((v) => `/compare/${v}`),
    "/download/mac",
    "/download/windows",
    "/download/linux",
    "/docs",
    ...docPages.map((d) => `/docs/${d.slug}`),
    "/blog",
    ...blogPosts.map((b) => `/blog/${b.slug}`),
    "/faq",
    "/roadmap",
    "/support",
    "/tools",
    ...TOOLS.map((t) => `/tools/${t.slug}`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}

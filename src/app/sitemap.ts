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
    "/mongodb-gui",
    "/features",
    "/videos",
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
    "/feedback",
    "/tools",
    ...TOOLS.map((t) => `/tools/${t.slug}`),
    ...["terms", "privacy", "eula", "acceptable-use", "security-policy"].map((l) => `/legal/${l}`),
  ];
  // Pages people search for by name get a higher hint than docs and legal pages.
  const priority = (p: string) =>
    p === "" ? 1 : /^\/(download|compare|pricing|features|mongodb-gui)(\/|$)/.test(p) ? 0.9 : p.startsWith("/legal/") ? 0.3 : 0.7;
  const posted = new Map(blogPosts.map((b) => [`/blog/${b.slug}`, b.date]));
  return [...new Set(paths)].map((p) => ({
    url: `${site.url}${p}`,
    ...(posted.has(p) && { lastModified: posted.get(p) }),
    changeFrequency: p.startsWith("/legal/") ? "yearly" : "weekly",
    priority: priority(p),
  }));
}

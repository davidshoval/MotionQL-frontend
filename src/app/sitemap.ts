import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
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
    "/tools",
    ...TOOLS.map((t) => `/tools/${t.slug}`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}

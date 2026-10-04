import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { features } from "@/lib/features";
import { vendors } from "@/lib/compare-vendors";

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
  ];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}

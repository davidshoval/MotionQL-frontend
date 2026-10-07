import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/account", "/admin", "/team", "/verify-email", "/reset-password", "/invite", "/r/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

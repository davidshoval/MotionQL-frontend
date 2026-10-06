import type { Metadata } from "next";
import { site } from "@/lib/site";

// Same image as the root layout. Child segments that set openGraph replace the parent's object
// (metadata merges shallowly), so pages that set their own title here must repeat the image.
export const ogImage = { url: "/og-image.png", width: 1200, height: 630, alt: "MotionQL: the modern MongoDB GUI, free" };

/** Title, description, canonical URL and Open Graph / Twitter tags for one marketing page. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "MotionQL", title, description, url: path, images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

/** Metadata for pages that should stay out of search results (sign-in, password reset, invites). */
export function privateMetadata(title: string): Metadata {
  return { title, robots: { index: false, follow: true } };
}

// ---- Structured data (schema.org JSON-LD) ----

/** Operating systems with published installers (Linux since 1.1.0). */
export const operatingSystems = { mac: "macOS", windows: "Windows", linux: "Linux" } as const;

/**
 * The desktop app as a SoftwareApplication. Only verifiable facts: free to download, the platforms with published
 * installers. No ratings or review counts until there are real ones.
 */
export function softwareApplicationLd(opts: { os?: string; path?: string; description?: string } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.name,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Database client",
    operatingSystem: opts.os ?? Object.values(operatingSystems).join(", "),
    description: opts.description ?? site.description,
    url: `${site.url}${opts.path ?? ""}`,
    downloadUrl: `${site.url}/download`,
    image: `${site.url}${ogImage.url}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo-512.png`,
    email: site.contactEmail,
  };
}

export function websiteLd() {
  return { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url };
}

/** Breadcrumbs from the home page down; `items` excludes Home. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  const all = [{ name: "Home", path: "" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

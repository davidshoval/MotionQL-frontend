import type { Metadata } from "next";

// Same image as the root layout. Child segments that set openGraph replace the parent's object
// (metadata merges shallowly), so pages that set their own title here must repeat the image.
const ogImage = { url: "/og-image.png", width: 1200, height: 630, alt: "MotionQL: the modern MongoDB GUI, free" };

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

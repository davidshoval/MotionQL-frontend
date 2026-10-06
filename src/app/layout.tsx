import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import { UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID } from "@/lib/analytics";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Set explicitly (not via an opengraph-image file) so the alt text is emitted under Turbopack too.
const ogImage = { url: "/og-image.png", width: 1200, height: 630, alt: "MotionQL: the modern MongoDB GUI, free" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "MotionQL: the modern MongoDB IDE",
    template: "%s · MotionQL",
  },
  description: site.description,
  keywords: [
    "MongoDB GUI",
    "MongoDB IDE",
    "Studio 3T alternative",
    "MongoDB Compass alternative",
    "MongoDB client",
    "Atlas",
    "NoSQL GUI",
    "aggregation editor",
    "SQL for MongoDB",
  ],
  openGraph: {
    type: "website",
    siteName: "MotionQL",
    title: "MotionQL: the modern MongoDB IDE",
    description: site.description,
    url: site.url,
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title: "MotionQL: the modern MongoDB IDE", description: site.description, images: [ogImage] },
};

const host = new URL(site.url).hostname.replace(/^www\./, "");
const analyticsDomains = `${host},www.${host}`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1018" },
    { media: "(prefers-color-scheme: light)", color: "#f7fafa" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Providers>{children}</Providers>
        {UMAMI_WEBSITE_ID && (
          // data-domains keeps local and onrender.com previews out of the stats.
          <Script src={UMAMI_SCRIPT_URL} data-website-id={UMAMI_WEBSITE_ID} data-domains={analyticsDomains} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
  },
  twitter: { card: "summary_large_image", title: "MotionQL: the modern MongoDB IDE", description: site.description },
};

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
      </body>
    </html>
  );
}

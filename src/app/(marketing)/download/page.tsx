import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { DownloadPanel } from "@/components/app/download-panel";

export const metadata: Metadata = {
  title: "Download",
  description: "Download XQuery for macOS, Windows and Linux.",
};

export default function DownloadPage() {
  return (
    <>
      <PageHero
        eyebrow="Download"
        title="Get XQuery"
        description="For macOS (Apple Silicon and Intel), Windows and Linux. Requires MongoDB 4.4 or later."
      />
      <section className="container-page py-8">
        <DownloadPanel />
      </section>
    </>
  );
}

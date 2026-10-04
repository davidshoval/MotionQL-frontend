import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/page-hero";
import { DownloadPanel } from "@/components/app/download-panel";
import { PlatformsText } from "@/components/app/platforms-text";
import { platformsText } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download",
  description: `Download MotionQL for ${platformsText.short.withoutLinux}.`,
};

export default function DownloadPage() {
  return (
    <>
      <PageHero
        eyebrow="Download"
        title="Get MotionQL"
        description={
          <>
            For <PlatformsText variant="long" />. Requires MongoDB 4.4 or later.
          </>
        }
      />
      <section className="container-page py-8">
        <DownloadPanel />
      </section>
    </>
  );
}

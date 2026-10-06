import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/marketing/page-hero";
import { DownloadPanel } from "@/components/app/download-panel";
import { PlatformsText } from "@/components/app/platforms-text";
import { platformsText } from "@/lib/site";

// Linux installers ship since 1.1.0, so the static description names all three platforms.
export const metadata: Metadata = pageMetadata({
  title: "Download MotionQL for Mac, Windows and Linux",
  description: `Download MotionQL, the free MongoDB GUI, for ${platformsText.long.withLinux}.`,
  path: "/download",
});

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

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { videos } from "@/lib/videos";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { VideoPlayer } from "./video-player";

/** Home page: the first video tour, with a link to all of them. */
export function VideoTour() {
  return (
    <section className="container-page py-28" id="watch">
      <SectionHeading
        eyebrow="Watch"
        title="Watch a quick tour"
        description="Recorded in the real app: connect, browse, and query MongoDB."
      />
      <Reveal className="mx-auto mt-14 max-w-5xl">
        <VideoPlayer video={videos[0]} />
      </Reveal>
      <div className="mt-8 flex justify-center">
        <Button asChild variant="secondary">
          <Link href="/videos">
            Watch all {videos.length} video tours <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}

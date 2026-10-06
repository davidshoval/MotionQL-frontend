"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration, type VideoTour } from "@/lib/videos";

/** A video tour that shows only its poster until clicked, so pages don't download any video up front. */
export function VideoPlayer({ video, className, priority }: { video: VideoTour; className?: string; priority?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const src = `/videos/${video.slug}`;

  return (
    <div
      className={cn(
        "border-border bg-card relative aspect-video overflow-hidden rounded-2xl border shadow-[0_40px_120px_-40px_color-mix(in_oklch,var(--primary)_35%,transparent)]",
        className,
      )}
    >
      {playing ? (
        <video
          src={`${src}.mp4`}
          poster={`${src}.jpg`}
          controls
          autoPlay
          playsInline
          className="size-full bg-black"
          aria-label={video.title}
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group focus-visible:ring-ring absolute inset-0 cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
          aria-label={`Play video: ${video.title} (${formatDuration(video.seconds)})`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static poster, already sized */}
          <img
            src={`${src}.jpg`}
            alt=""
            loading={priority ? "eager" : "lazy"}
            className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" aria-hidden />
          <span
            className="bg-primary text-primary-foreground absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full shadow-[0_0_0_10px_color-mix(in_oklch,var(--primary)_25%,transparent)] transition group-hover:scale-110"
            aria-hidden
          >
            <Play className="ml-1 size-7 fill-current" />
          </span>
          <span className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 font-mono text-xs text-white" aria-hidden>
            {formatDuration(video.seconds)}
          </span>
        </button>
      )}
    </div>
  );
}

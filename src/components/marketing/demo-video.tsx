"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "./reveal";

/** Click-to-load YouTube embed, so the page doesn't pay for the player until someone wants it. */
export function DemoVideo() {
  const [play, setPlay] = useState(false);
  return (
    <Reveal className="container-page py-10">
      <div className="border-border relative mx-auto aspect-video max-w-5xl overflow-hidden rounded-3xl border bg-[radial-gradient(80%_80%_at_50%_100%,#0b6e6a,#0b1119_70%)] shadow-2xl">
        {play ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${site.demoVideoId}?autoplay=1&rel=0&modestbranding=1`}
            title="XQuery demo"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlay(true)} className="group absolute inset-0 cursor-pointer" aria-label="Play the XQuery demo video">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${site.demoVideoId}/maxresdefault.jpg`}
              alt=""
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="size-full object-cover opacity-70 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-90"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute top-1/2 left-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition group-hover:scale-110 group-hover:bg-white/25">
              <Play className="ml-1 size-8 fill-white text-white" />
            </span>
            <span className="absolute bottom-6 left-6 text-left text-white">
              <span className="block text-sm text-white/70">Watch the demo</span>
              <span className="block text-xl font-semibold">XQuery in action</span>
            </span>
          </button>
        )}
      </div>
    </Reveal>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Download, Lock, ShieldCheck } from "lucide-react";
import type { OS, ReleaseFile } from "@/lib/api";
import { useMe, useRelease } from "@/lib/api/hooks";
import { detectOS, fileLabel, linuxInstallers, osLabel, sortFiles, startDownload } from "@/lib/os";
import { cn, formatBytes, formatDate } from "@/lib/utils";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";

function OsGlyph({ os, className }: { os: OS; className?: string }) {
  // Simple neutral glyphs; we don't ship third-party logos.
  const d = {
    macos: "M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.9C6.9 7.3 5.4 8.2 4.6 9.7c-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.4 1.2 0 1.6-.8 3-.8s1.8.8 3 .8c1.3 0 2.1-1.2 2.8-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.4-4zM14.1 5.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z",
    windows: "M3 5.5 10.5 4.5v7H3zM11.5 4.4 21 3v8.5h-9.5zM3 12.5h7.5v7L3 18.5zM11.5 12.5H21V21l-9.5-1.4z",
    linux:
      "M12 3c-2 0-3.2 1.7-3.2 4 0 1.3.3 2.2-.6 3.6-.9 1.4-2.6 3.4-2.6 5.6 0 .8.2 1.4.5 1.9-.6.4-1.1 1-1.1 1.6 0 1 1.4 1.3 3 1.3 1 0 1.8-.3 2.4-.7.5.1 1 .2 1.6.2s1.1-.1 1.6-.2c.6.4 1.4.7 2.4.7 1.6 0 3-.3 3-1.3 0-.6-.5-1.2-1.1-1.6.3-.5.5-1.1.5-1.9 0-2.2-1.7-4.2-2.6-5.6-.9-1.4-.6-2.3-.6-3.6 0-2.3-1.2-4-3.2-4z",
  }[os];
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6 fill-current", className)} aria-hidden>
      <path d={d} />
    </svg>
  );
}

export function DownloadPanel() {
  const { data: me, isLoading: meLoading } = useMe();
  const { data: release, isLoading, isError } = useRelease();
  const [os, setOs] = useState<OS | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the visitor's OS is only known in the browser
  useEffect(() => setOs(detectOS()), []);

  function download(f: ReleaseFile) {
    startDownload(f);
    toast.success(`Downloading ${f.name}`, { description: "Next: open MotionQL, go to Settings → License and paste your key." });
  }

  if (isLoading || meLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-72 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (isError || !release) {
    return (
      <div className="border-border bg-card/50 rounded-3xl border p-10 text-center">
        <p className="text-lg font-medium">We couldn&apos;t load the latest release.</p>
        <p className="text-muted-foreground mt-2">You can get every installer straight from our releases page.</p>
        <Button asChild className="mt-6">
          <a href={site.releasesUrl} target="_blank" rel="noreferrer">
            Open releases <ArrowRight />
          </a>
        </Button>
      </div>
    );
  }

  const order: OS[] = os ? [os, ...(["macos", "windows", "linux"] as OS[]).filter((o) => o !== os)] : ["macos", "windows", "linux"];

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground text-center text-sm">
        Version <span className="text-foreground font-mono">{release.version}</span> · released {formatDate(release.publishedAt)} ·{" "}
        <a href={release.releaseNotesUrl} className="text-primary hover:underline">
          release notes
        </a>
      </p>

      {!me && (
        <div className="border-primary/30 bg-primary/[0.06] mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border p-6 text-center sm:flex-row sm:text-left">
          <Lock className="text-primary size-6 shrink-0" />
          <p className="flex-1 text-[15px]">
            <span className="font-medium">Create a free account to download.</span>{" "}
            <span className="text-muted-foreground">You&apos;ll also get your free Pro key for 12 months.</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login?next=/download">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register?next=/download">Create account</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {order.map((o, idx) => {
          const files = o === "linux" ? linuxInstallers(release.files) : sortFiles(release.files.filter((f) => f.os === o));
          const recommended = idx === 0 && os === o;
          return (
            <div
              key={o}
              className={cn(
                "relative flex flex-col rounded-3xl p-7",
                recommended
                  ? "border-beam shadow-[0_30px_80px_-40px_color-mix(in_oklch,var(--brand-mint)_60%,transparent)]"
                  : "border-border bg-card/50 border",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="bg-foreground/[0.05] grid size-12 place-items-center rounded-2xl">
                  <OsGlyph os={o} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{osLabel[o]}</h3>
                  {recommended && <p className="text-primary text-xs">Recommended for your computer</p>}
                </div>
              </div>
              {files.length === 0 && (
                <p className="text-muted-foreground mt-6 flex-1 text-sm">
                  Coming soon.{" "}
                  <Link href={`/download/${o === "macos" ? "mac" : o}`} className="text-primary hover:underline">
                    Learn more
                  </Link>
                </p>
              )}
              <ul className="mt-6 flex flex-1 flex-col gap-2">
                {files.map((f, i) => (
                  <li key={f.name}>
                    <Button
                      className="w-full justify-between"
                      variant={recommended && i === 0 ? "default" : "secondary"}
                      disabled={!me}
                      onClick={() => download(f)}
                    >
                      <span className="flex items-center gap-2">
                        <Download />
                        {fileLabel(f)}
                      </span>
                      <span className="text-xs opacity-70">{formatBytes(f.size)}</span>
                    </Button>
                    <Tooltip content={<span className="font-mono break-all">{f.sha256 ? `SHA-256 ${f.sha256}` : "Checksum in SHA256SUMS.txt"}</span>}>
                      <p className="text-muted-foreground mt-1 cursor-help truncate px-3 font-mono text-[10.5px]">{f.name}</p>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
        <ShieldCheck className="text-primary size-4" /> Signed installers. Checksums are listed in SHA256SUMS.txt with every release.
      </p>
    </div>
  );
}

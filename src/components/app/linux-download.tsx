"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Clock, Download } from "lucide-react";
import type { ReleaseFile } from "@/lib/api";
import { useLinuxRelease, useMe } from "@/lib/api/hooks";
import { fileLabel, startDownload } from "@/lib/os";
import { formatBytes } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Hero actions for /download/linux. Offers the real installers when the latest release has Linux files
 * (same lookup as the download panel), and "coming soon" with no download link otherwise.
 */
export function LinuxDownload() {
  const { files, available, release, isLoading } = useLinuxRelease();
  const { data: me, isLoading: meLoading } = useMe();

  if (isLoading || (available && meLoading)) {
    return (
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-11 w-56 rounded-full" />
        <Skeleton className="h-11 w-44 rounded-full" />
      </div>
    );
  }

  if (!available) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4">
        <Badge variant="warning" className="px-3 py-1 text-sm">
          <Clock /> Coming soon. No Linux download is available yet.
        </Badge>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/download/mac">
              Get it for macOS <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/download/windows">Get it for Windows</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/changelog">Follow the changelog</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/register?next=/download/linux">
              Create a free account to download <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/login?next=/download/linux">Sign in</Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          {files.map(fileLabel).join(" and ")} for x64 · version {release?.version}
        </p>
      </div>
    );
  }

  function download(f: ReleaseFile) {
    startDownload(f);
    toast.success(`Downloading ${f.name}`, { description: "Next: open MotionQL, go to Settings → License and paste your key." });
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {files.map((f, i) => (
          <Button key={f.name} size="lg" variant={i === 0 ? "default" : "secondary"} onClick={() => download(f)}>
            <Download /> {fileLabel(f)} <span className="text-xs opacity-70">{formatBytes(f.size)}</span>
          </Button>
        ))}
      </div>
      <p className="text-muted-foreground text-sm">
        Version {release?.version} for x64.{" "}
        <Link href="/download" className="text-primary hover:underline">
          All downloads and checksums
        </Link>
      </p>
    </div>
  );
}

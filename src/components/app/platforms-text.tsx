"use client";

import { useLinuxRelease } from "@/lib/api/hooks";
import { platformsText } from "@/lib/site";

/**
 * The list of supported platforms, aware of whether Linux installers are published yet. Renders the
 * "Linux coming soon" wording until the latest release is known to include Linux.
 */
export function PlatformsText({ variant = "short" }: { variant?: keyof typeof platformsText }) {
  const { available } = useLinuxRelease();
  return <>{platformsText[variant][available ? "withLinux" : "withoutLinux"]}</>;
}

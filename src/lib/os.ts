import type { OS, ReleaseFile } from "@/lib/api";

export function detectOS(): OS | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/Mac/i.test(ua) && !/iPhone|iPad/i.test(ua)) return "mac";
  if (/Win/i.test(ua)) return "windows";
  if (/Linux|X11/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return null;
}

export const osLabel: Record<OS, string> = { mac: "macOS", windows: "Windows", linux: "Linux" };

export function fileLabel(f: ReleaseFile) {
  if (f.os === "mac") return f.arch === "arm64" ? "Apple Silicon" : f.arch === "x64" ? "Intel" : "Universal";
  if (f.os === "windows") return f.kind === "msi" ? "MSI installer" : f.kind === "portable" ? "Portable" : "Installer";
  return (
    { AppImage: "AppImage", deb: "Debian / Ubuntu (.deb)", rpm: "Fedora / RHEL (.rpm)" }[f.kind as "AppImage" | "deb" | "rpm"] ?? f.kind
  );
}

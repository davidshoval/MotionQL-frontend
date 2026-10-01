import type { OS, ReleaseFile } from "@/lib/api";

export function detectOS(): OS | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/Mac/i.test(ua) && !/iPhone|iPad/i.test(ua)) return "macos";
  if (/Win/i.test(ua)) return "windows";
  if (/Linux|X11/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return null;
}

export const osLabel: Record<OS, string> = { macos: "macOS", windows: "Windows", linux: "Linux" };

export function fileLabel(f: ReleaseFile) {
  if (f.os === "macos") {
    const chip = f.arch === "arm64" ? "Apple Silicon" : f.arch === "x64" ? "Intel" : "Universal";
    return f.kind === "zip" ? `${chip} (.zip)` : chip;
  }
  if (f.os === "windows") return f.kind === "msi" ? "MSI installer" : f.kind === "zip" ? "Portable (.zip)" : "Installer";
  return { appimage: "AppImage", deb: "Debian / Ubuntu (.deb)", rpm: "Fedora / RHEL (.rpm)" }[f.kind as "appimage" | "deb" | "rpm"] ?? f.kind;
}

/** Installers first, archives last, so the first file per OS is the one to recommend. */
export function sortFiles(files: ReleaseFile[]) {
  const rank = { dmg: 0, exe: 0, appimage: 0, msi: 1, deb: 1, rpm: 2, zip: 3 } as const;
  const arch = { arm64: 0, x64: 1, universal: 0 } as const;
  return [...files].sort((a, b) => rank[a.kind] - rank[b.kind] || arch[a.arch] - arch[b.arch]);
}

/** Start a download. GitHub release assets download directly from their URL. */
export function startDownload(f: ReleaseFile) {
  window.location.assign(f.url);
}

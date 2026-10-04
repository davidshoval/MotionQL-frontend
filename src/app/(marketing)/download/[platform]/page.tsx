import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { ScreenFrame } from "@/components/marketing/screen-frame";
import { Cta } from "@/components/marketing/cta";
import { LinuxDownload } from "@/components/app/linux-download";
import { Button } from "@/components/ui/button";
import { features } from "@/lib/features";
import { pageMetadata } from "@/lib/seo";

/**
 * Platform landing pages. Requirements and install details come from the desktop app's docs/INSTALLATION.md
 * (repo xquery.io-platform). The Linux page asks the latest release whether Linux installers exist (LinuxDownload)
 * and shows "coming soon" with no download link until they do, so its static copy is written to fit both states.
 */
const platforms = {
  mac: {
    os: "macOS",
    title: "The MongoDB GUI for Mac",
    metaTitle: "MongoDB GUI for Mac (Apple Silicon and Intel)",
    description:
      "MotionQL is a fast MongoDB IDE for macOS, with builds for Apple Silicon and Intel, and secrets kept in your macOS Keychain.",
    requirements: [
      "macOS 12 Monterey or later",
      "Apple Silicon (arm64) or Intel (x64): separate builds for each",
      "4 GB RAM minimum, 8 GB recommended for large result sets",
      "About 500 MB of disk space",
      "MongoDB 4.4 or later, Atlas, DocumentDB, Cosmos DB for MongoDB or FerretDB",
    ],
    details: [
      {
        // The current builds are not code-signed yet (owner decision, October 2026); see /docs/install.
        t: "Not yet code-signed",
        d: "macOS asks you to confirm the first launch in System Settings → Privacy & Security (Open Anyway). Every release ships SHA-256 checksums so you can verify the file.",
      },
      { t: "Keychain for secrets", d: "Passwords, keys and tokens are encrypted with the macOS Keychain and never shown in the UI." },
      { t: "Drag to install", d: "Open the .dmg for your Mac and drag MotionQL to Applications." },
      {
        t: "Updating",
        d: "In-app updates need signed builds, so for now you install new versions from the download page. Your connections and settings are kept.",
      },
      {
        t: "Works with your MDM",
        d: "Deploy the app from the .dmg or .zip with Jamf, Kandji or Intune, plus a machine-wide policy.json.",
      },
      { t: "Background tasks", d: "Scheduled tasks can run while the app is closed through a per-user LaunchAgent (Pro)." },
    ],
  },
  windows: {
    os: "Windows",
    title: "The MongoDB GUI for Windows",
    metaTitle: "MongoDB GUI for Windows 10 and 11",
    description:
      "MotionQL is a fast MongoDB IDE for Windows 10 and 11. Install per user without admin rights, per machine with the MSI, or run the portable build.",
    requirements: [
      "Windows 10 or 11, 64-bit (x64)",
      "4 GB RAM minimum, 8 GB recommended for large result sets",
      "About 500 MB of disk space",
      "MongoDB 4.4 or later, Atlas, DocumentDB, Cosmos DB for MongoDB or FerretDB",
    ],
    details: [
      {
        t: "Three ways to install",
        d: "An installer (per user without admin rights, or for all users), a per-machine MSI, or a portable build with no install.",
      },
      {
        t: "Not yet code-signed",
        d: "SmartScreen warns on first run: click More info, then Run anyway. Every release ships SHA-256 checksums so you can verify the file.",
      },
      {
        t: "Silent installs",
        d: "The installer accepts /S, /allusers and /D=, and the MSI installs with msiexec /qn for Intune, Configuration Manager or Group Policy.",
      },
      { t: "Your profile protects secrets", d: "Passwords, keys and tokens are encrypted with your Windows user profile (DPAPI)." },
      {
        t: "Central control",
        d: "A machine-wide policy.json can turn off updates or AI, or force read-only hosts. IT can deploy updates through the MSI.",
      },
      {
        t: "Background tasks",
        d: "Scheduled tasks can run while the app is closed through Task Scheduler, only while you are signed in (Pro).",
      },
    ],
  },
  linux: {
    os: "Linux",
    title: "The MongoDB GUI for Linux",
    metaTitle: "MongoDB GUI for Linux",
    description:
      "MotionQL for Linux comes as an x86_64 AppImage and a .deb package, with the same features, connections and free Pro license as on macOS and Windows.",
    requirements: [
      "64-bit x86 (x64) desktop distribution with a graphical session",
      "A Secret Service provider such as GNOME Keyring or KWallet to store passwords",
      "4 GB RAM minimum, 8 GB recommended",
      "MongoDB 4.4 or later, Atlas, DocumentDB, Cosmos DB for MongoDB or FerretDB",
    ],
    details: [
      {
        t: "Same app, same features",
        d: "The Linux build is the same desktop app as on macOS and Windows: queries, aggregation, SQL, compare and sync, and the AI assistant.",
      },
      {
        t: "Secrets in your keyring",
        d: "Passwords and keys are encrypted with your Secret Service provider, never stored in plain text.",
      },
      { t: "Background tasks", d: "Scheduled tasks can run while the app is closed through a systemd user timer (Pro)." },
      {
        t: "One license everywhere",
        d: "Your Pro key works on any operating system, so you can move between Linux, macOS and Windows.",
      },
    ],
  },
} as const;

type Platform = keyof typeof platforms;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(platforms).map((platform) => ({ platform }));
}

export async function generateMetadata({ params }: PageProps<"/download/[platform]">): Promise<Metadata> {
  const { platform } = await params;
  const p = platforms[platform as Platform];
  if (!p) return {};
  return pageMetadata({ title: p.metaTitle, description: p.description, path: `/download/${platform}` });
}

const highlights = [
  "visual-query-builder",
  "aggregation-pipeline-builder",
  "sql-query",
  "compare-sync",
  "import-export",
  "ai-assistant-mcp",
];

export default async function PlatformPage({ params }: PageProps<"/download/[platform]">) {
  const { platform } = await params;
  const p = platforms[platform as Platform];
  if (!p) notFound();
  const others = (Object.keys(platforms) as Platform[]).filter((k) => k !== platform);

  return (
    <>
      <PageHero eyebrow={`MotionQL for ${p.os}`} title={p.title} description={p.description}>
        {platform === "linux" ? (
          <LinuxDownload />
        ) : (
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/download">
                Download for {p.os} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/register?next=/download">Create a free account</Link>
            </Button>
          </div>
        )}
      </PageHero>

      <section className="container-page max-w-5xl py-8">
        <Reveal>
          <ScreenFrame id="collection-tree" alt="A MotionQL collection tab showing documents in a tree view" priority />
        </Reveal>
      </section>

      <section className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">System requirements</h2>
          <ul className="mt-6 space-y-3">
            {p.requirements.map((r) => (
              <li key={r} className="text-muted-foreground flex gap-3 text-[15px] leading-relaxed">
                <Check className="text-primary mt-1 size-4 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
          {p.details.map((d, i) => (
            <Reveal key={d.t} delay={(i % 2) * 0.06} className="border-border bg-card/50 rounded-3xl border p-6">
              <h3 className="font-semibold tracking-tight">{d.t}</h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">{d.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading
          title={`Everything MotionQL does, on ${p.os}`}
          description="The same features on every platform. A few to start with:"
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((slug) => {
            const f = features.find((x) => x.slug === slug);
            if (!f) return null;
            return (
              <Link
                key={f.slug}
                href={`/features/${f.slug}`}
                className="border-border bg-card/50 hover:border-primary/40 flex items-start gap-3 rounded-2xl border p-5 transition"
              >
                <f.icon className="text-primary mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="block font-medium">{f.name}</span>
                  <span className="text-muted-foreground mt-1 line-clamp-2 block text-sm">{f.summary}</span>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="text-muted-foreground mt-10 text-center text-sm">
          Also available for{" "}
          {others.map((k, i) => (
            <span key={k}>
              {i > 0 && " and "}
              <Link href={`/download/${k}`} className="text-primary hover:underline">
                {platforms[k].os}
              </Link>
            </span>
          ))}
          .
        </p>
      </section>

      <Cta />
    </>
  );
}

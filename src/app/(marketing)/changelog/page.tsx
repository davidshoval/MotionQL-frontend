import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PageHero } from "@/components/marketing/page-hero";
import { MarkdownDoc } from "@/components/marketing/markdown";

export const metadata: Metadata = pageMetadata({
  title: "Changelog",
  description: "What's new in each release of MotionQL, the MongoDB GUI for macOS, Windows and Linux.",
  path: "/changelog",
});

export default async function ChangelogPage() {
  const raw = await readFile(path.join(process.cwd(), "content/CHANGELOG.md"), "utf8");
  // Drop the file's own title and intro; the page hero replaces them. Fill the not-yet-set release date.
  const body = raw.replace(/^# Changelog[\s\S]*?(?=^## )/m, "").replace(/ — \[RELEASE DATE\]/g, "");
  return (
    <>
      <PageHero eyebrow="Changelog" title="What's new" description="Every release of the MotionQL desktop app and Team Server." />
      <section className="container-page max-w-3xl py-8">
        <MarkdownDoc source={body} className="prose-h2:mt-0 prose-h2:text-3xl prose-h3:text-primary" />
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { MarkdownDoc } from "@/components/marketing/markdown";

const docs = {
  terms: { file: "TERMS_OF_SERVICE.md", title: "Terms of Service" },
  privacy: { file: "PRIVACY_POLICY.md", title: "Privacy Policy" },
  eula: { file: "EULA.md", title: "End User License Agreement" },
  "acceptable-use": { file: "ACCEPTABLE_USE.md", title: "Acceptable Use Policy" },
  "security-policy": { file: "SECURITY_POLICY.md", title: "Security Policy" },
} as const;
type Slug = keyof typeof docs;

export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = docs[slug as Slug];
  // The documents are still templates awaiting legal review, so keep them out of search results until they're final.
  return d ? { title: d.title, robots: { index: false } } : {};
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const d = docs[slug as Slug];
  if (!d) notFound();
  const raw = await readFile(path.join(process.cwd(), "content/legal", d.file), "utf8");
  // The source files open with an internal "Template" note for whoever finalizes them; it isn't for site visitors.
  const body = raw.replace(/^>\s*\*\*Template[^\n]*\n+/, "");
  const draft = /\[[A-Z][A-Z ]+\]/.test(body);
  return (
    <section className="container-page max-w-3xl pt-36 pb-16">
      {draft && (
        <p className="border-warning/30 bg-warning/10 text-warning mb-10 rounded-2xl border px-5 py-4 text-sm">
          Draft: this document is being finalized and may change before XQuery&apos;s public release.
        </p>
      )}
      <MarkdownDoc source={body} />
    </section>
  );
}

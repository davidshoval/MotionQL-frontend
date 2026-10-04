import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { docSections } from "@/lib/docs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description: "How to install MotionQL, connect to MongoDB, query, move data, automate tasks and use the AI assistant.",
  alternates: { canonical: "/docs" },
};

export default function DocsIndex() {
  return (
    <article>
      <p className="text-primary font-mono text-[11px] tracking-[0.14em] uppercase">Documentation</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">MotionQL docs</h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
        MotionQL is a desktop IDE for MongoDB, Atlas and MongoDB-compatible databases. Start with{" "}
        <Link href="/docs/install" className="text-primary hover:underline">
          installing the app
        </Link>{" "}
        and{" "}
        <Link href="/docs/activate" className="text-primary hover:underline">
          activating your free Pro key
        </Link>
        , then pick a topic below. Press <kbd className="border-border rounded border px-1.5 font-mono text-xs">/</kbd> to search.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {docSections.map((s) => (
          <section key={s.title} className="border-border bg-card/50 rounded-2xl border p-6">
            <h2 className="font-semibold">{s.title}</h2>
            <ul className="mt-4 space-y-3">
              {s.pages.map((p) => (
                <li key={p.slug}>
                  <Link href={`/docs/${p.slug}`} className="group block">
                    <span className="group-hover:text-primary flex items-center gap-1.5 text-sm font-medium transition-colors">
                      {p.title}
                      <ArrowRight className="size-3.5 opacity-0 transition group-hover:opacity-100" />
                    </span>
                    <span className="text-muted-foreground block text-sm">{p.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="text-muted-foreground mt-12 text-sm">
        Can&apos;t find an answer? Read the{" "}
        <Link href="/faq" className="text-primary hover:underline">
          FAQ
        </Link>{" "}
        or{" "}
        <Link href="/support" className="text-primary hover:underline">
          contact support
        </Link>{" "}
        at {site.contactEmail}.
      </p>
    </article>
  );
}

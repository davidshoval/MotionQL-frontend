import type { Metadata } from "next";
import Link from "next/link";
import { CircleDashed, LoaderCircle } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What we're building next for MotionQL: SQL databases, split panes, a Linux release, translations and more.",
  alternates: { canonical: "/roadmap" },
};

type Status = "in-progress" | "planned";

interface Item {
  title: string;
  body: string;
  status: Status;
}

// No dates on purpose: we publish what we're working on, not promises about when it ships.
const items: Item[] = [
  {
    title: "SQL databases",
    status: "in-progress",
    body: "Connect to relational databases next to MongoDB, browse their tables and run SQL in the same app. Today, SQL databases are a source for SQL Migration only.",
  },
  {
    title: "Split panes and tab groups",
    status: "in-progress",
    body: "Put two query tabs side by side, group tabs, and have the layout remembered per window.",
  },
  {
    title: "Faster results grid",
    status: "in-progress",
    body: "Smoother scrolling and editing for large result sets in the table view.",
  },
  {
    title: "Live server monitoring",
    status: "in-progress",
    body: "Server Monitoring backed by real serverStatus, dbStats and top metrics, and explain analysis in the query builder that feeds Index Review.",
  },
  {
    title: "User management and GridFS previews",
    status: "in-progress",
    body: "Edit database users and change passwords from Users & Roles, and preview files in the GridFS browser.",
  },
  {
    title: "Linux release",
    status: "in-progress",
    body: "Linux installers for 64-bit x86 desktops, an AppImage and a .deb package, arriving with the next release.",
  },
  {
    title: "Interface polish",
    status: "in-progress",
    body: "A denser, more consistent interface: shared control sizes, compact toolbars and tidier dialogs.",
  },
  {
    title: "Signed installers and in-app updates",
    status: "planned",
    body: "Code-signed macOS and Windows builds, so no security warning on first launch, and updates installed from inside the app.",
  },
];

const statusMeta: Record<Status, { label: string; icon: typeof LoaderCircle; variant: "default" | "secondary" }> = {
  "in-progress": { label: "In progress", icon: LoaderCircle, variant: "default" },
  planned: { label: "Planned", icon: CircleDashed, variant: "secondary" },
};

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Roadmap"
        title="What we're building next"
        description="The features we're working on now and the ones lined up after. No dates: things ship when they're ready, and every release is in the changelog."
      />
      <section className="container-page max-w-4xl space-y-14 pb-8">
        {(["in-progress", "planned"] as Status[]).map((status) => {
          const meta = statusMeta[status];
          const Icon = meta.icon;
          return (
            <div key={status}>
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                <Icon className="text-primary size-5" aria-hidden /> {meta.label}
              </h2>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {items
                  .filter((i) => i.status === status)
                  .map((i) => (
                    <li key={i.title} className="border-border bg-card/50 rounded-2xl border p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold">{i.title}</h3>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{i.body}</p>
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
        <p className="text-muted-foreground border-border border-t pt-8 text-sm">
          Missing something you need? Tell us on the{" "}
          <Link href="/support" className="text-primary hover:underline">
            support page
          </Link>
          . Shipped work is listed in the{" "}
          <Link href="/changelog" className="text-primary hover:underline">
            changelog
          </Link>
          .
        </p>
      </section>
    </>
  );
}

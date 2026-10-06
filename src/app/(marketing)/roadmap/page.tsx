import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { CircleCheck, CircleDashed, LoaderCircle } from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = pageMetadata({
  title: "Roadmap",
  description: "What we're building next for MotionQL, and what shipped recently: AI on every screen, SQL databases, split panes, faster results and a Linux release.",
  path: "/roadmap",
});

type Status = "in-progress" | "planned" | "shipped";

interface Item {
  title: string;
  body: string;
  status: Status;
}

// No dates on purpose: we publish what we're working on, not promises about when it ships.
const items: Item[] = [
  {
    title: "Signed installers and in-app updates",
    status: "planned",
    body: "Code-signed macOS and Windows builds, so no security warning on first launch, and updates installed from inside the app.",
  },
  {
    title: "AI on every screen (1.2)",
    status: "shipped",
    body: "An Ask AI button on nearly every screen: the chart editor, dashboards, profiler, server monitoring, indexes, import and export, roles, the scheduler and the SQL editor. It suggests, you apply. Backup Gemini models take over when Gemini is busy.",
  },
  {
    title: "SQL databases",
    status: "shipped",
    body: "PostgreSQL, MySQL, MariaDB, SQL Server and Oracle next to MongoDB: browse tables, run SQL and edit rows.",
  },
  {
    title: "Split panes and tab groups",
    status: "shipped",
    body: "Put tabs side by side and group them, with live results in every pane.",
  },
  {
    title: "Faster results",
    status: "shipped",
    body: "First rows no longer wait for the count, common actions are 1.5 to 8 times faster, and Load all opens 50,000 documents in a few seconds.",
  },
  {
    title: "Live server monitoring",
    status: "shipped",
    body: "Real serverStatus, dbStats and top metrics, and a real explain with index suggestions in the query builder.",
  },
  {
    title: "Import from Compass, Studio 3T and Robo 3T",
    status: "shipped",
    body: "Bring your saved connections over in one step.",
  },
  {
    title: "User management and GridFS previews",
    status: "shipped",
    body: "Edit database users and change passwords, preview GridFS files and upload them by drag and drop.",
  },
  {
    title: "Linux release",
    status: "shipped",
    body: "An AppImage and a .deb package for 64-bit x86 desktops.",
  },
  {
    title: "Interface polish and lower memory",
    status: "shipped",
    body: "Every screen redesigned to be more compact, secondary panels that open and close, and about 30% less memory.",
  },
];

const statusMeta: Record<Status, { label: string; icon: typeof LoaderCircle; variant: "default" | "secondary" }> = {
  "in-progress": { label: "In progress", icon: LoaderCircle, variant: "default" },
  planned: { label: "Planned", icon: CircleDashed, variant: "secondary" },
  shipped: { label: "Shipped", icon: CircleCheck, variant: "secondary" },
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
        {(["in-progress", "planned", "shipped"] as Status[]).filter((st) => items.some((i) => i.status === st)).map((status) => {
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

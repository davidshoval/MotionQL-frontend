import type { Metadata } from "next";
import {
  ArrowLeftRight,
  Building2,
  CalendarClock,
  Cloud,
  Database,
  FileCode2,
  Gauge,
  Network,
  PlugZap,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  Table2,
  Users,
  Workflow,
} from "lucide-react";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/marketing/reveal";
import { SpotlightCard } from "@/components/marketing/spotlight-card";
import { Cta } from "@/components/marketing/cta";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Every MotionQL feature: connections, query builder, IntelliShell, aggregation, SQL, import/export, compare and sync, migration, schema tools, admin, tasks, dashboards, AI and teams.",
};

const groups: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tier?: "Pro" | "Enterprise";
  items: string[];
}[] = [
  {
    id: "connections",
    icon: PlugZap,
    title: "Connections and authentication",
    items: [
      "Connection Manager with folders, tags, colors and dev / staging / prod environments, with a production warning banner",
      "Standalone, seed lists, mongodb+srv, replica sets with read preference and tags, sharded clusters, direct and load-balanced connections, Unix sockets",
      "TLS with CA and client certificates; SSH tunnels with password or key, host-key pinning and up to four jump hosts; SOCKS5 and HTTP proxies",
      "SCRAM-SHA-256/1, X.509, LDAP, Kerberos, AWS IAM and OIDC (browser sign-in, plus workload identity for Azure, GCP and Kubernetes)",
      "Quick connect with Cmd/Ctrl+1–9, health indicator, and export/import with secrets stripped or password-encrypted",
    ],
  },
  {
    id: "querying",
    icon: Table2,
    title: "Collection tab and query builder",
    items: [
      "Filter, projection, sort, skip and limit in shell syntax, or build them visually",
      "Tree, table and JSON views with a column picker and in-place editing",
      "Collation, read and write concern, read preference, maxTimeMS and hint; cancel any query",
      "Explain tab, plus a COLLSCAN warning badge on slow filters, without running the query",
      "Document version history with one-click revert; copy as Extended JSON or shell",
    ],
  },
  {
    id: "intellishell",
    icon: SquareTerminal,
    title: "IntelliShell",
    items: [
      "mongosh-style commands with autocomplete, history, snippets, Query Assist and explain",
      "Commands are parsed as literals, never eval'd, so nothing you paste can execute",
      "Optional Script mode runs real JavaScript (variables, loops, functions) in a local QuickJS sandbox",
      "Common helpers including rs.*, sh.*, db.aggregate and exact NumberLong math",
    ],
  },
  {
    id: "aggregation",
    icon: Workflow,
    title: "Aggregation editor",
    items: [
      "Stage-by-stage preview of the documents after every stage",
      "Full operator library, options and templates",
      "Convert any find into a pipeline in one click",
      "AI pipeline debugging when you want it",
    ],
  },
  {
    id: "sql",
    icon: FileCode2,
    title: "SQL Query and Query Code",
    items: [
      "Read-only SELECT with joins, grouping and ordering, translated to MongoDB find or aggregate",
      "Open and save .sql files",
      "Generate code for mongo shell, Node.js, Python, Java, C#, PHP, Ruby, Go and Rust from deterministic templates",
    ],
  },
  {
    id: "data-movement",
    icon: ArrowLeftRight,
    title: "Import, export, compare and sync",
    items: [
      "JSON, JSON Lines, CSV, BSON, Excel and SQL INSERT, with column mapping and typing",
      "Insert, upsert, replace and merge modes; streamed jobs with progress and cancel",
      "Copy collections; dump and restore in mongodump layout or a single archive file",
      "Data Compare & Sync with field-level diffs, dry-run preview, selective sync and conflict policies",
    ],
  },
  {
    id: "migration",
    icon: Database,
    title: "SQL Migration and Data Masking",
    tier: "Pro",
    items: [
      "Migrate from PostgreSQL, MySQL, MariaDB, SQL Server and Oracle",
      "Choose reference or embed for each relationship, with preview and progress",
      "Data Masking with eleven methods and a preview before anything is written",
      "Reschema operations to restructure documents safely",
    ],
  },
  {
    id: "schema",
    icon: Network,
    title: "Schema and Data Model",
    items: [
      "Schema analysis with CSV, Markdown and HTML reports",
      "Schema Compare & History: snapshots, drift, and validator, index and option diffs",
      "ER diagrams inferred from field names, DBRefs, views and matching values; export to PNG, SVG, Mermaid and JSON",
      "Value Search across databases and collections",
    ],
  },
  {
    id: "admin",
    icon: Gauge,
    title: "Administration and monitoring",
    items: [
      "Index management with hidden indexes, $indexStats usage, live build progress and Index Review",
      "Server monitoring, running operations with kill, query profiler and topology view",
      "Users and custom roles with a privilege inspector",
      "GridFS browser, views, transactions with dry-run, change stream viewer, oplog history",
      "In-use encryption: CSFLE and Queryable Encryption",
    ],
  },
  {
    id: "atlas",
    icon: Cloud,
    title: "MongoDB Atlas",
    tier: "Pro",
    items: [
      "Organizations, projects, clusters, database users and IP access lists",
      "Pause and resume clusters",
      "Create a connection from any cluster",
      "Atlas Search and Vector Search index management",
    ],
  },
  {
    id: "tasks",
    icon: CalendarClock,
    title: "Tasks and dashboards",
    tier: "Pro",
    items: [
      "Schedule exports, imports, copies, compares, masking, migrations, dumps, scripts and index reviews",
      "Once, interval, daily, weekly and cron schedules with a run log",
      "A background runner keeps tasks going while the app is closed; run them from scripts with --cli",
      "Dashboards with ten chart types on live aggregations, shared filters, present mode and PDF export",
    ],
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "AI assistant",
    items: [
      "Gemini, Anthropic Claude, or any OpenAI-compatible endpoint including local models, with your own key",
      "Natural language to find, aggregation and SQL; explain plans; fix errors; index advice",
      "Ask Your Database for natural-language lookups",
      "Off for every connection until you allow it. Sends schema, never document values or credentials",
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Security and governance",
    items: [
      "Read-only, AI and server-side JavaScript policies enforced in the app's main process",
      "Secrets encrypted with your OS keychain and never shown in the UI",
      "Local audit log with credential redaction; app lock with idle timeout",
      "Machine-wide policy.json for MDM and GPO, validated fail-closed",
    ],
  },
  {
    id: "teams",
    icon: Users,
    title: "Team Server",
    tier: "Enterprise",
    items: [
      "Self-hosted, with OpenID Connect SSO (Okta, Entra ID, Google Workspace) and SCIM 2.0",
      "Shared connections (never with secrets), queries, scripts, snippets and tasks with version history",
      "Signed policies applied by every desktop as a floor, even offline",
      "Hash-chained central audit log you can forward to your SIEM",
    ],
  },
  {
    id: "platforms",
    icon: Building2,
    title: "Platforms",
    items: [
      "macOS (Apple Silicon and Intel), Windows and Linux (AppImage, deb, rpm)",
      "MongoDB 4.4 and later: Community, Enterprise and Atlas",
      "Amazon DocumentDB, Azure Cosmos DB for MongoDB and FerretDB",
      "Signed installers and automatic updates you can turn off by policy",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything you need to work with MongoDB"
        description="One desktop app from first connection to production migration. Here is all of it."
      >
        <nav aria-label="Feature groups" className="mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              className="border-border bg-foreground/[0.03] text-muted-foreground hover:border-primary/40 hover:text-foreground rounded-full border px-3 py-1.5 text-[13px] transition"
            >
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>
      <section className="container-page grid gap-4 py-12 md:grid-cols-2">
        {groups.map((g, i) => (
          <Reveal key={g.id} delay={(i % 2) * 0.06}>
            <SpotlightCard id={g.id} className="h-full scroll-mt-28 p-8">
              <div className="flex items-center gap-3">
                <span className="border-border from-primary/15 text-primary grid size-11 place-items-center rounded-2xl border bg-gradient-to-br to-transparent">
                  <g.icon className="size-5" />
                </span>
                <h2 className="text-xl font-semibold tracking-tight">{g.title}</h2>
                {g.tier && (
                  <Badge variant={g.tier === "Pro" ? "default" : "violet"} className="ml-auto">
                    {g.tier}
                  </Badge>
                )}
              </div>
              <ul className="mt-6 space-y-3">
                {g.items.map((it) => (
                  <li key={it} className="text-muted-foreground flex gap-3 text-[15px] leading-relaxed">
                    <span className="bg-primary/70 mt-2.5 size-1.5 shrink-0 rounded-full" />
                    {it}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </Reveal>
        ))}
      </section>
      <Cta />
    </>
  );
}

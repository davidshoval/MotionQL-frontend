import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  Activity,
  ArrowLeftRight,
  Building2,
  FolderKanban,
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
import { PlatformsText } from "@/components/app/platforms-text";
import { features } from "@/lib/features";

export const metadata: Metadata = pageMetadata({
  title: "Features",
  description:
    "Every MotionQL feature across 60+ databases: SQL editor and query builder, server insights, Logs & analytics, projects and environments, import/export, migration, MongoDB tools, tasks, dashboards, AI and teams.",
  path: "/features",
});

const groups: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tier?: "Pro" | "Enterprise";
  items: React.ReactNode[];
}[] = [
  {
    id: "connections",
    icon: PlugZap,
    title: "Connections for 60+ databases",
    items: [
      "PostgreSQL, MySQL, MariaDB, SQL Server, Oracle, SQLite, DuckDB, MongoDB, Redis and Valkey, Elasticsearch and OpenSearch, ClickHouse, Snowflake, BigQuery, Trino, Databricks, Spanner, DynamoDB, Cassandra, InfluxDB, Neo4j, and any JDBC driver",
      "Hosted services with their own dialogs: Supabase, Neon, RDS and Aurora, Azure SQL, Atlas, Elastic Cloud, Upstash, Astra and more",
      "TLS with CA and client certificates; SSH tunnels with password or key, host-key pinning and jump hosts; SOCKS5 and HTTP proxies",
      "Cloud sign-ins such as AWS IAM, Entra ID and OIDC where the database supports them",
      "Import connections and saved queries from DBeaver, DataGrip, pgAdmin, MySQL Workbench, Azure Data Studio, Navicat, Compass and Studio 3T",
    ],
  },
  {
    id: "projects",
    icon: FolderKanban,
    title: "Projects and environments",
    items: [
      "Group one application's databases of every engine into a project with Development, Test, Staging and Production",
      "Production confirms every write, on every engine, enforced in the app's main process and written to the audit log",
      "Read-only environments, colour stripes on tabs and a Project Home with pinned objects, saved queries and notes",
      "Cross-database links: orders.customerId in MongoDB to customers.id in PostgreSQL, with a diagram and jump to related records",
      "Export a project as a folder you can commit to Git, or share it with your team",
    ],
  },
  {
    id: "sql-databases",
    icon: Database,
    title: "SQL editor and table tools",
    items: [
      "SQL editor with schema-aware completion, a result tab per statement, pinned results and result compare",
      "Per-tab sessions and manual transactions, with confirmations for DROP, TRUNCATE and unbounded DELETE or UPDATE",
      "Visual SQL Query Builder that joins on foreign keys, and ER diagrams with a design mode",
      "Table tab with WHERE / ORDER BY, editing by primary key, charts, and export to CSV, JSON, Excel, SQL INSERT or Markdown",
      "Engine-specific tools: PostgreSQL roles, RLS and partitions, Oracle PL/SQL, ClickHouse merges, Snowflake warehouses, BigQuery cost guard",
    ],
  },
  {
    id: "insights",
    icon: Activity,
    title: "Logs, analytics and server insights",
    items: [
      "Logs & analytics for every family: the server's own log, slow operations grouped by shape and live metrics",
      "PostgreSQL: EXPLAIN, pg_stat_statements, activity and locks, vacuum health and an index advisor",
      "MySQL, MariaDB and TiDB: statement digests, processes, locks and deadlocks, waits and I/O",
      "ClickHouse query log, Redis slow log and memory, Elasticsearch cluster health, Cassandra and InfluxDB panels",
      "Ask AI on any panel: what to fix first, with the plan or statistics as context",
    ],
  },
  {
    id: "other-engines",
    icon: Workflow,
    title: "Tools made for each NoSQL engine",
    items: [
      "Redis and Valkey: key browser by namespace, every data type, console, slow log, pub/sub and RDB analysis",
      "Elasticsearch and OpenSearch: Discover with a time range, documents, console, mappings and index administration",
      "DynamoDB scan, query and PartiQL; Cassandra rows and CQL; InfluxDB Flux and SQL with charts",
      "Neo4j and Memgraph: Cypher console with a graph view, label browser and schema",
    ],
  },
  {
    id: "querying",
    icon: Table2,
    title: "MongoDB: collection tab and query builder",
    items: [
      "Filter, projection, sort, skip and limit in shell syntax, or build them visually",
      "Tree, table and JSON views with a column picker and in-place editing",
      "Collation, read and write concern, read preference, maxTimeMS and hint; cancel any query",
      "Explain tab, plus a COLLSCAN warning badge on slow filters, without running the query",
      "Document version history with one-click revert; copy as Extended JSON or shell",
      "Split panes and tab groups with live results in every pane; Load all opens 50,000 documents in a few seconds",
    ],
  },
  {
    id: "intellishell",
    icon: SquareTerminal,
    title: "MongoDB: IntelliShell",
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
    title: "MongoDB: aggregation editor",
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
    title: "MongoDB: SQL Query and Query Code",
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
      "CSV, JSON, JSON Lines, Excel and SQL INSERT for tables, collections, indices and keys, with column mapping and typing",
      "Streamed jobs with progress and cancel; insert, upsert, replace and merge modes",
      "MongoDB: copy collections, dump and restore, and Data Compare & Sync with dry-run preview",
      "SQL schema and data compare between tables (Pro)",
    ],
  },
  {
    id: "migration",
    icon: Database,
    title: "Migration and Data Masking",
    tier: "Pro",
    items: [
      "Move data between databases: SQL to MongoDB, Redis to MongoDB or SQL, and more, with type mapping and a dry run",
      "SQL to MongoDB: choose reference or embed for each relationship, with preview and progress",
      "Data Masking with eleven methods and a preview before anything is written",
      "Reschema operations to restructure documents safely",
    ],
  },
  {
    id: "schema",
    icon: Network,
    title: "MongoDB: schema and data model",
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
    title: "MongoDB: administration and monitoring",
    items: [
      "Index management with hidden indexes, $indexStats usage, live build progress and Index Review",
      "Live server monitoring from serverStatus, dbStats and top; running operations with kill, query profiler and topology view",
      "Users and custom roles with a privilege inspector; edit users and change passwords",
      "GridFS browser with previews and drag-and-drop upload; views, transactions with dry-run, change stream viewer, oplog history",
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
      "Schedule exports, imports, copies, compares, masking, migrations, dumps, scripts and snapshots",
      "Once, interval, daily, weekly and cron schedules with a run log",
      "A background runner keeps tasks going while the app is closed; run them from scripts with --cli",
      "Dashboards with ten chart types on live query results, shared filters, present mode and PDF export",
      "Share dashboards through the workspace folder or the Team Server",
    ],
  },
  {
    id: "ai",
    icon: Sparkles,
    title: "AI assistant",
    items: [
      "Gemini, Anthropic Claude, or any OpenAI-compatible endpoint including local models, with your own key",
      "Natural language to SQL, MongoDB queries and pipelines, Cypher, Redis commands and search queries; explain plans; fix errors; index advice",
      "Ask Your Database for natural-language lookups",
      "An Ask AI button on nearly every screen, and backup Gemini models when Gemini is busy",
      "Off for every connection until you allow it. Sends schema, never row or document values or credentials",
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
      <PlatformsText key="platforms" variant="long" />,
      <Link key="dbs" href="/databases" className="text-primary hover:underline">
        60+ databases and hosted services: see the full list
      </Link>,
      "SHA-256 checksums with every release (installers are not yet code-signed)",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything you need, for every database"
        description="One desktop app for SQL and NoSQL, from first connection to production migration. Here is all of it."
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
      <section className="container-page py-12" aria-labelledby="feature-pages">
        <h2 id="feature-pages" className="sr-only">
          Explore a feature in depth
        </h2>
        {(
          [
            { scope: "every", title: "For every database" },
            { scope: "mongodb", title: "For MongoDB" },
          ] as const
        ).map((g) => (
          <div key={g.scope} className="mt-8 first:mt-0">
            <h3 className="text-muted-foreground text-center font-mono text-[11px] tracking-[0.14em] uppercase">{g.title}</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {features
                .filter((f) => f.scope === g.scope)
                .map((f) => (
                  <li key={f.slug}>
                    <Link
                      href={`/features/${f.slug}`}
                      className="border-border bg-card/50 hover:border-primary/40 hover:bg-primary/[0.04] flex h-full items-center gap-3 rounded-2xl border px-4 py-3 text-[14.5px] transition"
                    >
                      <f.icon className="text-primary size-4 shrink-0" />
                      <span className="flex-1">{f.name}</span>
                      {f.tier && (
                        <Badge variant={f.tier === "Pro" ? "default" : "violet"} className="text-[10px]">
                          {f.tier}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
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
                {g.items.map((it, i) => (
                  <li key={i} className="text-muted-foreground flex gap-3 text-[15px] leading-relaxed">
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

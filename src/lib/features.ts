import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Columns2,
  BarChart3,
  CalendarClock,
  Cloud,
  Database,
  EyeOff,
  FileCode2,
  FileStack,
  FlaskConical,
  GitCompareArrows,
  Gauge,
  ListTree,
  Network,
  PackageOpen,
  PlugZap,
  Sparkles,
  SquareTerminal,
  Table2,
  Users,
  Workflow,
  Activity,
  FolderKanban,
  Link2,
  NotebookPen,
  GitBranch,
  TableProperties,
  DatabaseZap,
} from "lucide-react";
import type { DatabaseScreenId } from "@/lib/databases";

/**
 * One page per MotionQL feature, served at /features/[slug].
 *
 * Every statement here comes from the desktop app's own docs or code (repo xquery.io-platform):
 * docs/USER_GUIDE.md, CHANGELOG.md (1.0.0 to Unreleased), docs/ENGINES.md and the files named next to each entry.
 * Licensing tiers come from src/main/licensing/features.ts (Pro: migration, masking, tasks, atlas, rdb-analysis, cloud,
 * sqlCompare, debugger, vcs; Enterprise: team).
 */

/** Screens in public/screens (dark-<id>.webp and light-<id>.webp). */
export type ScreenId =
  | "aggregation-stage-preview"
  | "collection-tree"
  | "connection-safety-settings"
  | "data-compare-sync"
  | "explain-plan"
  | "export-dialog"
  | "index-review"
  | "intellishell"
  | "query-builder"
  | "schema-analysis"
  | "sql-query"
  | DatabaseScreenId;

export interface Feature {
  slug: string;
  /** Short name for cards and links. */
  name: string;
  /** Page H1. */
  title: string;
  /** One or two sentences under the H1; also the meta description. */
  summary: string;
  /** Browser/search title. */
  metaTitle: string;
  icon: LucideIcon;
  /** "every" works across the database families; "mongodb" is MongoDB only. */
  scope: "every" | "mongodb";
  tier?: "Pro" | "Enterprise";
  /** Extra line about licensing when only part of the feature is licensed. */
  tierNote?: string;
  screen?: { id: ScreenId; alt: string; caption: string };
  /** Real commands or file layouts from the docs, shown when there is no screenshot. */
  snippet?: { label: string; code: string };
  capabilities: { t: string; d: string }[];
  related: string[];
}

export const features: Feature[] = [
  {
    // USER_GUIDE "Connections", "Connection safety", "Creating a connection"; src/shared/engines/registry.ts
    slug: "connections-security",
    name: "Connections & security",
    title: "Connect to every database you run, safely",
    metaTitle: "Database connection manager with SSH tunnels, TLS, cloud sign-in and read-only mode",
    summary:
      "One Add connection grid for 60+ databases and cloud services, with SSH tunnels, TLS and cloud sign-in, and read-only, production and AI policies that the app itself enforces on every engine.",
    icon: PlugZap,
    scope: "every",
    screen: {
      id: "connection-safety-settings",
      alt: "The Safety tab of a MotionQL connection with read-only, AI and server-side JavaScript switches",
      caption: "Per-connection safety: read-only, Allow AI and literal values, set per connection.",
    },
    capabilities: [
      {
        t: "Pick from 60+ databases",
        d: "Add connection opens a searchable grid of every database and hosted service. Picking one opens that engine's own dialog with its port, TLS and service settings preset.",
      },
      {
        t: "Paste a URL",
        d: "postgres://, mysql://, mongodb+srv://, redis:// and rediss:// URLs, or a copied DATABASE_URL line, fill host, port, user, TLS and the server type in one go.",
      },
      {
        t: "Recognised on connect",
        d: "Supabase, Neon, Timescale, Aurora, Redshift, CockroachDB, TiDB, Azure SQL, Autonomous Database, Atlas, DocumentDB, Valkey, OpenSearch and more are detected and get their own tools.",
      },
      {
        t: "Cloud sign-in",
        d: "AWS IAM for RDS, Aurora, Redshift, DocumentDB and DynamoDB; Microsoft Entra ID for Azure SQL and Azure PostgreSQL; Google sign-in for BigQuery and Spanner; OIDC, X.509, LDAP and Kerberos for MongoDB.",
      },
      {
        t: "Tunnels and certificates",
        d: "TLS with CA and client certificates, and SSH tunnels with password or key on every server engine. MongoDB also takes jump hosts and SOCKS5 or HTTP proxies.",
      },
      {
        t: "Read-only that really is",
        d: "Enforced in the main process on every engine, not by hiding buttons, and on SQL engines by a read-only session or transaction too. Production environments confirm every write.",
      },
      {
        t: "Bring your connections",
        d: "Import saved connections from Studio 3T, DBeaver, DataGrip, Compass, Robo 3T and others from the welcome screen.",
      },
      {
        t: "Secrets stay in the keychain",
        d: "Passwords, keys and tokens are encrypted with your OS keychain and never shown in the UI. Exports strip secrets or encrypt them with a password you choose.",
      },
      {
        t: "Audit and confirmation",
        d: "A local audit log of writes and security events with credentials redacted. Drops, truncates and dangerous commands ask you to type the object's name.",
      },
    ],
    related: ["projects-environments", "team-workspace", "ai-assistant-mcp"],
  },
  {
    // CHANGELOG Unreleased "SQL editor and grid", "SQL Query Builder", "SQL table tab"; USER_GUIDE "SQL databases"
    slug: "sql-databases",
    name: "SQL editor & query builder",
    title: "A SQL editor that knows your schema, on every engine",
    metaTitle: "SQL editor and visual query builder for PostgreSQL, MySQL, SQL Server, Oracle and more",
    summary:
      "Scope-aware completion that writes join clauses from foreign keys, inspections with quick fixes, a visual query builder that round-trips with the editor, manual transactions, and a grid that stays fast with every row fetched.",
    icon: Database,
    scope: "every",
    screen: {
      id: "sql-query-builder",
      alt: "MotionQL's SQL Query Builder with tables joined on a canvas and the generated SQL below",
      caption: "Drag tables onto the canvas; joins come from foreign keys and the SQL follows in your dialect.",
    },
    capabilities: [
      {
        t: "Completion that reads the query",
        d: "Columns from the tables in FROM through their aliases, whole JOIN clauses from foreign keys in both directions, names inside CTEs and subqueries, and function signatures per dialect.",
      },
      {
        t: "Inspections with quick fixes",
        d: "UPDATE or DELETE without WHERE, unknown tables and columns (fixed to the closest name), ambiguous columns, unused aliases, = NULL and implicit cross joins.",
      },
      {
        t: "Visual query builder",
        d: "Tables on a canvas with joins from foreign keys, filters, grouping, having, order and limit, and a live preview in the connection's dialect that goes back into the editor.",
      },
      {
        t: "Transactions you can see",
        d: "Auto-commit off with Commit and Rollback on every engine that has transactions. The open transaction's statement count and age show in the toolbar, and idle ones roll back after a timeout.",
      },
      {
        t: "Results you can compare",
        d: "Pin a result across runs and diff two result tabs: changed cells old to new, and added and removed rows matched by a key column.",
      },
      {
        t: "A table tab like a collection tab",
        d: "Table, Record and JSON views, filter chips with typed WHERE and ORDER BY, a query panel inside the tab, column menus, pinned columns, cell statistics, auto-refresh and a chart of the page.",
      },
      {
        t: "Visual Explain everywhere",
        d: "Each engine's own plan as a tree: PostgreSQL, MySQL, SQL Server, Oracle, SQLite, DuckDB, ClickHouse, Snowflake, BigQuery, Trino, Databricks, Spanner, Redshift and the JDBC engines.",
      },
      {
        t: "Table actions",
        d: "Generate SELECT, INSERT, UPDATE or DELETE, design a table, open its CREATE statement, rename, duplicate, truncate or drop, each with a preview, typed confirmation and audit.",
      },
      {
        t: "Export anything",
        d: "Results and tables to CSV, JSON, Excel, SQL INSERT in the connection's dialect or Markdown. Large Redshift results stream to a file in full.",
      },
    ],
    related: ["er-diagram-design", "sql-data-tools", "logs-analytics"],
  },
  {
    // CHANGELOG Unreleased "Logs & analytics for every database", "history", "Storage, Usage and Alerts"
    slug: "logs-analytics",
    name: "Logs & analytics",
    title: "Your database's logs, slow queries and metrics, in one tab",
    metaTitle: "Database logs, slow query analytics and monitoring for every engine",
    summary:
      "One read-only tab per connection that reads the server's own log, metrics, slow operations and live activity, groups slow queries by shape, charts history the server already keeps, and raises alerts while you work.",
    icon: Activity,
    scope: "every",
    screen: {
      id: "logs-analytics",
      alt: "MotionQL's Logs & analytics tab with live charts, slow operations grouped by shape and a log viewer",
      caption: "Overview tiles and live charts, slow operations by shape, and the server log, over the connection already open.",
    },
    capabilities: [
      {
        t: "One tab, every engine",
        d: "MongoDB getLog and system.profile, pg_stat_statements and PostgreSQL log files, MySQL performance_schema and slow_log, SQL Server error and Agent logs, Oracle's alert log, ClickHouse query_log, Redis SLOWLOG, Elasticsearch tasks and many more.",
      },
      {
        t: "Slow operations by shape",
        d: "Calls, total, mean and p95 time and share of time per query shape, so the one query that costs the most stands out.",
      },
      {
        t: "A log viewer that groups",
        d: "Severity and text filters, similar-message grouping, a severity-over-time chart and CSV or JSON export.",
      },
      {
        t: "History from the database itself",
        d: "Live, 1 h, 6 h, 24 h, 7 d or 30 d from what the server already keeps: Atlas measurements, Query Store, AWR, query history, CloudWatch and more. Where a server keeps nothing, record history on this computer.",
      },
      {
        t: "Storage and usage",
        d: "Table and collection sizes with growth per day, unused indexes first, and usage by user, client, application or database.",
      },
      {
        t: "Alerts while you work",
        d: "A metric above or below a threshold for N minutes, errors in the log or slow operations, checked on this computer with system notifications.",
      },
      {
        t: "Read-only, always",
        d: "It never changes anything on the server. Where a server does not expose something, the section says why and what would enable it.",
      },
    ],
    related: ["query-profiler-explain", "ai-assistant-mcp", "sql-databases"],
  },
  {
    // CHANGELOG Unreleased "Projects and environments for every engine"; USER_GUIDE "Projects and environments"
    slug: "projects-environments",
    name: "Projects & environments",
    title: "Group your databases by project, with a policy per environment",
    metaTitle: "Database projects with Development, Staging and Production environments",
    summary:
      "A project groups MongoDB, SQL, Redis and search connections into Development, Test, Staging and Production, each with a colour and a policy the app enforces, plus saved queries that run unchanged on the next environment.",
    icon: FolderKanban,
    scope: "every",
    capabilities: [
      {
        t: "Environments with teeth",
        d: "Production always confirms writes, and any environment can be read-only. The main process enforces both on every engine and audits each refusal.",
      },
      {
        t: "Colour everywhere",
        d: "Tabs carry their environment's colour, and production connections show a banner, so you always know where a query will run.",
      },
      {
        t: "Saved items",
        d: "Save a SQL query, MongoDB query or pipeline, shell script, Redis commands, search request, notebook or dashboard into the project, in folders.",
      },
      {
        t: "Run against",
        d: "Open a saved item on another connection of the same engine and role, so a query written on Development runs unchanged on Staging.",
      },
      {
        t: "Project Home",
        d: "Environments with live status, pinned objects, recent queries, Markdown notes and Ask AI about this project. Each project restores its open tabs.",
      },
      {
        t: "Git-friendly and shareable",
        d: "Export a project as a folder or a single file with secrets and local paths stripped, or share it through Team Server.",
      },
    ],
    related: ["cross-database-links", "connections-security", "team-workspace"],
  },
  {
    // CHANGELOG Unreleased "Cross-database links in projects"; USER_GUIDE "Cross-database links"
    slug: "cross-database-links",
    name: "Cross-database links",
    title: "Follow a customer from Postgres to MongoDB to Redis",
    metaTitle: "Cross-database relationships and a project diagram across engines",
    summary:
      "Record how fields relate across connections and engines, let MotionQL find and check the links, see them on one diagram, and jump from a value to the related record on another database.",
    icon: Link2,
    scope: "every",
    capabilities: [
      {
        t: "Links across engines",
        d: "MongoDB fields, SQL columns of any engine, Redis key patterns such as user:{id}, and search index fields, each with a cardinality and a label.",
      },
      {
        t: "Find links",
        d: "Suggestions from names and types (customerId to customers.id, *_id) checked against small read-only samples on this computer. Declared foreign keys come in as known links.",
      },
      {
        t: "Project diagram",
        d: "A canvas across connections, nodes framed in their engine's colour, cardinality labels, automatic layout and PNG or SVG export.",
      },
      {
        t: "Jump to the related record",
        d: "A linked value in a SQL grid, a MongoDB table, a search hit or a Redis key opens the related records from their own connection, and the reverse.",
      },
      {
        t: "Ask AI how they relate",
        d: "Explain how these databases relate, and AI-proposed links from names only, added when you confirm.",
      },
    ],
    related: ["projects-environments", "er-diagram-design", "schema-analysis-er-diagram"],
  },
  {
    // CHANGELOG Unreleased "ER diagram design mode"
    slug: "er-diagram-design",
    name: "ER diagrams & design",
    title: "Design tables on the diagram and apply the DDL",
    metaTitle: "ER diagram tool with forward engineering for SQL databases",
    summary:
      "Draw tables, columns, keys and relationships on the ER canvas, preview the CREATE and ALTER statements against the live schema in your dialect, and apply them in one transaction.",
    icon: TableProperties,
    scope: "every",
    screen: {
      id: "er-diagram",
      alt: "An ER diagram of a shop schema in MotionQL with tables and foreign-key relationships",
      caption: "The ER canvas for a SQL schema, with keys and relationships drawn from the catalog.",
    },
    capabilities: [
      { t: "Reverse and forward", d: "Open any schema as a diagram, then add and edit tables, columns, keys and relationships on it." },
      {
        t: "DDL you can read first",
        d: "The dialect's CREATE and ALTER statements are previewed against the live schema before anything runs.",
      },
      {
        t: "One transaction",
        d: "Applied in one transaction where the engine allows it, with the production confirmation, read-only refusal and audit.",
      },
      {
        t: "From documents to tables",
        d: "MongoDB's Data Model plans SQL tables from analyzed collections (child tables for arrays, foreign keys for references) and opens them in design mode.",
      },
      { t: "Export", d: "PNG and SVG images of the diagram." },
    ],
    related: ["sql-databases", "schema-analysis-er-diagram", "cross-database-links"],
  },
  {
    // CHANGELOG Unreleased "Notebooks"
    slug: "notebooks",
    name: "Notebooks",
    title: "Notebooks across databases",
    metaTitle: "SQL, MongoDB and Redis notebooks with charts and AI cells",
    summary:
      "SQL, MongoDB, Redis, Markdown, chart and AI cells in one tab, across connections, saved with their results and exported to Markdown or HTML.",
    icon: NotebookPen,
    scope: "every",
    capabilities: [
      {
        t: "Mixed cells",
        d: "SQL, MongoDB, Redis, Markdown, chart and AI cells, each on its own connection, in one notebook.",
      },
      {
        t: "Run like a notebook",
        d: "Run a cell, run from here or run all, and cancel. Destructive statements ask first, and read-only connections run reads only.",
      },
      {
        t: "Results kept",
        d: "Each cell keeps a snapshot of up to 500 rows, so the notebook reads well without re-running it.",
      },
      {
        t: "Chain on SQLite and DuckDB",
        d: "A cell can query an earlier cell's result by name.",
      },
      {
        t: "Charts and AI",
        d: "Chart cells chart an earlier result; AI cells turn a question into a query cell; AI inline completion in SQL and MongoDB cells.",
      },
      {
        t: "Share it",
        d: "Save as .mqnb, keep it in the workspace or scripts folder, share it to a Team Server, or export Markdown and HTML.",
      },
    ],
    related: ["charts-dashboards", "scripts-git", "sql-databases"],
  },
  {
    // CHANGELOG Unreleased "Scripts folder and Git version control"; licensing: vcs is Pro, the folder is free
    slug: "scripts-git",
    name: "Scripts folder & Git",
    title: "Your queries in Git, without leaving the app",
    metaTitle: "Version control for SQL, MongoDB and Redis scripts with Git",
    summary:
      "Keep every saved query and script as a file in a folder or repository, and stage, commit, branch, pull and push from a Source Control tab with AI-suggested commit messages.",
    icon: GitBranch,
    scope: "every",
    tier: "Pro",
    tierNote: "The scripts folder and its files are free. Git version control needs Pro, which every registered user gets free for a year.",
    snippet: {
      label: "Scripts folder",
      code: `orders/monthly-revenue.sql       -- @motionql connection=Prod Postgres
orders/late-shipments.mongodb.js // @motionql connection=Atlas prod
cache/hot-keys.redis
search/errors-last-hour.es
analytics/funnel.mqnb`,
    },
    capabilities: [
      {
        t: "One file per script",
        d: "Each engine's extension (.sql, .mongodb.js, .cql, .redis, .es, .partiql, .mqnb) with a header naming its connection and database. Ctrl/Cmd+S saves back to the file.",
      },
      {
        t: "Source Control tab",
        d: "Staged, changed and untracked files, a side-by-side diff, stage, unstage and discard, and commit.",
      },
      { t: "Branches and remotes", d: "Switch and create branches, check out remote ones, and fetch, pull and push with progress." },
      { t: "History and conflicts", d: "Per-file history with revision diffs and restore, and merge conflicts edited in place." },
      { t: "AI commit messages", d: "Suggested from file names and the shape of changed lines, not their values." },
      {
        t: "Your Git, safely",
        d: "Uses the system git with your credential helper and SSH agent, never stores a Git password and never force-pushes.",
      },
    ],
    related: ["team-workspace", "notebooks", "projects-environments"],
  },
  {
    // CHANGELOG Unreleased "SQL power tools", "pg_dump and mysqldump backups", "Test data for every engine"
    slug: "sql-data-tools",
    name: "Table compare, backups & test data",
    title: "Compare tables, back them up and fill them with test data",
    metaTitle: "Compare SQL table data, pg_dump and mysqldump backups, and SQL test data",
    summary:
      "Compare two tables on any engines and sync the difference, run pg_dump and mysqldump backups on a schedule, and fill a schema with realistic test data that keeps foreign keys intact.",
    icon: DatabaseZap,
    scope: "every",
    tierNote: "Compare table data needs Pro, which every registered user gets free for a year. Backups and test data are free.",
    capabilities: [
      {
        t: "Compare table data (Pro)",
        d: "Two tables on any connections and engines, matched on the primary key or chosen columns, read in chunks so large tables work. Save the sync script or apply it in one transaction.",
      },
      {
        t: "pg_dump and mysqldump",
        d: "Backups with format, schemas, tables and parallel jobs, with a live log; restores show the command and ask for the database name. Schedule a backup that keeps the newest N files.",
      },
      {
        t: "Engine backups",
        d: "SQL Server full, differential and log backups, Oracle Data Pump, Firebird gbak, and H2, HSQLDB and Derby backups.",
      },
      {
        t: "Test data for SQL",
        d: "Generators chosen per column from its type and name, foreign keys filled from parent rows, unique values, a preview and batched inserts in one transaction.",
      },
      {
        t: "Describe the data",
        d: "Tell the AI what the rows should look like and it picks generators and row counts, checked against each column.",
      },
    ],
    related: ["sql-databases", "tasks-scheduling", "test-data-generator"],
  },
  {
    // USER_GUIDE "AI assistant", "MCP server"; CHANGELOG Unreleased "Ask AI on every screen", "AI for every database family"
    slug: "ai-assistant-mcp",
    name: "AI assistant & MCP server",
    title: "An AI assistant for every database that never sees your data unless you say so",
    metaTitle: "AI SQL, MongoDB, Redis and Cypher assistant with your own key, plus an MCP server",
    summary:
      "Bring your own Gemini, Claude or OpenAI-compatible key, or a local model. Write, explain and fix queries in every language MotionQL speaks, ask AI on every screen, and let coding tools use your connections through a local MCP server.",
    icon: Sparkles,
    scope: "every",
    snippet: {
      label: "MCP endpoint (this computer only)",
      code: "http://127.0.0.1:27118/mcp",
    },
    capabilities: [
      {
        t: "Your provider",
        d: "Google Gemini, Anthropic Claude, or any OpenAI-compatible endpoint, including local models such as Ollama.",
      },
      {
        t: "Every query language",
        d: "SQL in each dialect, MongoDB queries and pipelines, Redis commands, Query DSL and ES|QL, PartiQL, CQL, Flux and InfluxQL, and Cypher, each with its own instructions.",
      },
      {
        t: "Checked before it's offered",
        d: "Names that don't exist on the connection get a warning, and another language's syntax is removed with the reason, such as JOIN in CQL or LIMIT on SQL Server.",
      },
      {
        t: "Ask AI on every screen",
        d: "Plans, performance panels, slow logs, connection errors, grants, backups, import mappings and more get an Ask AI card that knows the screen. It suggests; nothing runs until you apply it.",
      },
      {
        t: "Inline completion",
        d: "Ghost text in the SQL editor, MongoDB shell, Redis console, search console, PartiQL editor and notebooks.",
      },
      {
        t: "Why no results?",
        d: "Under an empty result in SQL, Redis, search and DynamoDB, ask why, and get read-only checks for each likely reason.",
      },
      {
        t: "MCP server for coding tools",
        d: "Off by default. Lets Claude Code, Cursor and VS Code Copilot use connections that allow AI, on 127.0.0.1 with a private token, with read tools for SQL, search, DynamoDB, Cassandra, InfluxDB and Neo4j.",
      },
      {
        t: "Off until you allow it",
        d: "AI is off for every connection by default. Passwords, connection strings and keys are never sent, and values are masked unless you allow literals.",
      },
      {
        t: "Free to start",
        d: "A step-by-step guide gets you a free Google Gemini API key in a couple of minutes.",
      },
    ],
    related: ["logs-analytics", "connections-security", "sql-databases"],
  },
  {
    // USER_GUIDE "Import and export", "Copy, dump and restore"; CHANGELOG Unreleased AI mapping, Redis / search / DynamoDB export
    slug: "import-export",
    name: "Import, export, dump & restore",
    title: "Move data in and out in any format",
    metaTitle: "Import and export database data: JSON, CSV, Excel, SQL and more",
    summary:
      "JSON, JSON Lines, CSV, Excel, BSON and SQL INSERT for MongoDB and SQL tables, NDJSON for search indices, DynamoDB JSON, binary-safe Redis exports, and dump and restore, with AI that suggests the mapping.",
    icon: PackageOpen,
    scope: "every",
    screen: {
      id: "export-dialog",
      alt: "The MotionQL export dialog with format options",
      caption: "Export a collection, a table, the current query or a selection.",
    },
    capabilities: [
      {
        t: "Every format",
        d: "JSON, JSON Lines, CSV, BSON (mongodump-compatible), Excel .xlsx, SQL INSERT in the connection's dialect and Markdown.",
      },
      {
        t: "Every family",
        d: "MongoDB collections, SQL tables and results, Elasticsearch and OpenSearch NDJSON and CSV, DynamoDB JSON or CSV, and Redis keys as JSON Lines with TTLs.",
      },
      {
        t: "Map and type columns",
        d: "The import wizard inspects the file and lets you map and type each column, with Read as transforms for dates, unix times, localized numbers and yes/no words.",
      },
      {
        t: "AI mapping suggestions",
        d: "Field names, types, likely keys and repeated columns suggested from column names and shapes, applied with a button and undone from a bar.",
      },
      { t: "Import modes", d: "Insert, upsert, replace or merge, streamed in the background with progress and cancel." },
      {
        t: "Dump and restore",
        d: "mongodump layout or a single archive, pg_dump and mysqldump, and engine-native backups for SQL Server, Oracle and Firebird.",
      },
      { t: "Schedule it", d: "Exports, imports, copies, dumps, backups and Redis snapshots can all run as scheduled tasks (Pro)." },
    ],
    related: ["sql-migration", "sql-data-tools", "tasks-scheduling"],
  },
  {
    // USER_GUIDE "SQL Migration"; CHANGELOG Unreleased Redis / search / DynamoDB migration, Migrate out
    slug: "sql-migration",
    name: "Migration between databases",
    title: "Move data between databases, with a preview first",
    metaTitle: "Migrate between PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, Redis and DynamoDB",
    summary:
      "Move SQL tables into MongoDB with reference or embed per relationship, move Redis, Elasticsearch and DynamoDB data into MongoDB or SQL, and migrate older engines out into PostgreSQL or SQLite.",
    icon: Database,
    scope: "every",
    tier: "Pro",
    capabilities: [
      {
        t: "SQL to MongoDB",
        d: "From PostgreSQL, MySQL, MariaDB, SQL Server and Oracle, with columns, filters and type conversions per table and reference or embed per relationship.",
      },
      {
        t: "Redis, search and DynamoDB out",
        d: "Redis keys, Elasticsearch and OpenSearch indices and DynamoDB tables into MongoDB or SQL, with a preview and upserts.",
      },
      {
        t: "Migrate out of legacy engines",
        d: "Derby, HSQLDB, H2, Db2 and Firebird schemas into PostgreSQL or a new SQLite file, with keys, indexes, identity counters and a row-count and checksum check.",
      },
      { t: "Preview first", d: "See the resulting documents or rows before you run the migration." },
      {
        t: "AI mapping",
        d: "Collections, field names, type conversions and embed or reference per foreign key, suggested from names, types and keys only.",
      },
      {
        t: "Keep it in sync",
        d: "A Redis migration can become a sync task that follows keyspace notifications, and any migration can be scheduled.",
      },
    ],
    related: ["import-export", "sql-data-tools", "tasks-scheduling"],
  },
  {
    // USER_GUIDE "Tasks and scheduling", "Automation and CLI"; src/main/tasks
    slug: "tasks-scheduling",
    name: "Tasks, scheduling & CLI",
    title: "Automate the jobs you repeat",
    metaTitle: "Scheduled database tasks, backups and a command line",
    summary:
      "Save exports, syncs, backups, migrations, compares and scripts as tasks, run them on a schedule even while MotionQL is closed, or start them from your own scripts with --cli.",
    icon: CalendarClock,
    scope: "every",
    tier: "Pro",
    snippet: {
      label: "Command line",
      code: `MotionQL --cli tasks list --json
MotionQL --cli tasks run "Nightly pg_dump" --wait
MotionQL --cli tasks export "Nightly pg_dump" > task.json
MotionQL --cli tasks import task.json`,
    },
    capabilities: [
      {
        t: "Many task kinds",
        d: "MongoDB export, import, copy, compare, masking, dump, restore, script and continuous sync; pg_dump and mysqldump backups; table data compare with sync; Redis export and snapshots; SQL migrations.",
      },
      { t: "Any schedule", d: "Once, every N minutes / hours / days, daily, weekly on chosen days, or a cron expression." },
      { t: "Missed runs", d: "Choose whether a run missed while the computer slept runs once on start or is skipped." },
      { t: "Run log", d: "Every run is recorded as success, partial, failed or skipped, with counts and how it started." },
      {
        t: "Runs while the app is closed",
        d: "An optional background runner uses launchd on macOS, Task Scheduler on Windows and a systemd user timer on Linux, only while you are signed in.",
      },
      {
        t: "Command line",
        d: "List, run, export and import tasks from scripts, with exit codes for success, failure, usage errors and policy refusals.",
      },
      { t: "Checked every run", d: "Each run respects read-only connections, environments, team and machine policy, and licensing." },
      { t: "Encrypted definitions", d: "Tasks are stored encrypted, and exports never contain passwords or connection strings." },
    ],
    related: ["import-export", "sql-data-tools", "compare-sync"],
  },
  {
    // CHANGELOG 1.0.0 "Dashboards"; Unreleased result charts, Discover Visualize, time-series quick chart
    slug: "charts-dashboards",
    name: "Charts & dashboards",
    title: "Charts and dashboards on live data",
    metaTitle: "Database charts and dashboards on live queries",
    summary:
      "Chart any SQL result or table page, draw time series in one click, add a search visualization from Discover, and build dashboards on live MongoDB aggregations with shared filters.",
    icon: BarChart3,
    scope: "every",
    capabilities: [
      {
        t: "Chart any result",
        d: "Bar, line, area, pie and scatter charts of a SQL result, a table page, a notebook cell or a search aggregation.",
      },
      {
        t: "Time series in one click",
        d: "A table page with a time column gets a Chart button that draws its number columns as lines over time, averaged into buckets for large pages.",
      },
      {
        t: "Dashboards",
        d: "Ten chart types, metrics, tables and notes on a drag-and-resize grid, backed by live aggregations with shared filters and auto refresh.",
      },
      { t: "From Discover", d: "Visualize adds a bar, line or pie chart of an Elasticsearch or OpenSearch query to a dashboard." },
      { t: "Present and export", d: "Full-screen present mode, PNG, multi-page PDF, per-widget CSV and dashboard JSON." },
      { t: "AI chart builder", d: "Describe a chart or a whole dashboard in words and apply the suggestion, with undo." },
    ],
    related: ["notebooks", "aggregation-pipeline-builder", "ai-assistant-mcp"],
  },
  {
    // USER_GUIDE "Generate Test Data"; CHANGELOG Unreleased "Test data for every engine", "Describe the data"
    slug: "test-data-generator",
    name: "Test data generator",
    title: "Realistic test data in seconds",
    metaTitle: "Test data generator for MongoDB and SQL databases",
    summary:
      "Fill a MongoDB collection or a SQL schema with realistic, repeatable data that keeps relationships intact, or load the demo shop into MongoDB, Redis and Elasticsearch in one click.",
    icon: FlaskConical,
    scope: "every",
    capabilities: [
      {
        t: "MongoDB documents",
        d: "Start from a collection's live schema, with nested documents and arrays, references to real _id values, and control over presence and nulls. Insert up to a million documents or export them.",
      },
      {
        t: "SQL tables",
        d: "PostgreSQL, MySQL, MariaDB, SQL Server, Oracle, SQLite, DuckDB and the JDBC engines: generators per column, foreign keys from parent rows (parents first) and unique values.",
      },
      { t: "Describe it", d: "Tell the AI what the rows should look like; it picks generators and counts, checked against each column." },
      {
        t: "Load demo data",
        d: "Load the demo_store shop into a MongoDB, Redis, Valkey, Elasticsearch or OpenSearch connection from its menu.",
      },
      {
        t: "Many generators",
        d: "Names, emails, phones, addresses, companies, URLs, IPs, numbers with distributions, dates, UUIDs, patterns, weighted enums, sequences and geo points.",
      },
      {
        t: "Repeatable and safe",
        d: "The same seed gives the same data. Emails and URLs use reserved example domains, and US phone numbers use the range reserved for fiction.",
      },
    ],
    related: ["sql-data-tools", "data-masking-reschema", "import-export"],
  },
  {
    // USER_GUIDE "Team features"; src/shared/workspace.ts (workspace folder, free); docs/team-server
    slug: "team-workspace",
    name: "Team & workspace",
    title: "Share queries and connections, keep secrets private",
    metaTitle: "Shared database queries, workspace folders and a self-hosted Team Server",
    summary:
      "Keep queries, scripts and connections for every engine as plain files you can put in Git, or share projects through a self-hosted Team Server with SSO and signed policies.",
    icon: Users,
    scope: "every",
    tier: "Enterprise",
    tierNote: "The workspace folder is free. Team Server features need an Enterprise license.",
    snippet: {
      label: "Workspace folder",
      code: `motionql-workspace.json
connections/<name>.json   # MongoDB, SQL, Redis and search; never passwords or keys
queries/<name>.json
pipelines/<name>.json
scripts/<name>.js
sql/<name>.sql
tasks/<name>.json`,
    },
    capabilities: [
      {
        t: "Workspace folder",
        d: "One readable file per item, for SQL, Redis and search connections as well as MongoDB, so Git diffs stay readable.",
      },
      { t: "No secrets in files", d: "Connections are saved without passwords, keys or local file paths." },
      {
        t: "Share a project",
        d: "Share a project's environments, saved items and connection settings with every secret stripped; teammates match it to their own connections.",
      },
      { t: "Self-hosted Team Server", d: "OpenID Connect SSO (Okta, Entra ID, Google Workspace and others) and SCIM 2.0 provisioning." },
      {
        t: "Shared libraries",
        d: "Connections, queries, aggregations, scripts, snippets, notebooks and tasks, with version history and restore.",
      },
      { t: "Policy floors", d: "Signed policies can require read-only or turn AI off. Desktops enforce them even offline." },
      { t: "Central audit", d: "A hash-chained, signed audit log with SIEM forwarding over webhook or syslog." },
    ],
    related: ["projects-environments", "scripts-git", "connections-security"],
  },
  {
    // USER_GUIDE "Collection tab"; src/renderer/components/QueryBuilderAdvanced.tsx, query-builder/*
    slug: "visual-query-builder",
    name: "Visual query builder",
    title: "Build MongoDB queries without writing JSON",
    metaTitle: "Visual MongoDB query builder",
    summary:
      "Drag fields from the schema, combine conditions in nested AND / OR groups, and pick projection and sort. MotionQL writes the filter for you, and reads any filter you type back into the builder.",
    icon: Table2,
    scope: "mongodb",
    screen: {
      id: "query-builder",
      alt: "The MotionQL visual query builder with conditions, groups, projection and sort",
      caption: "Conditions and groups on the left, the generated MongoDB filter as you build it.",
    },
    capabilities: [
      {
        t: "Drag fields in",
        d: "Drop a field from the schema list onto the builder, a group or an existing condition.",
      },
      {
        t: "Nested AND / OR groups",
        d: "Mix groups to any depth and switch single conditions off without deleting them.",
      },
      {
        t: "Operators you use",
        d: "Comparison, $in / $nin, $exists, $type, $regex, $text, $mod, bitwise, array ($all, $size, $elemMatch), $expr, $jsonSchema and geospatial operators.",
      },
      {
        t: "Round-trip with the query bar",
        d: "A filter you type in shell syntax opens in the builder as rows and groups, so you can switch between both.",
      },
      {
        t: "Projection, sort and options",
        d: "Choose included fields, sort order, skip, limit and maxTimeMS next to the filter.",
      },
      {
        t: "Saved templates",
        d: "Save a built query as a template and open it again exactly as you left it.",
      },
      {
        t: "Tree, table and JSON results",
        d: "Results open in the collection tab with a column picker, in-place editing and document history with revert.",
      },
      {
        t: "Code from any query",
        d: "Query Code turns the query into mongo shell, Node.js, Python, Java, C#, PHP, Ruby, Go or Rust from deterministic templates.",
      },
    ],
    related: ["aggregation-pipeline-builder", "sql-query", "query-profiler-explain"],
  },
  {
    // USER_GUIDE "Aggregation editor"; src/main/stagePreview.ts
    slug: "aggregation-pipeline-builder",
    name: "Aggregation pipeline builder",
    title: "Aggregation pipelines, one stage at a time",
    metaTitle: "MongoDB aggregation pipeline builder with stage preview",
    summary:
      "Add, reorder and disable stages and see the documents after every one. The operator library covers $lookup, $facet, $setWindowFields, $search and $vectorSearch.",
    icon: Workflow,
    scope: "mongodb",
    screen: {
      id: "aggregation-stage-preview",
      alt: "The MotionQL aggregation editor showing a pipeline and the output of the selected stage",
      caption: "Every stage shows its output, so you can see where a pipeline goes wrong.",
    },
    capabilities: [
      { t: "Stage-by-stage preview", d: "See the documents coming out of each stage while you build the pipeline." },
      { t: "Reorder, disable, delete", d: "Move stages around or switch one off to see what it changes." },
      {
        t: "Full operator library",
        d: "Including $lookup, $facet, $graphLookup, $unionWith, $setWindowFields, $densify, $fill, and $search and $vectorSearch on Atlas.",
      },
      { t: "Options", d: "Allow disk use, maxTimeMS and collation." },
      { t: "Templates", d: "Start from built-in templates or your own saved ones." },
      { t: "From find to pipeline", d: "Convert any query in the collection tab into a pipeline in one click." },
      { t: "Safe on read-only connections", d: "$out and $merge count as writes and are blocked on read-only connections." },
      { t: "AI pipeline debugging", d: "On connections that allow AI, debug a pipeline stage by stage with your own AI provider." },
    ],
    related: ["visual-query-builder", "charts-dashboards", "ai-assistant-mcp"],
  },
  {
    // USER_GUIDE "IntelliShell"; docs/SHELL_COMPATIBILITY.md; src/main/shellScript (QuickJS)
    slug: "intellishell",
    name: "IntelliShell & scripting",
    title: "A mongosh-style shell that can't be tricked into running code",
    metaTitle: "IntelliShell: MongoDB shell with autocomplete and sandboxed scripts",
    summary:
      "Type the commands you know from mongosh with autocomplete and history. Commands are parsed as literals, and an optional Script mode runs real JavaScript in a local sandbox.",
    icon: SquareTerminal,
    scope: "mongodb",
    screen: {
      id: "intellishell",
      alt: "MotionQL IntelliShell with a find command, autocomplete and results",
      caption: "show dbs, use, find, aggregate, runCommand: the commands you already type, with readable results.",
    },
    capabilities: [
      {
        t: "The commands you know",
        d: "show dbs, use, find with sort / skip / limit / hint / collation / explain, aggregate, distinct, insert, update, replace, delete, index commands, runCommand and currentOp.",
      },
      {
        t: "Literal parsing by default",
        d: "Arguments must be literals and BSON constructors (ObjectId, ISODate, NumberLong, NumberDecimal). Nothing you paste can execute code unless you opt in.",
      },
      {
        t: "Script mode",
        d: "Variables, loops and functions in a QuickJS sandbox on your computer, with rs.*, sh.*, exact NumberLong math and cursor read preference. Database calls still follow the connection's policies.",
      },
      { t: "Autocomplete", d: "Collections, fields from a schema sample, and operators." },
      { t: "History and snippets", d: "Per-connection history with search, plus your own snippets." },
      { t: "Query Assist", d: "Edit results in place and explain from the shell." },
      { t: "Scripts as files", d: "Save and open .js files, and schedule a script as a task (Pro)." },
      {
        t: "Guarded writes",
        d: "Drops and unfiltered deleteMany / updateMany ask for confirmation, and writes are refused on read-only connections.",
      },
    ],
    related: ["sql-query", "tasks-scheduling", "connections-security"],
  },
  {
    // USER_GUIDE "SQL Query"; src/shared/sql
    slug: "sql-query",
    name: "SQL query on MongoDB",
    title: "Query MongoDB with SQL",
    metaTitle: "Run SQL queries on MongoDB",
    summary:
      "Write SELECT with joins, GROUP BY and HAVING. MotionQL translates it into a MongoDB find or aggregation, shows you the translation, and runs it.",
    icon: FileCode2,
    scope: "mongodb",
    screen: {
      id: "sql-query",
      alt: "MotionQL SQL Query with a SELECT statement and its MongoDB translation",
      caption: "SQL on the left, the generated MongoDB query next to it.",
    },
    capabilities: [
      {
        t: "Real SELECT",
        d: "DISTINCT and expressions, WHERE with AND / OR / NOT, IN, LIKE / ILIKE, BETWEEN and IS NULL.",
      },
      { t: "Joins", d: "INNER and LEFT JOIN, translated to $lookup." },
      { t: "Grouping", d: "GROUP BY with aggregate functions, COUNT(DISTINCT …) and HAVING; ORDER BY, LIMIT and OFFSET." },
      { t: "See the translation", d: "The generated MongoDB query is shown, and opens in IntelliShell or the aggregation editor." },
      { t: "Read-only by design", d: "Only SELECT runs. INSERT, UPDATE and DELETE are refused." },
      { t: ".sql files", d: "Save and open SQL scripts, and turn any query into code in nine languages." },
    ],
    related: ["sql-migration", "visual-query-builder", "aggregation-pipeline-builder"],
  },
  {
    // USER_GUIDE "Schema", "Data discovery" (Data Model); src/renderer/components/data-model, admin/ValidatorEditorModal.tsx
    slug: "schema-analysis-er-diagram",
    name: "Schema analysis & ER diagram",
    title: "See the shape of your data",
    metaTitle: "MongoDB schema analysis and ER diagrams",
    summary:
      "Analyze a sample of documents for fields, types and how often each one appears, then draw the whole database as an ER diagram with relationships MotionQL infers and checks for you.",
    icon: Network,
    scope: "mongodb",
    screen: {
      id: "schema-analysis",
      alt: "MotionQL schema analysis listing fields with types, frequency and value statistics",
      caption: "Fields, types, frequencies and value statistics from a sample.",
    },
    capabilities: [
      { t: "Schema analysis", d: "Fields, types, frequencies and value statistics, exported as CSV, Markdown or HTML." },
      {
        t: "ER diagram of a database",
        d: "Every collection with its fields, PK / FK keys, types, required fields and how often each field appears.",
      },
      {
        t: "Relationships found for you",
        d: "From field names (customerId → customers, items[].productId → products), DBRefs and views, each checked against sampled values. Match by value finds links with no name hint.",
      },
      {
        t: "Edit the model",
        d: "Drag collections, add or remove relationships, change cardinality, hide collections and write notes. Layout and edits are kept per database.",
      },
      { t: "Follow a relationship", d: "Open any relationship as a $lookup in the aggregation editor." },
      { t: "Export", d: "PNG or SVG images, a Mermaid erDiagram, or the diagram as JSON you can open again." },
      { t: "Validation rules", d: "Generate a $jsonSchema validator from the analyzed fields and edit validation level and action." },
      { t: "Values stay put", d: "Only names, types and match counts leave the connection; document values never reach the diagram." },
    ],
    related: ["schema-compare", "data-masking-reschema", "test-data-generator"],
  },
  {
    // USER_GUIDE "Schema Compare & History"; src/shared/schemaCompare.ts
    slug: "schema-compare",
    name: "Schema compare & drift",
    title: "Catch schema drift before it bites",
    metaTitle: "MongoDB schema compare and drift history",
    summary:
      "Compare the inferred schemas of two collections, or of one collection over time. Save snapshots, browse history and diff fields, indexes, validators and collection options.",
    icon: GitCompareArrows,
    scope: "mongodb",
    capabilities: [
      {
        t: "Collection vs collection",
        d: "Compare fields, indexes, validator and collection options between two collections, on the same or different connections.",
      },
      {
        t: "Snapshots",
        d: "Save a schema snapshot of a collection and compare it with a later snapshot or with the collection as it is now.",
      },
      { t: "History", d: "Browse earlier snapshots, newest first." },
      { t: "Export the diff", d: "Markdown, HTML or JSON for reviews and tickets." },
      {
        t: "Computed on the server",
        d: "Field statistics are computed with $sample and $group; only paths, type names and counts come back.",
      },
      { t: "Encrypted at rest", d: "Snapshots are stored encrypted on your computer." },
      { t: "On a schedule", d: "Record schema snapshots automatically as a scheduled task (Pro)." },
    ],
    related: ["schema-analysis-er-diagram", "compare-sync", "tasks-scheduling"],
  },
  {
    // USER_GUIDE "Reschema and Data Masking"; src/shared/transform; licensing: masking is Pro, reschema is free
    slug: "data-masking-reschema",
    name: "Data masking & reschema",
    title: "Mask personal data and reshape documents",
    metaTitle: "MongoDB data masking and reschema",
    summary:
      "Restructure documents with reschema operations and protect personal data with eleven masking methods, with a preview before anything is written.",
    icon: EyeOff,
    scope: "mongodb",
    tier: "Pro",
    tierNote: "Reschema is free. Data Masking needs Pro, which every registered user gets free for a year.",
    capabilities: [
      {
        t: "Reschema operations",
        d: "Rename, remove, set, copy, flatten, nest, convert type (string, int, long, double, decimal, date, objectId, bool) and array-to-field.",
      },
      {
        t: "Eleven masking methods",
        d: "Redact, null, remove, keyed HMAC hash, fake name, fake email, fake phone, shuffle, partial, date shift and number noise.",
      },
      { t: "Preview first", d: "See the transformed documents before anything is written." },
      {
        t: "Choose the target",
        d: "Write to a new collection, or back to the source after confirmation. Write-back is blocked on read-only connections.",
      },
      { t: "Mask in flight", d: "Continuous sync tasks can apply mask operations before documents reach the target." },
      {
        t: "AI suggestions",
        d: "On connections that allow AI, get masking rule suggestions from field names and value-pattern labels, never the values.",
      },
      { t: "Repeatable", d: "Save a transform as a scheduled task." },
    ],
    related: ["schema-analysis-er-diagram", "compare-sync", "test-data-generator"],
  },
  {
    // USER_GUIDE "Indexes, performance"; src/main/ai/indexReview/indexRules.ts; src/main/services/searchIndexes.ts
    slug: "index-management",
    name: "Index management & review",
    title: "Indexes you can see, measure and trust",
    metaTitle: "MongoDB index management and index review",
    summary:
      "Create, hide and drop indexes, see how often each one is used, and run Index Review to find unused, duplicate and missing indexes.",
    icon: ListTree,
    scope: "mongodb",
    screen: {
      id: "index-review",
      alt: "MotionQL Index Review with findings for a collection's indexes",
      caption: "Index Review flags redundant indexes and the ones your queries are missing.",
    },
    capabilities: [
      { t: "Every key type", d: "Create indexes with all key types and options, and drop the ones you no longer need." },
      { t: "Hide before you drop", d: "Hide and unhide indexes to test the impact safely." },
      { t: "Usage statistics", d: "See $indexStats usage for each index." },
      {
        t: "Live build progress",
        d: "Follow index builds as they run, per shard through mongos, with the shard key and the index that backs it.",
      },
      {
        t: "Index Review",
        d: "Finds missing, duplicate, prefix-redundant, unused and oversized indexes, plus partial and TTL opportunities and collections with too many indexes.",
      },
      { t: "Optional AI commentary", d: "On connections that allow AI, add advice from your own provider to the review." },
      { t: "Atlas Search indexes", d: "Manage Atlas Search and Vector Search indexes on Atlas or Atlas Local deployments." },
      {
        t: "COLLSCAN badge",
        d: "The collection tab warns about collection scans and in-memory sorts with a queryPlanner explain that does not run the query.",
      },
    ],
    related: ["query-profiler-explain", "tasks-scheduling", "ai-assistant-mcp"],
  },
  {
    // USER_GUIDE "Indexes, performance and the profiler"; src/renderer/components/collection-ide/VisualExplain.tsx
    slug: "query-profiler-explain",
    name: "Query profiler & explain",
    title: "Find slow queries and see why they're slow",
    metaTitle: "MongoDB query profiler and visual explain plans",
    summary:
      "Visual explain plans from the collection tab, shell or aggregation editor, a query profiler for slow operations, and live server monitoring.",
    icon: Gauge,
    scope: "mongodb",
    screen: {
      id: "explain-plan",
      alt: "A MotionQL explain plan shown as a tree with index use, documents examined and time",
      caption: "The winning plan as a tree, with index use, documents examined and time.",
    },
    capabilities: [
      {
        t: "Live server monitoring",
        d: "Operations per second, connections, network, memory, WiredTiger cache and queued reads and writes from serverStatus, plus dbStats and the busiest collections. Pause any time.",
      },
      {
        t: "Explain in the query builder",
        d: "See keys and documents examined, server time and the winning plan for the query you're building, with index suggestions.",
      },
      { t: "Visual explain", d: "The winning plan as a tree with index use, documents examined and execution time." },
      { t: "Explain anywhere", d: "From the collection tab, IntelliShell or the aggregation editor." },
      { t: "Query profiler", d: "Set the profiling level and slow-operation threshold, review slow operations and clear profiling data." },
      { t: "Running operations", d: "List current operations and kill one (blocked on read-only connections)." },
      { t: "Topology", d: "Replica set members and roles, and the shards of a sharded cluster." },
      { t: "AI plan advice", d: "On connections that allow AI, get an explanation of the plan and index advice." },
    ],
    related: ["index-management", "visual-query-builder", "aggregation-pipeline-builder"],
  },
  {
    // CHANGELOG 1.1.0 "Split panes and tab groups", "Faster results", "Lower memory"
    slug: "fast-workspace",
    name: "Split panes & speed",
    title: "Side by side, and fast with big collections",
    metaTitle: "Split panes and fast results for large MongoDB collections",
    summary:
      "Split the window into panes and tab groups with live results in each, open 50,000 documents in a few seconds, and keep the app light on memory.",
    icon: Columns2,
    scope: "mongodb",
    capabilities: [
      { t: "Split panes", d: "Split right or down, or drag a tab to the edge of another pane. Every pane keeps its own live results." },
      { t: "Tab groups", d: "Group related tabs and move them between panes." },
      {
        t: "Load all",
        d: "Stream every matching document into one scrollable list instead of pages. 50,000 documents open in a few seconds.",
      },
      {
        t: "First rows first",
        d: "Results appear before the document count finishes. Opening a collection, filtering, paging, aggregations and saving an edit are 1.5 to 8 times faster than in 1.0.",
      },
      { t: "Lighter", d: "About 30% less memory at idle and with a collection open; heavy parts load only when you first use them." },
      {
        t: "Calmer screens",
        d: "Previews, stats, help and history open and close with a button, and each screen remembers your choice. Hide the sidebar with Ctrl/Cmd+Alt+B.",
      },
    ],
    related: ["visual-query-builder", "intellishell", "query-profiler-explain"],
  },
  {
    // USER_GUIDE "Data Compare & Sync", "Continuous sync" task
    slug: "compare-sync",
    name: "Compare & sync",
    title: "Compare two collections and sync the difference",
    metaTitle: "MongoDB data compare and sync",
    summary:
      "Diff two collections document by document, on the same or different clusters, preview the sync, and apply only the changes you choose.",
    icon: ArrowLeftRight,
    scope: "mongodb",
    screen: {
      id: "data-compare-sync",
      alt: "MotionQL Data Compare & Sync showing documents only in source, only in target and changed",
      caption: "Only in source, only in target, and changed, with a field-level diff.",
    },
    capabilities: [
      { t: "Field-level diff", d: "Documents only in source, only in target, and changed, with the exact fields that differ." },
      { t: "Dry run first", d: "Preview the sync before anything is written." },
      { t: "Selective sync", d: "Sync only what you pick, with a conflict policy: source wins, target wins or skip." },
      { t: "Export the differences", d: "Save the diff to a file." },
      {
        t: "Continuous sync",
        d: "A scheduled task can follow a change stream and keep another collection current, optionally masking in flight (Pro).",
      },
      { t: "Safe targets", d: "Sync is blocked when the target connection is read-only." },
      { t: "AI summary", d: "On connections that allow AI, summarize a compare result." },
    ],
    related: ["schema-compare", "import-export", "tasks-scheduling"],
  },
  {
    // USER_GUIDE "GridFS"; src/renderer/components/gridfs/GridFsView.tsx
    slug: "gridfs",
    name: "GridFS",
    title: "Browse and manage GridFS files",
    metaTitle: "MongoDB GridFS browser",
    summary: "Browse GridFS buckets, preview files, drag files in to upload them, and download, rename or delete them.",
    icon: FileStack,
    scope: "mongodb",
    capabilities: [
      { t: "Every bucket", d: "Pick any bucket in a database, not just fs." },
      { t: "Search and sort", d: "Find files by name and sort by upload date, name or size, page by page." },
      {
        t: "Upload",
        d: "Upload with an optional content type and metadata document. Bytes stream from disk without passing through the UI.",
      },
      { t: "Preview", d: "Open a preview of a file without saving it to disk first." },
      { t: "Drag and drop", d: "Drop files from your desktop onto a bucket to upload them." },
      { t: "Download", d: "Save any file to disk with a native save dialog." },
      { t: "Rename and delete", d: "Rename files or delete them with confirmation. Both are blocked on read-only connections." },
    ],
    related: ["import-export", "connections-security", "atlas"],
  },
  {
    // USER_GUIDE "MongoDB Atlas"; src/main/atlas
    slug: "atlas",
    name: "Atlas admin",
    title: "Manage MongoDB Atlas from your desktop",
    metaTitle: "MongoDB Atlas management in a desktop GUI",
    summary:
      "Browse organizations, projects and clusters, check database users and IP access lists, pause or resume clusters, and create a connection from any cluster.",
    icon: Cloud,
    scope: "mongodb",
    tier: "Pro",
    capabilities: [
      { t: "Your credential", d: "An Atlas service account or a programmatic API key, stored encrypted with your OS keychain." },
      { t: "Organizations to clusters", d: "Browse organizations, projects and clusters." },
      { t: "Users and access", d: "View a project's database users and IP access list." },
      { t: "Pause and resume", d: "Pause or resume a cluster; you type its name to confirm." },
      { t: "Connect in one step", d: "Create a saved connection from a cluster; you supply the database user's password." },
      { t: "Search indexes", d: "Manage Atlas Search and Vector Search indexes from the index manager." },
      { t: "Audited", d: "Atlas actions are recorded in the local audit log." },
    ],
    related: ["connections-security", "index-management", "team-workspace"],
  },
];

export const featureBySlug = (slug: string) => features.find((f) => f.slug === slug);

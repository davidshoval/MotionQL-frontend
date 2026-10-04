import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
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
} from "lucide-react";

/**
 * One page per MotionQL feature, served at /features/[slug].
 *
 * Every statement here comes from the desktop app's own docs or code (repo xquery.io-platform):
 * docs/USER_GUIDE.md, CHANGELOG.md 1.0.0, and the files named next to each entry. Licensing tiers come from
 * src/main/licensing/features.ts (Pro: migration, masking, tasks, atlas; Enterprise: team).
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
  | "sql-query";

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
    // USER_GUIDE "Connections", "Connection safety"; src/renderer/components/connection-modal
    slug: "connections-security",
    name: "Connections & security",
    title: "Connect to any MongoDB, safely",
    metaTitle: "MongoDB connection manager with SSH, TLS and read-only mode",
    summary:
      "Every way you reach MongoDB, from localhost to SSH jump hosts and OIDC, with per-connection read-only, AI and server-side JavaScript policies enforced by the app itself.",
    icon: PlugZap,
    screen: {
      id: "connection-safety-settings",
      alt: "The Safety tab of a MotionQL connection with read-only, AI and server-side JavaScript switches",
      caption: "Per-connection safety: read-only, Allow AI and server-side JavaScript, each off or on per connection.",
    },
    capabilities: [
      {
        t: "Every topology",
        d: "Single host, seed lists, mongodb+srv, replica sets with read preference and tag sets, sharded clusters through mongos, direct and load-balanced modes, and Unix domain sockets.",
      },
      {
        t: "Every auth method",
        d: "SCRAM-SHA-256 and SHA-1, X.509, LDAP, Kerberos, AWS IAM (including the default credential chain) and OIDC with browser sign-in or workload identity for Azure, GCP and Kubernetes.",
      },
      {
        t: "Tunnels and proxies",
        d: "TLS with CA and client certificates; SSH with password or key, host-key pinning and up to four jump hosts; SOCKS5 and HTTP proxies.",
      },
      {
        t: "Read-only that really is",
        d: "Blocks inserts, updates, deletes, drops, index changes, imports, sync, $out and $merge (even inside explain). Enforced in the main process, not by hiding buttons.",
      },
      {
        t: "Organized and labelled",
        d: "Folders, tags, colors and dev / staging / prod environments, with a warning banner on production. Quick connect with Cmd/Ctrl+1–9 and a health dot per connection.",
      },
      {
        t: "Secrets stay in the keychain",
        d: "Passwords, keys and tokens are encrypted with your OS keychain and never shown in the UI. Export connections without secrets, or encrypted with a password you choose.",
      },
      {
        t: "Audit and app lock",
        d: "A local audit log of writes and security events with credentials redacted, and an app lock with idle timeout that closes every connection and tunnel.",
      },
      {
        t: "Typed-name confirmation",
        d: "Dropping a database or collection asks you to type its name. Restores, sync overwrites and masking write-back ask for confirmation.",
      },
    ],
    related: ["team-workspace", "atlas", "intellishell"],
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
    screen: {
      id: "explain-plan",
      alt: "A MotionQL explain plan shown as a tree with index use, documents examined and time",
      caption: "The winning plan as a tree, with index use, documents examined and time.",
    },
    capabilities: [
      { t: "Visual explain", d: "The winning plan as a tree with index use, documents examined and execution time." },
      { t: "Explain anywhere", d: "From the collection tab, IntelliShell or the aggregation editor." },
      { t: "Query profiler", d: "Set the profiling level and slow-operation threshold, review slow operations and clear profiling data." },
      { t: "Server monitoring", d: "Live server metrics for the connection." },
      { t: "Running operations", d: "List current operations and kill one (blocked on read-only connections)." },
      { t: "Topology", d: "Replica set members and roles, and the shards of a sharded cluster." },
      { t: "AI plan advice", d: "On connections that allow AI, get an explanation of the plan and index advice." },
    ],
    related: ["index-management", "visual-query-builder", "aggregation-pipeline-builder"],
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
    // USER_GUIDE "Import and export", "Copy, dump and restore"
    slug: "import-export",
    name: "Import, export, dump & restore",
    title: "Move data in and out in any format",
    metaTitle: "MongoDB import, export, dump and restore",
    summary:
      "JSON, JSON Lines, CSV, BSON, Excel and SQL INSERT in both directions, plus copy collection and mongodump-compatible dump and restore.",
    icon: PackageOpen,
    screen: {
      id: "export-dialog",
      alt: "The MotionQL export dialog with format options",
      caption: "Export a collection, a view, the current query or a selection.",
    },
    capabilities: [
      {
        t: "Six formats",
        d: "JSON, JSON Lines, CSV, BSON (mongodump-compatible), Excel .xlsx and SQL INSERT for generic SQL, MySQL or PostgreSQL.",
      },
      { t: "Export what you see", d: "A collection, a view, the current query or a selection." },
      {
        t: "Map and type columns",
        d: "The import wizard inspects the file, then lets you map columns to string, int, long, double, decimal, bool, date, objectId or json.",
      },
      { t: "Four import modes", d: "Insert, upsert, replace or merge." },
      { t: "Streamed jobs", d: "Large files stream in the background with progress and cancel." },
      { t: "Copy collections", d: "Copy a collection to another database or connection." },
      {
        t: "Dump and restore",
        d: "mongodump folder layout with optional gzip, or a single archive file that mongorestore --archive reads. Restores check archive checksums.",
      },
      { t: "Schedule it", d: "Exports, imports, copies, dumps and restores can all run as scheduled tasks (Pro)." },
    ],
    related: ["sql-migration", "compare-sync", "tasks-scheduling"],
  },
  {
    // USER_GUIDE "SQL Migration"; src/main/migration
    slug: "sql-migration",
    name: "SQL to MongoDB migration",
    title: "Migrate from SQL to MongoDB",
    metaTitle: "Migrate PostgreSQL, MySQL, SQL Server and Oracle to MongoDB",
    summary:
      "Import tables from PostgreSQL, MySQL, MariaDB, SQL Server and Oracle, choose whether each relationship is a reference or an embedded document, preview the result, and run it.",
    icon: Database,
    tier: "Pro",
    capabilities: [
      { t: "Five sources", d: "PostgreSQL, MySQL, MariaDB, SQL Server and Oracle, with TLS modes and an optional CA file." },
      { t: "Introspect and map", d: "Map each table to a collection: columns, filters and type conversions." },
      { t: "Reference or embed", d: "Choose for every many-to-one and one-to-many relationship." },
      { t: "Preview first", d: "See the resulting documents before you run the migration." },
      { t: "Progress per table", d: "Rows read, written and failed, with cancel. The source is read in a read-only session." },
      { t: "AI relationship suggestions", d: "Optional; only table and column names, types and keys are sent." },
      { t: "Saved sources", d: "Source connections are saved with encrypted passwords, and a plan can run as a scheduled task." },
      { t: "And back again", d: "Move MongoDB data to SQL with Export → SQL INSERT statements." },
    ],
    related: ["sql-query", "import-export", "data-masking-reschema"],
  },
  {
    // USER_GUIDE "Tasks and scheduling", "Automation and CLI"; src/main/tasks
    slug: "tasks-scheduling",
    name: "Tasks, scheduling & CLI",
    title: "Automate the jobs you repeat",
    metaTitle: "Scheduled MongoDB tasks and command line",
    summary:
      "Save exports, syncs, dumps, scripts and more as tasks, run them on a schedule even while MotionQL is closed, or start them from your own scripts with --cli.",
    icon: CalendarClock,
    tier: "Pro",
    snippet: {
      label: "Command line",
      code: `MotionQL --cli tasks list --json
MotionQL --cli tasks run "Nightly export" --wait
MotionQL --cli tasks export "Nightly export" > task.json
MotionQL --cli tasks import task.json`,
    },
    capabilities: [
      {
        t: "Thirteen task kinds",
        d: "Export, import, copy, compare, reschema, masking, SQL migration, dump, restore, script, schema snapshot, index review and continuous sync.",
      },
      { t: "Any schedule", d: "Once, every N minutes / hours / days, daily, weekly on chosen days, or a cron expression." },
      { t: "Missed runs", d: "Choose whether a run missed while the computer slept runs once on start or is skipped." },
      { t: "Run log", d: "Every run is recorded as success, partial, failed or skipped, with how it started." },
      {
        t: "Runs while the app is closed",
        d: "An optional background runner uses launchd on macOS and Task Scheduler on Windows, only while you are signed in.",
      },
      {
        t: "Command line",
        d: "List, run, export and import tasks from scripts, with exit codes for success, failure, usage errors and policy refusals.",
      },
      { t: "Checked every run", d: "Each run respects read-only connections, team and machine policy, and licensing." },
      { t: "Encrypted definitions", d: "Tasks are stored encrypted, and exports never contain passwords or connection strings." },
    ],
    related: ["import-export", "compare-sync", "intellishell"],
  },
  {
    // CHANGELOG 1.0.0 "Dashboards"; src/renderer/components/dashboard
    slug: "charts-dashboards",
    name: "Charts & dashboards",
    title: "Dashboards on live MongoDB data",
    metaTitle: "MongoDB charts and dashboards",
    summary:
      "Build charts, metrics, tables and notes on a drag-and-resize grid, backed by live aggregations with shared filters, and export them as PNG or PDF.",
    icon: BarChart3,
    capabilities: [
      {
        t: "Ten chart types",
        d: "Column, bar, stacked, line, area, pie, doughnut, scatter, radar and polar-area.",
      },
      { t: "Live aggregations", d: "Every widget runs an aggregation, with shared filters, auto refresh and maxTimeMS." },
      {
        t: "Chart editor",
        d: "A live preview with date grouping from hour to year, series, colour palettes, legends, axis titles, number formats and value labels.",
      },
      { t: "Drag-and-resize grid", d: "Charts, metrics, tables and notes, with one-click layouts." },
      { t: "Templates", d: "Built-in and saved dashboard templates." },
      { t: "Present mode", d: "Show a dashboard full screen." },
      { t: "Export", d: "PNG, multi-page PDF (A4 or Letter), per-widget PNG and CSV, and dashboard JSON." },
      { t: "Local", d: "Dashboards are stored on your computer." },
    ],
    related: ["aggregation-pipeline-builder", "ai-assistant-mcp", "schema-analysis-er-diagram"],
  },
  {
    // USER_GUIDE "AI assistant", "AI Assistant Chat", "MCP server"; src/main/ai, src/main/mcp
    slug: "ai-assistant-mcp",
    name: "AI assistant & MCP server",
    title: "An AI assistant that never sees your data unless you say so",
    metaTitle: "MongoDB AI assistant and MCP server",
    summary:
      "Bring your own Gemini, Claude or OpenAI-compatible key, or a local model. Ask in plain English, chat with your database, and let AI coding tools use your open connections through a local MCP server.",
    icon: Sparkles,
    snippet: {
      label: "MCP endpoint (this computer only)",
      code: "http://127.0.0.1:27118/mcp",
    },
    capabilities: [
      {
        t: "Your provider",
        d: "Google Gemini, Anthropic Claude, or any OpenAI-compatible endpoint, including local models such as Ollama.",
      },
      { t: "Plain English to queries", d: "Get a find, an aggregation pipeline or SQL from a description." },
      { t: "Ask Your Database", d: "Counts, lookups and summaries, answered by validated queries on your connection." },
      {
        t: "Assistant chat",
        d: "It looks things up with MotionQL's own tools and shows every step. Writes are proposals with a dry-run count, and nothing changes until you click Apply.",
      },
      {
        t: "MCP server for coding tools",
        d: "Off by default. Lets tools such as Claude Code, Cursor and VS Code Copilot use connections that allow AI, on 127.0.0.1 with a private token. Writes need a second switch and your approval.",
      },
      {
        t: "Explain, fix, advise",
        d: "Explain plans, fix errors, index advice, pipeline debugging, compare summaries and masking suggestions.",
      },
      {
        t: "Off until you allow it",
        d: "AI is off for every connection by default. Passwords, connection strings and keys are never sent.",
      },
      {
        t: "Values masked",
        d: "Query results reach the AI with values replaced by their types unless you allow literal values for that connection.",
      },
    ],
    related: ["connections-security", "index-management", "charts-dashboards"],
  },
  {
    // USER_GUIDE "GridFS"; src/renderer/components/gridfs/GridFsView.tsx
    slug: "gridfs",
    name: "GridFS",
    title: "Browse and manage GridFS files",
    metaTitle: "MongoDB GridFS browser",
    summary: "Browse GridFS buckets, search and sort files, and upload, download, rename or delete them.",
    icon: FileStack,
    capabilities: [
      { t: "Every bucket", d: "Pick any bucket in a database, not just fs." },
      { t: "Search and sort", d: "Find files by name and sort by upload date, name or size, page by page." },
      {
        t: "Upload",
        d: "Upload with an optional content type and metadata document. Bytes stream from disk without passing through the UI.",
      },
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
  {
    // USER_GUIDE "Team features"; src/shared/workspace.ts (workspace folder, free); docs/team-server
    slug: "team-workspace",
    name: "Team & workspace",
    title: "Share queries and connections, keep secrets private",
    metaTitle: "Shared MongoDB queries, workspace folders and Team Server",
    summary:
      "Keep queries, pipelines, scripts and connections as plain files in a workspace folder you can put in Git, or share them through a self-hosted Team Server with SSO and signed policies.",
    icon: Users,
    tier: "Enterprise",
    tierNote: "The workspace folder is free. Team Server features need an Enterprise license.",
    snippet: {
      label: "Workspace folder",
      code: `motionql-workspace.json
connections/<name>.json   # settings, never passwords or keys
queries/<name>.json
pipelines/<name>.json
scripts/<name>.js
snippets/<name>.js
sql/<name>.sql
tasks/<name>.json`,
    },
    capabilities: [
      {
        t: "Workspace folder",
        d: "One readable file per item, with filters and pipelines written as real JSON so Git diffs stay readable.",
      },
      { t: "No secrets in files", d: "Connections are saved without passwords, keys or local file paths." },
      { t: "Self-hosted Team Server", d: "OpenID Connect SSO (Okta, Entra ID, Google Workspace and others) and SCIM 2.0 provisioning." },
      {
        t: "Shared libraries",
        d: "Connections, queries, aggregations, shell and SQL scripts, snippets and tasks, with version history and restore.",
      },
      {
        t: "Your own credentials",
        d: "Using a shared connection creates a local copy; you enter your own password, which stays on your computer.",
      },
      { t: "Policy floors", d: "Signed policies can require read-only or turn AI off. Desktops enforce them even offline." },
      { t: "Central audit", d: "A hash-chained, signed audit log with SIEM forwarding over webhook or syslog." },
    ],
    related: ["connections-security", "tasks-scheduling", "ai-assistant-mcp"],
  },
  {
    // USER_GUIDE "Generate Test Data"; src/shared/datagen/{types,locales}.ts
    slug: "test-data-generator",
    name: "Test data generator",
    title: "Realistic test data in seconds",
    metaTitle: "MongoDB test data generator",
    summary:
      "Describe a document template, or start from a collection's live schema, preview the rows, and insert up to a million documents or export them as JSON or CSV.",
    icon: FlaskConical,
    capabilities: [
      { t: "Start from the schema", d: "Build the template from a collection's live schema, or write your own." },
      {
        t: "Many generators",
        d: "Names, emails, phones, addresses, companies, URLs, IPs, lorem text, numbers with uniform, normal or exponential distributions, dates, ObjectIds, UUIDs, patterns, enums with weights, sequences and geo points.",
      },
      { t: "Nested documents and arrays", d: "Objects, arrays and tuples to any depth." },
      { t: "References", d: "Sample real _id values from another collection to keep relationships intact." },
      { t: "Presence and nulls", d: "Control how often a field appears and how often it is null." },
      {
        t: "Repeatable",
        d: "The same seed, template and locale give the same documents. Locales: English (US), German, French and Spanish.",
      },
      {
        t: "Safe fake contacts",
        d: "Emails and URLs use reserved example domains, and US phone numbers use the range reserved for fiction.",
      },
      { t: "Insert or export", d: "Preview, then insert up to 1,000,000 documents in batches, or export JSON, JSON Lines or CSV." },
    ],
    related: ["data-masking-reschema", "schema-analysis-er-diagram", "import-export"],
  },
];

export const featureBySlug = (slug: string) => features.find((f) => f.slug === slug);

import type { Mark } from "@/lib/content";

/**
 * Head-to-head pages at /compare/<slug> for tools beyond Studio 3T and Compass (those two use the shared
 * comparison table in content.ts).
 *
 * Rules: every statement about another product comes from that vendor's own site, docs or official repository,
 * checked in October 2026 and listed in `sources` (shown on the page). A feature a vendor does not document is
 * left out rather than marked "no". MotionQL facts come from the desktop app's docs (USER_GUIDE, CHANGELOG 1.0.0,
 * INSTALLATION). Rows where the other tool is ahead stay in.
 */

export interface VendorRow {
  feature: string;
  motionql: Mark;
  them: Mark;
  note?: string;
}

export interface Vendor {
  name: string;
  /** Search title for the page; defaults to "MotionQL vs <name>". */
  metaTitle?: string;
  title: string;
  description: string;
  reasons: { t: string; d: string }[];
  rows: VendorRow[];
  /** A fair note on when the other tool may be the better choice. */
  fit: string;
  sources: { label: string; url: string }[];
}

/** Static fallback for MotionQL's platforms; the table swaps in the release-aware wording (PlatformsText). */
export const platformsMotionql = "macOS, Windows and Linux";

export const vendors: Record<string, Vendor> = {
  // Sources:
  // https://github.com/Studio3T/robomongo (README: "Robo 3T is no longer being developed by Studio 3T", final 1.4.4,
  //   embedded MongoDB 4.2 shell, SSH ECDSA/Ed25519 keys, Windows/macOS/Linux, GPL-3.0)
  // https://robomongo.org/ (Studio 3T Community Edition replaces Robo 3T; "for non-commercial, personal use only")
  "robo-3t": {
    name: "Robo 3T",
    metaTitle: "Robo 3T alternative: MotionQL vs Robo 3T",
    title: "Robo 3T is retired. Here's a modern home for your workflow.",
    description:
      "Robo 3T (formerly Robomongo) is no longer being developed. MotionQL keeps the shell-first workflow you liked, adds a visual query builder, aggregation editor and SQL, and is free for commercial work.",
    reasons: [
      {
        t: "Actively developed",
        d: "MotionQL is in active development (1.2.1 shipped in October 2026) and supports MongoDB 4.4 and later. Its installers are not yet code-signed, so the OS warns on first launch.",
      },
      {
        t: "A shell that feels familiar",
        d: "IntelliShell takes mongosh-style commands with autocomplete and history, and an optional Script mode runs real JavaScript in a sandbox.",
      },
      {
        t: "Free for commercial work",
        d: "Studio 3T's free Community Edition, which it recommends in place of Robo 3T, is for non-commercial use. MotionQL's core app is free for any use, and Pro is free for a year.",
      },
      {
        t: "Beyond the shell",
        d: "A visual query builder, an aggregation editor with stage preview, SQL queries, Compare & Sync, import/export and schema tools.",
      },
      {
        t: "Same connections",
        d: "Import your saved Robo 3T connections in one step, or paste your connection strings. SSH tunnels with jump hosts, TLS, X.509, LDAP, Kerberos, AWS IAM and OIDC are supported.",
      },
      {
        t: "Guardrails",
        d: "Per-connection read-only mode enforced by the app, a production banner and typed-name confirmation for drops.",
      },
    ],
    rows: [
      { feature: "Development status", motionql: "Active (1.2.1, October 2026)", them: "No longer developed; final release 1.4.4" },
      {
        feature: "Built-in shell",
        motionql: "IntelliShell (mongosh-style), optional JavaScript Script mode",
        them: "Embedded MongoDB 4.2 shell",
      },
      {
        feature: "SSH tunnels",
        motionql: "Password or key, up to four jump hosts",
        them: "yes",
        note: "Robo 3T 1.4 added ECDSA and Ed25519 key support.",
      },
      { feature: "Platforms", motionql: platformsMotionql, them: "Windows, macOS and Linux" },
      { feature: "Source code", motionql: "Proprietary", them: "Open source (GPL-3.0)" },
      { feature: "Price", motionql: "Free; Pro free for 12 months", them: "Free" },
    ],
    fit: "Robo 3T's source is still on GitHub under GPL-3.0, so it can make sense where you need to build or audit an open-source client yourself and only need its shell.",
    sources: [
      { label: "Studio3T/robomongo on GitHub", url: "https://github.com/Studio3T/robomongo" },
      { label: "robomongo.org", url: "https://robomongo.org/" },
    ],
  },

  // Sources:
  // https://nosqlbooster.com/compareEditions (Free / Personal / Commercial; Free is "free for personal/commercial use
  //   but with limited functions after the 30-day trial expires"; SQL, visual explain, test data generator in all
  //   editions; Personal cannot generate code in target languages or run tasks from the command line; AI needs
  //   active software assurance)
  // https://www.nosqlbooster.com/downloads (Windows, macOS, Linux)
  // https://nosqlbooster.com/blog/announcing-nosqlbooster-90/ (suggest index, in-use encryption connections)
  nosqlbooster: {
    name: "NoSQLBooster",
    title: "MotionQL vs NoSQLBooster",
    description:
      "Both are full MongoDB IDEs with a shell, SQL, explain and test data. MotionQL also includes Compare & Sync, SQL migration, masking and dashboards, and gives you every Pro feature free for a year.",
    reasons: [
      {
        t: "Pro free for a year",
        d: "Every registered user gets a Pro license for 12 months, including tasks, masking, SQL migration and Atlas management.",
      },
      {
        t: "Code generation in the free app",
        d: "Query Code for nine languages works without any license.",
      },
      {
        t: "AI with your own key",
        d: "Use Gemini, Claude, any OpenAI-compatible endpoint or a local model. No subscription to a hosted AI service.",
      },
      {
        t: "Move and protect data",
        d: "Data Compare & Sync, SQL to MongoDB migration from five databases, and eleven masking methods.",
      },
      {
        t: "Visual tools",
        d: "A visual query builder, ER diagrams of your database, and dashboards with ten chart types.",
      },
      {
        t: "Safe by default",
        d: "Shell commands are parsed as literals; JavaScript runs only in an opt-in sandbox. Read-only connections are enforced by the app.",
      },
    ],
    rows: [
      { feature: "SQL queries against MongoDB", motionql: "yes", them: "yes" },
      { feature: "Visual explain", motionql: "yes", them: "yes" },
      { feature: "Index suggestions", motionql: "yes", them: "yes" },
      { feature: "Test data generator", motionql: "yes", them: "yes" },
      { feature: "Import and export", motionql: "yes", them: "yes" },
      { feature: "In-use encryption (Queryable Encryption)", motionql: "yes", them: "yes" },
      {
        feature: "Code generation for other languages",
        motionql: "Free",
        them: "Commercial license",
        note: "NoSQLBooster's Personal license does not include it.",
      },
      {
        feature: "Run tasks from the command line",
        motionql: "Pro (free for 12 months)",
        them: "Commercial license",
        note: "NoSQLBooster's Personal license does not include it.",
      },
      { feature: "AI features", motionql: "Your own key or a local model", them: "Needs active software assurance" },
      {
        feature: "Free edition allowed for commercial work",
        motionql: "yes",
        them: "yes",
        note: "NoSQLBooster Free has limited functions after its 30-day trial.",
      },
      { feature: "Platforms", motionql: platformsMotionql, them: "Windows, macOS and Linux" },
    ],
    fit: "NoSQLBooster has a long track record as a JavaScript-centric MongoDB IDE on Windows, macOS and Linux. If you live in its shell and already own a license, it remains a solid choice.",
    sources: [
      { label: "NoSQLBooster: compare editions", url: "https://nosqlbooster.com/compareEditions" },
      { label: "NoSQLBooster downloads", url: "https://www.nosqlbooster.com/downloads" },
      { label: "NoSQLBooster 9.0 release notes", url: "https://nosqlbooster.com/blog/announcing-nosqlbooster-90/" },
    ],
  },

  // Sources:
  // https://www.navicat.com/en/products/navicat-for-mongodb-feature-matrix (Standard / Enterprise; aggregate builder,
  //   import/export, structure and data synchronization, data generation, data masking, SSH and SSL/TLS, MongoDB Atlas
  //   in both; data modeling, BI charts ("over 20 chart type options") and scheduling in Enterprise)
  // https://www.navicat.com/en/products/navicat-for-mongodb (Windows, macOS, Linux; subscription or perpetual license)
  navicat: {
    name: "Navicat for MongoDB",
    title: "MotionQL vs Navicat for MongoDB",
    description:
      "Navicat is a polished, multi-edition database suite. MotionQL focuses on MongoDB alone, and its Pro features, including scheduling and SQL migration, are free for a year.",
    reasons: [
      {
        t: "No edition maze",
        d: "ER diagrams, dashboards and Compare & Sync are in the free app. Scheduling, masking, SQL migration and Atlas management are in Pro, free for 12 months.",
      },
      {
        t: "Built for MongoDB",
        d: "IntelliShell for mongosh-style commands, an aggregation editor with stage preview, SQL queries translated to MongoDB, and Index Review.",
      },
      {
        t: "SQL to MongoDB migration",
        d: "Import from PostgreSQL, MySQL, MariaDB, SQL Server and Oracle, choosing reference or embed for each relationship.",
      },
      {
        t: "AI on your terms",
        d: "Bring your own Gemini, Claude or OpenAI-compatible key, or run a local model. Off for every connection until you allow it.",
      },
      {
        t: "Offline licensing",
        d: "License keys are verified offline with a digital signature, so locked-down networks just work.",
      },
      {
        t: "Self-hosted Team Server",
        d: "SSO, SCIM, shared queries and connections without secrets, signed policies and a hash-chained audit log.",
      },
    ],
    rows: [
      { feature: "Aggregation pipeline builder", motionql: "yes", them: "yes" },
      { feature: "Import and export", motionql: "yes", them: "yes" },
      { feature: "Data synchronization", motionql: "yes", them: "yes" },
      { feature: "Data generation", motionql: "yes", them: "yes" },
      { feature: "Data masking", motionql: "Pro (free for 12 months)", them: "yes" },
      { feature: "SSH and SSL/TLS", motionql: "yes", them: "yes" },
      { feature: "Connect to MongoDB Atlas", motionql: "yes", them: "yes" },
      { feature: "Data modeling / ER diagrams", motionql: "Free", them: "Enterprise edition" },
      { feature: "Charts and dashboards", motionql: "Free, 10 chart types", them: "Enterprise edition, 20+ chart types" },
      { feature: "Scheduled jobs", motionql: "Pro (free for 12 months)", them: "Enterprise edition" },
      { feature: "Platforms", motionql: platformsMotionql, them: "Windows, macOS and Linux" },
      { feature: "Licensing", motionql: "Free; Pro free for 12 months", them: "Subscription or perpetual license" },
    ],
    fit: "Navicat offers conceptual, logical and physical data modeling, more chart types in its BI module, and a family of tools for many databases. If your team standardizes on Navicat across SQL and NoSQL, that consistency is worth a lot.",
    sources: [
      { label: "Navicat for MongoDB feature matrix", url: "https://www.navicat.com/en/products/navicat-for-mongodb-feature-matrix" },
      { label: "Navicat for MongoDB", url: "https://www.navicat.com/en/products/navicat-for-mongodb" },
    ],
  },

  // Sources:
  // https://dbeaver.com/docs/dbeaver/MongoDB/ ("This driver is available in Lite, Enterprise, and Ultimate editions
  //   only"; JavaScript statements in the SQL editor; SQL SELECT/INSERT/UPDATE/DELETE; table or JSON views; import
  //   and export; databases, collections, users, administration, active operations)
  // https://dbeaver.io/download/ (Community on Windows, macOS, Linux; MongoDB listed for PRO)
  dbeaver: {
    name: "DBeaver",
    title: "MotionQL vs DBeaver",
    description:
      "DBeaver and MotionQL are both multi-database tools. DBeaver's free Community edition covers SQL databases and its MongoDB driver is in the paid editions. MotionQL connects to 60+ databases, MongoDB included, in the free app, with Pro free for a year.",
    reasons: [
      {
        t: "SQL and NoSQL in the free app",
        d: "PostgreSQL, MySQL, SQL Server, Oracle and SQLite sit next to MongoDB, Redis, Elasticsearch, DynamoDB, Cassandra and Neo4j without a paid edition.",
      },
      {
        t: "Each database keeps its own tools",
        d: "pg_stat_statements and EXPLAIN for PostgreSQL, a key browser for Redis, Discover for Elasticsearch, Cypher graphs for Neo4j, aggregation for MongoDB.",
      },
      {
        t: "Projects and environments",
        d: "Group connections into Development, Staging and Production. Production asks before every write, and read-only connections stay read-only.",
      },
      {
        t: "Logs & analytics for every server",
        d: "The server's own log, slow operations grouped by shape and live metrics, in one view for every family.",
      },
      {
        t: "Migration between databases",
        d: "Move tables and collections between engines, with type mapping and a dry run first.",
      },
      {
        t: "AI with your own key",
        d: "Write and fix SQL, MQL, Cypher and more with Gemini, Claude, an OpenAI-compatible endpoint or a local model.",
      },
    ],
    rows: [
      {
        feature: "MongoDB in the free edition",
        motionql: "yes",
        them: "no",
        note: "DBeaver's MongoDB driver is in the Lite, Enterprise and Ultimate editions only.",
      },
      { feature: "Relational databases in the free edition", motionql: "yes", them: "yes" },
      { feature: "SQL against MongoDB", motionql: "SELECT (read-only)", them: "SELECT, INSERT, UPDATE and DELETE" },
      { feature: "JavaScript / shell queries for MongoDB", motionql: "yes", them: "yes" },
      { feature: "Import and export", motionql: "yes", them: "yes" },
      { feature: "Platforms", motionql: platformsMotionql, them: "Windows, macOS and Linux" },
    ],
    fit: "DBeaver has been around for years, supports a very long list of JDBC drivers, and lets SQL write to MongoDB where MotionQL's SQL is read-only. If you rely on an unusual JDBC database or DBeaver's plugin ecosystem, it remains a strong choice; MotionQL also connects any JDBC driver, with fewer engine-specific tools for those.",
    sources: [
      { label: "DBeaver docs: MongoDB", url: "https://dbeaver.com/docs/dbeaver/MongoDB/" },
      { label: "DBeaver download", url: "https://dbeaver.io/download/" },
    ],
  },

  // Sources:
  // https://www.jetbrains.com/datagrip/ (product page lists PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, Redis,
  //   Apache Cassandra, ClickHouse "... and more"; Windows, macOS, Linux)
  // https://www.jetbrains.com/datagrip/features/mongodb (SQL translated for MongoDB supports SELECT only; most mongo
  //   shell commands available)
  // https://blog.jetbrains.com/datagrip/2025/10/01/datagrip-is-now-free-for-non-commercial-use/ (free for
  //   non-commercial use; commercial licensing unchanged)
  datagrip: {
    name: "DataGrip",
    title: "MotionQL vs DataGrip",
    description:
      "DataGrip is JetBrains' multi-database IDE, free for non-commercial use and paid for commercial work. MotionQL connects to 60+ databases and is free for commercial use, with Pro free for a year.",
    reasons: [
      {
        t: "Free at work, too",
        d: "The core app is free for any use, including commercial work. Pro is free for your first 12 months.",
      },
      {
        t: "Database-specific tools, not only SQL",
        d: "A Redis key browser, Elasticsearch Discover, DynamoDB scan and query, Cypher graphs, InfluxDB charts and MongoDB aggregation sit next to the SQL editor.",
      },
      {
        t: "Server insights built in",
        d: "pg_stat_statements, MySQL digests, ClickHouse query log and merges, slow operations by shape and the server's own log.",
      },
      {
        t: "Projects and environments",
        d: "Development, Staging and Production per project, with production asking before every write.",
      },
      {
        t: "Migration and data tools",
        d: "Copy tables and collections between engines, compare data, generate test data and mask sensitive columns.",
      },
      {
        t: "AI with your own key",
        d: "Use your own Gemini, Claude, OpenAI-compatible or local model. Nothing is sent unless you allow it per connection.",
      },
    ],
    rows: [
      { feature: "PostgreSQL, MySQL, SQL Server and Oracle", motionql: "yes", them: "yes" },
      { feature: "MongoDB, Redis, Cassandra and ClickHouse", motionql: "yes", them: "yes" },
      { feature: "SQL against MongoDB", motionql: "SELECT (read-only)", them: "SELECT only" },
      {
        feature: "Free for commercial use",
        motionql: "yes",
        them: "no",
        note: "DataGrip is free for non-commercial use since October 2025; commercial use needs a paid license.",
      },
      { feature: "Platforms", motionql: platformsMotionql, them: "Windows, macOS and Linux" },
    ],
    fit: "DataGrip has some of the deepest SQL editing around: refactoring, code inspections and navigation shared with the other JetBrains IDEs. If most of your day is writing SQL inside the JetBrains ecosystem, it is an excellent tool.",
    sources: [
      { label: "DataGrip product page", url: "https://www.jetbrains.com/datagrip/" },
      { label: "DataGrip features: MongoDB", url: "https://www.jetbrains.com/datagrip/features/mongodb" },
      {
        label: "JetBrains blog: DataGrip is free for non-commercial use",
        url: "https://blog.jetbrains.com/datagrip/2025/10/01/datagrip-is-now-free-for-non-commercial-use/",
      },
    ],
  },

  // Sources:
  // https://docs.tableplus.com/ (supported databases list shows "MongoDB (Beta)"; macOS, Windows, Linux and iOS apps)
  // https://tableplus.com/pricing (free trial "limited to 2 opened tabs, 2 opened windows, 2 advanced filters";
  //   perpetual license, Basic $99 for 1 device)
  // https://tableplus.com/blog/2019/08/tableplus-native-gui-client-mongodb.html (credentials in Keychain, built-in SSH)
  tableplus: {
    name: "TablePlus",
    title: "MotionQL vs TablePlus",
    description:
      "TablePlus is a fast, native client for SQL databases and Redis, with MongoDB in beta. MotionQL connects to 60+ databases with tools made for each one, and the core app is free.",
    reasons: [
      {
        t: "Deep tools for each database",
        d: "EXPLAIN plans and pg_stat_statements for PostgreSQL, MySQL digests, ClickHouse merges, Elasticsearch Discover, and a full MongoDB IDE with aggregation and IntelliShell.",
      },
      {
        t: "Free with no tab limits",
        d: "The core app is free for any use with no limits on tabs or windows, and Pro is free for 12 months.",
      },
      {
        t: "Documents, not just rows",
        d: "Tree, table and JSON views with nested documents and every BSON type, plus document history with revert.",
      },
      {
        t: "Move data between databases",
        d: "Migration between engines, data compare and sync, and import and export to CSV, JSON, Excel and SQL.",
      },
      {
        t: "Projects and environments",
        d: "Development, Staging and Production per project, with production asking before every write.",
      },
      {
        t: "AI with your own key",
        d: "Write and fix SQL, MQL and more with your own provider or a local model.",
      },
    ],
    rows: [
      { feature: "MongoDB support status", motionql: "Generally available", them: "Beta" },
      { feature: "Credentials kept in the OS keychain", motionql: "yes", them: "yes" },
      { feature: "SSH tunnels", motionql: "yes", them: "yes" },
      {
        feature: "Free tier",
        motionql: "Free for any use; Pro free for 12 months",
        them: "Free trial: 2 tabs, 2 windows, 2 advanced filters at a time",
      },
      { feature: "Paid license", motionql: "None needed today", them: "Perpetual license, from $99 per device" },
      { feature: "Relational databases and Redis", motionql: "yes", them: "yes" },
      { feature: "Platforms", motionql: platformsMotionql, them: "macOS, Windows, Linux and iOS" },
    ],
    fit: "TablePlus is a lovely, lightweight native client with a perpetual license and an iOS app. If you want a minimal table editor for SQL databases and Redis and prefer to pay once, it is a great fit.",
    sources: [
      { label: "TablePlus docs", url: "https://docs.tableplus.com/" },
      { label: "TablePlus pricing", url: "https://tableplus.com/pricing" },
      {
        label: "TablePlus blog: MongoDB client for macOS",
        url: "https://tableplus.com/blog/2019/08/tableplus-native-gui-client-mongodb.html",
      },
    ],
  },

  // Sources:
  // https://visualeaf.com/ (visual query builder, aggregation pipeline, visual schema, schema validation, MongoDB shell,
  //   SQL mode, task manager for import/export, AI assistant, collection compare, GridFS, index manager, query
  //   profiler, RBAC dashboard, charts/dashboards; "macOS on both Intel and Apple Silicon, Windows, and Linux as .deb
  //   or .rpm"; "Your data never leaves your machine")
  // https://visualeaf.com/download (free Community Edition, "14 day free professional trial included"; Linux .deb
  //   for ARM64 and .rpm for x64)
  // https://github.com/sozocode/VisuaLeaf (vendor README: Community "Core features, single connection"; preview data
  //   at every stage of the aggregation designer)
  visualeaf: {
    name: "VisuaLeaf",
    metaTitle: "VisuaLeaf alternative: MotionQL vs VisuaLeaf",
    title: "MotionQL vs VisuaLeaf",
    description:
      "VisuaLeaf and MotionQL are both visual MongoDB GUIs with query builders, aggregation, SQL and AI. MotionQL also includes SQL migration, masking, Atlas management, scheduled tasks with a CLI and a self-hosted Team Server, with Pro free for a year.",
    reasons: [
      {
        t: "Pro free for a year",
        d: "Every registered user gets Pro for 12 months, with unlimited connections in the free app too.",
      },
      {
        t: "SQL to MongoDB migration",
        d: "Import from PostgreSQL, MySQL, MariaDB, SQL Server and Oracle, choosing reference or embed for each relationship.",
      },
      {
        t: "Data masking",
        d: "Eleven masking methods with a preview, written to a new collection or back to the source.",
      },
      {
        t: "Automation and CLI",
        d: "Thirteen task kinds on any schedule, a background runner while the app is closed, and a --cli for your own scripts.",
      },
      {
        t: "AI tools and MCP",
        d: "Your own Gemini, Claude, OpenAI-compatible or local model, an assistant chat whose writes are proposals, and a local MCP server for coding tools.",
      },
      {
        t: "Team Server and policies",
        d: "Self-hosted SSO and SCIM, shared libraries, signed policy floors and a hash-chained audit log.",
      },
    ],
    rows: [
      { feature: "Visual query builder", motionql: "yes", them: "yes" },
      { feature: "Aggregation builder with stage preview", motionql: "yes", them: "yes" },
      { feature: "MongoDB shell", motionql: "yes", them: "yes" },
      { feature: "SQL queries", motionql: "yes", them: "yes" },
      { feature: "AI assistant", motionql: "yes", them: "yes" },
      { feature: "Collection compare", motionql: "yes", them: "yes" },
      { feature: "Schema visualization and validation", motionql: "yes", them: "yes" },
      { feature: "Index manager and query profiler", motionql: "yes", them: "yes" },
      { feature: "GridFS", motionql: "yes", them: "yes" },
      { feature: "Charts and dashboards", motionql: "yes", them: "yes" },
      { feature: "Data stays on your machine", motionql: "yes", them: "yes" },
      {
        feature: "Free edition",
        motionql: "Free; Pro free for 12 months",
        them: "Community Edition; 14-day Pro trial",
        note: "VisuaLeaf's README lists Community as core features with a single connection.",
      },
      { feature: "Platforms", motionql: platformsMotionql, them: "macOS, Windows and Linux (.deb, .rpm)" },
    ],
    fit: "VisuaLeaf is a capable visual MongoDB GUI with a free Community Edition, and it ships Linux packages as .rpm for x64 and .deb for ARM64. If you need one of those, or prefer its interface, it is a good option.",
    sources: [
      { label: "visualeaf.com", url: "https://visualeaf.com/" },
      { label: "VisuaLeaf download", url: "https://visualeaf.com/download" },
      { label: "sozocode/VisuaLeaf on GitHub", url: "https://github.com/sozocode/VisuaLeaf" },
    ],
  },
};

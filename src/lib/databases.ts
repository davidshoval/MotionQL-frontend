/**
 * The databases MotionQL connects to, one page per family at /databases/[slug].
 *
 * Every statement comes from the desktop app's own docs (repo xquery.io-platform): docs/ENGINES.md (generated from
 * src/shared/engines/registry.ts), docs/USER_GUIDE.md and the CHANGELOG's Unreleased section. "Depth" is the app's
 * own rating: Deep is best-in-class, Good a complete everyday client. Where the app says a flavor was tested against
 * mocks only, the page says so too.
 */

export type Depth = "Deep" | "Good";

/** Screens in public/screens (dark-<id>.webp and light-<id>.webp). */
export type DatabaseScreenId =
  | "connection-picker"
  | "all-connections"
  | "pg-editor"
  | "pg-table"
  | "pg-explain"
  | "pg-performance"
  | "sql-query-builder"
  | "er-diagram"
  | "mysql-performance"
  | "mssql-editor"
  | "clickhouse-operations"
  | "redis-keys"
  | "es-discover"
  | "neo4j-graph"
  | "dynamodb-scan"
  | "cassandra-rows"
  | "influx-console"
  | "collection-tree"
  | "logs-analytics";

export interface DatabaseFamily {
  slug: string;
  /** Family name for cards and links. */
  name: string;
  /** The databases and services in the family, the main engine first. */
  flavors: { name: string; depth: Depth; note?: string }[];
  /** Page H1. */
  title: string;
  /** Meta title for search. */
  metaTitle: string;
  /** One or two sentences under the H1; also the meta description. */
  summary: string;
  /** What you write in this family's console. */
  language: string;
  /** Group on the /databases page. */
  group: "Relational" | "Document and key-value" | "Analytics and warehouses" | "Search, time series and graph";
  highlights: { t: string; d: string }[];
  screen?: { id: DatabaseScreenId; alt: string; caption: string };
  /** Honest caveats, shown under the highlights. */
  notes?: string[];
  /** Related feature pages (/features/[slug]). */
  features?: string[];
}

export const databases: DatabaseFamily[] = [
  {
    slug: "mongodb",
    name: "MongoDB",
    group: "Document and key-value",
    language: "MongoDB queries, aggregation pipelines, mongosh and SQL",
    flavors: [
      { name: "MongoDB", depth: "Deep" },
      { name: "MongoDB Atlas", depth: "Deep" },
      { name: "Amazon DocumentDB (and elastic clusters)", depth: "Good" },
      { name: "Azure Cosmos DB for MongoDB (RU)", depth: "Good" },
      { name: "Azure DocumentDB", depth: "Good" },
      { name: "FerretDB", depth: "Good" },
    ],
    title: "The MongoDB GUI that grew up with your stack",
    metaTitle: "MongoDB GUI for Atlas, DocumentDB, Cosmos DB and FerretDB",
    summary:
      "Everything Compass and Studio 3T do, from the visual query builder to Compare & Sync, with the real mongosh shell and an AI assistant that never sees your documents.",
    highlights: [
      {
        t: "Query any way you like",
        d: "Tree, table and JSON views; a visual query builder with AND/OR groups; an aggregation editor with stage-by-stage preview; SQL that turns into MongoDB queries; and code in nine languages.",
      },
      {
        t: "The real mongosh",
        d: "IntelliShell runs the mongosh shell API in its own process per tab: load(), rs.*, sh.*, sessions and transactions, mongosh's own completion, and Ctrl+C to interrupt.",
      },
      {
        t: "Every topology and sign-in",
        d: "mongodb+srv, replica sets, sharded clusters and load balancers; SCRAM, X.509, LDAP, Kerberos, AWS IAM and OIDC; TLS, SSH tunnels with jump hosts and proxies.",
      },
      {
        t: "Compatible clouds, handled",
        d: "Cosmos DB, DocumentDB and FerretDB are recognised on connect, get the driver options they need, and warn about operators the service doesn't support. Cosmos DB shows the request units each query costs.",
      },
      {
        t: "Move and fix data",
        d: "Import and export JSON, CSV, Excel, BSON and SQL INSERT; dump and restore; Data Compare & Sync; schema analysis, masking and reschema; GridFS, users and roles.",
      },
      {
        t: "Find what's slow",
        d: "Visual explain plans, the query profiler, Index Review, server monitoring, and Logs & analytics that read getLog, system.profile and $currentOp.",
      },
    ],
    screen: {
      id: "collection-tree",
      alt: "A MongoDB orders collection in MotionQL's tree view with the query bar above it",
      caption: "A collection in the tree view, with filter, sort and projection in the query bar.",
    },
    features: ["visual-query-builder", "aggregation-pipeline-builder", "intellishell", "sql-query", "compare-sync", "atlas"],
  },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    group: "Relational",
    language: "PostgreSQL SQL and PL/pgSQL",
    flavors: [
      { name: "PostgreSQL 13 to 18", depth: "Deep" },
      { name: "Supabase", depth: "Good" },
      { name: "Neon", depth: "Good" },
      { name: "TimescaleDB", depth: "Good" },
      { name: "Citus", depth: "Good" },
      { name: "Amazon RDS and Aurora PostgreSQL", depth: "Good" },
      { name: "Azure Database for PostgreSQL", depth: "Good" },
      { name: "Amazon Redshift", depth: "Good" },
      { name: "CockroachDB", depth: "Good" },
      { name: "YugabyteDB", depth: "Good" },
      { name: "QuestDB", depth: "Good" },
      { name: "Materialize", depth: "Good" },
      { name: "RisingWave", depth: "Good" },
      { name: "CrateDB", depth: "Good" },
    ],
    title: "A PostgreSQL client that reads the server like a DBA",
    metaTitle: "PostgreSQL GUI client with visual explain, debugger and Supabase and Neon support",
    summary:
      "A full PostgreSQL IDE: the server's own catalog in the tree, visual Explain Analyze, pg_stat_statements, a PL/pgSQL debugger, row-level security and roles, plus first-class Supabase, Neon, TimescaleDB, Citus and thirteen other Postgres-protocol servers.",
    highlights: [
      {
        t: "The whole catalog",
        d: "Tables, partitions, views, materialized and foreign tables, sequences, functions, procedures, types, domains, triggers and policies, each with Properties, DDL from the server's own deparsers and Dependencies both ways.",
      },
      {
        t: "Explain you can read",
        d: "A visual plan tree with hot spots, row misestimates over 10x, big sequential scans and disk spills. Explain Analyze is always rolled back and refuses writes on read-only connections.",
      },
      {
        t: "Performance tab",
        d: "Top statements from pg_stat_statements, live activity with the blocking tree and audited cancel or terminate, vacuum health and wraparound age, partitions, extensions, replication slots and a LISTEN/NOTIFY console.",
      },
      {
        t: "Debug PL/pgSQL (Pro)",
        d: "Breakpoints in the gutter, step into, over and continue, a call stack and variables you can edit, through pldebugger. Changes are rolled back by default.",
      },
      {
        t: "Security as code",
        d: "A role editor with grants and default privileges, a row-level security policy editor with a DDL preview, and Run as a role (with JWT claims) inside a transaction that rolls back.",
      },
      {
        t: "Hosted Postgres, natively",
        d: "Supabase Run as anon or a real user and branch diffs; Neon branches from the API; IAM sign-in for RDS and Aurora; Entra ID for Azure; pg_dump backups; and paste a DATABASE_URL to fill the form.",
      },
    ],
    screen: {
      id: "pg-explain",
      alt: "A PostgreSQL query plan in MotionQL's visual explain view with the slowest node highlighted",
      caption: "Visual Explain Analyze on PostgreSQL, with the hot spot and row estimates flagged.",
    },
    notes: [
      "CockroachDB, YugabyteDB and Redshift show their own Performance panels and only the PostgreSQL ones they support.",
      "QuestDB, Materialize, RisingWave and CrateDB read their own catalogs; PostgreSQL-only tools say they are not available instead of failing.",
    ],
    features: ["sql-databases", "logs-analytics", "er-diagram-design", "projects-environments"],
  },
  {
    slug: "mysql",
    name: "MySQL and MariaDB",
    group: "Relational",
    language: "MySQL and MariaDB SQL",
    flavors: [
      { name: "MySQL 8.0, 8.4 and 9.x", depth: "Deep" },
      { name: "MariaDB", depth: "Deep" },
      { name: "Percona Server for MySQL", depth: "Good" },
      { name: "TiDB", depth: "Good" },
      { name: "Amazon RDS and Aurora MySQL", depth: "Good" },
      { name: "Amazon RDS for MariaDB", depth: "Good" },
    ],
    title: "MySQL and MariaDB, down to the deadlock graph",
    metaTitle: "MySQL and MariaDB GUI client with performance schema and deadlock graph",
    summary:
      "A MySQL workbench that shows what the server is doing: the Performance Schema digest workbench, InnoDB locks with a deadlock graph, unused indexes, users and privileges, and mysqldump backups.",
    highlights: [
      {
        t: "Recognised on connect",
        d: "MySQL, MariaDB, Percona, TiDB, RDS and Aurora are detected from the server, and RDS and Aurora can sign in with AWS IAM.",
      },
      {
        t: "Performance tab",
        d: "Statement digests, waits and table IO, unused and redundant indexes, the processlist with a blocking tree and audited KILL, InnoDB locks with a deadlock graph and replication status.",
      },
      {
        t: "Visual Explain and Explain Analyze",
        d: "Plans as a tree, with Explain Analyze rolled back in a separate session so it never changes your data.",
      },
      {
        t: "Users and privileges",
        d: "Create users and roles, set passwords, expiry and resource limits, and grant down to the column, with a DDL preview that masks passwords.",
      },
      {
        t: "Objects and definitions",
        d: "Procedures, functions, triggers, events and MariaDB sequences in the tree with Show DDL, and MariaDB time travel with As of.",
      },
      {
        t: "Backups and test data",
        d: "mysqldump backups and restores with a live log, schedulable as a task, plus a test data generator that fills foreign keys from parent rows.",
      },
    ],
    screen: {
      id: "mysql-performance",
      alt: "MotionQL's MySQL Performance tab listing statement digests by total time",
      caption: "The MySQL Performance tab: statement digests, waits, locks and replication in one place.",
    },
    features: ["sql-databases", "logs-analytics", "sql-data-tools"],
  },
  {
    slug: "sql-server",
    name: "SQL Server",
    group: "Relational",
    language: "T-SQL",
    flavors: [
      { name: "Microsoft SQL Server", depth: "Deep" },
      { name: "Azure SQL Database and Managed Instance", depth: "Good" },
    ],
    title: "SQL Server and Azure SQL on Mac, Windows and Linux",
    metaTitle: "SQL Server GUI for Mac and Linux: a cross-platform SSMS alternative",
    summary:
      "A cross-platform SQL Server client with Query Store, logins and permissions, backup and restore, SQL Agent jobs and Azure SQL resource use, for people who don't want to run SSMS in a VM.",
    highlights: [
      {
        t: "Logins, users and permissions",
        d: "Logins, users, server and database roles, membership, and GRANT, DENY and REVOKE down to columns, with a DDL preview and typed confirmation for drops.",
      },
      {
        t: "Backup and restore",
        d: "Full, differential and log backups with compression, checksum and verify; restores with MOVE, REPLACE and NORECOVERY or STANDBY, and progress from the server.",
      },
      {
        t: "Query Store and plans",
        d: "Top and regressed queries, wait statistics and plans from Query Store, each with Ask AI about this plan.",
      },
      {
        t: "SQL Server Agent",
        d: "Jobs and their schedules, with AI that reviews the schedules and explains each one.",
      },
      {
        t: "Azure SQL",
        d: "Resource use against the DTU or vCore objective, and automatic tuning recommendations with a confirmed switch for each option.",
      },
      {
        t: "Object properties",
        d: "Columns, indexes, constraints, triggers, permissions, extended properties and dependencies for every object.",
      },
    ],
    screen: {
      id: "mssql-editor",
      alt: "A T-SQL query and its results in MotionQL connected to SQL Server",
      caption: "T-SQL with completion and results on SQL Server.",
    },
    features: ["sql-databases", "logs-analytics"],
  },
  {
    slug: "oracle",
    name: "Oracle",
    group: "Relational",
    language: "Oracle SQL and PL/SQL",
    flavors: [
      { name: "Oracle Database (including 23ai)", depth: "Good" },
      { name: "Oracle Autonomous Database", depth: "Good" },
    ],
    title: "Oracle and PL/SQL without the Java IDE",
    metaTitle: "Oracle database GUI with PL/SQL editing and Autonomous Database support",
    summary:
      "PL/SQL packages and procedures with compile errors in the editor, DBMS_OUTPUT, sessions, top SQL and Data Pump, plus Autonomous Database wallets and service levels.",
    highlights: [
      {
        t: "PL/SQL objects",
        d: "Packages, procedures, functions, triggers, types, sequences, synonyms, materialized views and 23ai JSON duality views, with source editing and compile errors marked in the editor.",
      },
      {
        t: "Run it like a DBA",
        d: "DBMS_OUTPUT capture, bind variable prompts, DBMS_METADATA DDL previews and object wizards. VECTOR and JSON columns display readably.",
      },
      {
        t: "Performance",
        d: "Sessions with audited cancel and kill, top SQL, cursor plans and DBMS_SCHEDULER jobs. SQL Monitor and ASH show only for connections you mark as licensed for the Diagnostics and Tuning Packs.",
      },
      {
        t: "Users and storage",
        d: "Users, roles, system and object privileges, profiles and quotas; tablespaces and datafiles; Data Pump export and import with progress and log.",
      },
      {
        t: "Autonomous Database",
        d: "Import the wallet zip, pick a service level, paste a connect string from the OCI console, and see what ADB doesn't allow before you try it.",
      },
    ],
    features: ["sql-databases", "logs-analytics"],
  },
  {
    slug: "sqlite-duckdb",
    name: "SQLite and DuckDB",
    group: "Relational",
    language: "SQLite and DuckDB SQL",
    flavors: [
      { name: "SQLite", depth: "Good" },
      { name: "DuckDB", depth: "Good" },
    ],
    title: "Open a SQLite or DuckDB file and start querying",
    metaTitle: "SQLite and DuckDB GUI: browse, query and chart local database files",
    summary:
      "Local database files with no server to run: a visual query plan, triggers and indexes, notebooks that query earlier results by name, and the demo database to try MotionQL in seconds.",
    highlights: [
      {
        t: "No server needed",
        d: "Open a .sqlite or .duckdb file and browse tables, views, indexes, triggers, sequences and macros.",
      },
      {
        t: "Visual plans",
        d: "EXPLAIN QUERY PLAN for SQLite and EXPLAIN / EXPLAIN ANALYZE for DuckDB, in the same plan view as the server engines.",
      },
      {
        t: "Notebooks that chain",
        d: "On SQLite and DuckDB a notebook cell can query an earlier cell's result by name, so analysis builds step by step.",
      },
      {
        t: "Try it in one click",
        d: "Try the demo database creates a sample online shop as a local SQLite file and opens it in a SQL editor with a first query.",
      },
    ],
    features: ["notebooks", "sql-databases"],
  },
  {
    slug: "redis",
    name: "Redis and Valkey",
    group: "Document and key-value",
    language: "Redis commands and Lua",
    flavors: [
      { name: "Redis", depth: "Good" },
      { name: "Valkey", depth: "Good" },
      { name: "Dragonfly, KeyDB, ElastiCache, MemoryDB, Azure Cache for Redis, Upstash and Redis Cloud", depth: "Good" },
    ],
    title: "A Redis GUI that stays fast with millions of keys",
    metaTitle: "Redis and Valkey GUI client: key browser, console, slow log and RDB analysis",
    summary:
      "A SCAN-based key browser with a namespace tree, editors for every type, a console with AI completion, streams, pub/sub, slow log and latency, and offline RDB analysis for multi-gigabyte dumps.",
    highlights: [
      {
        t: "Key browser",
        d: "Built on SCAN with a namespace tree and type and pattern filters, and editors for strings (text, JSON, hex), hashes with field TTLs, lists, sets, sorted sets, streams, JSON and time series.",
      },
      {
        t: "Console with ghost text",
        d: "Completion for every command, and AI inline suggestions that only offer known, safe commands. Production mode asks you to type the command before FLUSHALL.",
      },
      {
        t: "Operate it",
        d: "Panels for streams and consumer groups, pub/sub, memory and big keys, slow log and latency history, clients, cluster slots, ACL users with ACL DRYRUN, and search indexes.",
      },
      {
        t: "Lua and Functions",
        d: "A script editor with KEYS and ARGV, EVAL and EVAL_RO, the script cache, and FUNCTION LOAD and FCALL. Runs that can write ask first and are audited.",
      },
      {
        t: "Bulk actions without a cap",
        d: "Select every key matching a pattern and set TTLs or delete them as a server-side SCAN job with progress and Cancel. Tested on 30,000 keys.",
      },
      {
        t: "Offline RDB analysis (Pro)",
        d: "Open a dump.rdb from Redis 2.x to 8.x or Valkey 7.2 to 9 and see the biggest keys, sizes by type and namespace, and TTLs, streamed even for multi-GB files.",
      },
    ],
    screen: {
      id: "redis-keys",
      alt: "MotionQL's Redis key browser with a namespace tree and a JSON value open",
      caption: "The Redis key browser: namespaces on the left, the value editor on the right.",
    },
    notes: [
      "Standalone servers, clusters and Sentinel, with TLS, ACL users and SSH tunnels. Paste a redis:// or rediss:// URL (Upstash and Vercel KV) to fill the form.",
    ],
    features: ["logs-analytics", "projects-environments"],
  },
  {
    slug: "elasticsearch",
    name: "Elasticsearch and OpenSearch",
    group: "Search, time series and graph",
    language: "Query DSL, KQL, Lucene, ES|QL and SQL",
    flavors: [
      { name: "Elasticsearch", depth: "Good" },
      { name: "OpenSearch", depth: "Good" },
      { name: "Elastic Cloud and Elasticsearch Serverless", depth: "Good" },
      { name: "Amazon OpenSearch Service and Serverless", depth: "Good" },
    ],
    title: "Elasticsearch and OpenSearch, Kibana-style, on your desktop",
    metaTitle: "Elasticsearch and OpenSearch GUI client with Discover, console and index management",
    summary:
      "Discover with KQL and a date histogram, a console with completion from the mapping, a documents grid you can edit, and cluster, security, lifecycle and snapshot administration.",
    highlights: [
      {
        t: "Discover",
        d: "KQL, Lucene or Query DSL, time ranges, a date histogram, a field list with top values and one-click filters, and Visualize to add a chart to a dashboard.",
      },
      {
        t: "Console",
        d: "Kibana-style requests with completion from the mapping, aggregation tables and charts, the Profile API, and SQL translated to Query DSL.",
      },
      {
        t: "Documents grid",
        d: "Paged with search_after over a point in time, with filters from any cell, edit with optimistic concurrency, and bulk update or delete by query after you type the count.",
      },
      {
        t: "Cluster administration",
        d: "Health, nodes, shards with allocation explain, tasks, hot threads and snapshots; users, roles and API keys; ILM or ISM policies on a timeline; templates and ingest pipelines with Simulate.",
      },
      {
        t: "Any sign-in",
        d: "Node URLs or a Cloud ID, basic auth, API keys, bearer tokens, AWS SigV4, a custom CA and SSH tunnels. The distribution and version are detected on connect.",
      },
    ],
    screen: {
      id: "es-discover",
      alt: "MotionQL's Discover view for an Elasticsearch index with a date histogram and hits",
      caption: "Discover on an Elasticsearch index: KQL, a histogram and the matching documents.",
    },
    features: ["logs-analytics", "ai-assistant-mcp"],
  },
  {
    slug: "clickhouse",
    name: "ClickHouse",
    group: "Analytics and warehouses",
    language: "ClickHouse SQL",
    flavors: [{ name: "ClickHouse and ClickHouse Cloud", depth: "Good" }],
    title: "ClickHouse, with the operations panel you always wanted",
    metaTitle: "ClickHouse GUI client: query log, merges, parts and partitions",
    summary:
      "Exact 64-bit values, a session per tab and an Operations tab with running queries, the query log by shape, merges, mutations, parts, column compression, replicas and Keeper.",
    highlights: [
      {
        t: "The real shape of a table",
        d: "Each table's engine and size in the tree, with projections and partitions; TTL, compression, parts and replica state in table info; dictionaries with their layout and source.",
      },
      {
        t: "Operations tab",
        d: "Running queries, the query log grouped by query shape, failures, merges and mutations, partitions and parts, column compression, disks, replicas, Keeper and clusters.",
      },
      {
        t: "Safe by default",
        d: "Read-only connections also run with the server's readonly=2. Kill query, drop partition and OPTIMIZE FINAL ask first and are audited.",
      },
      {
        t: "EXPLAIN with index usage",
        d: "See which primary key and skip indexes a query uses before you run it on billions of rows.",
      },
    ],
    screen: {
      id: "clickhouse-operations",
      alt: "MotionQL's ClickHouse Operations tab showing the query log grouped by shape",
      caption: "ClickHouse operations: the query log grouped by shape, with time and rows read.",
    },
    features: ["logs-analytics", "sql-databases"],
  },
  {
    slug: "snowflake",
    name: "Snowflake",
    group: "Analytics and warehouses",
    language: "Snowflake SQL",
    flavors: [{ name: "Snowflake", depth: "Good" }],
    title: "Snowflake with the credits in plain sight",
    metaTitle: "Snowflake GUI client with credit estimates, warehouses and Time Travel",
    summary:
      "Browse without waking a warehouse, see recent queries with credit estimates, manage warehouses, use Time Travel, and load stages with a COPY INTO wizard.",
    highlights: [
      {
        t: "Sign in your way",
        d: "Key pair, programmatic access token, OAuth, browser SSO, or password with Duo MFA. Each tab has its own role, warehouse, database and schema.",
      },
      {
        t: "Browse for free",
        d: "The tree uses SHOW, so it needs no running warehouse: dynamic and external tables, stages, file formats, pipes, streams, tasks and routines.",
      },
      {
        t: "Credits and warehouses",
        d: "Recent queries with credit estimates, attributed credits and trends, and a warehouse manager to suspend, resume, resize and set auto-suspend.",
      },
      {
        t: "Time Travel and loading",
        d: "AT and BEFORE previews, clone and UNDROP; stages with a COPY INTO wizard; Explain and the query profile in the plan viewer.",
      },
    ],
    features: ["logs-analytics", "sql-databases"],
  },
  {
    slug: "bigquery",
    name: "Google BigQuery",
    group: "Analytics and warehouses",
    language: "GoogleSQL",
    flavors: [{ name: "Google BigQuery (and the BigQuery emulator)", depth: "Good" }],
    title: "BigQuery that tells you the cost before you run",
    metaTitle: "BigQuery GUI client with dry-run cost estimates and a cost guard",
    summary:
      "A dry run while you type shows how many bytes a query will process, a cost guard asks before big runs, and AI suggests partition filters and cheaper rewrites.",
    highlights: [
      {
        t: "Dry run while you type",
        d: "This query will process X GB, with hints for partitioned tables read without a partition filter. A cost guard asks before a bigger run and sets maximumBytesBilled.",
      },
      {
        t: "Reduce my cost",
        d: "AI suggests partition filters, column pruning, clustering and cheaper rewrites from the dry run's bytes and the tables' partitioning.",
      },
      {
        t: "Everything in the tree",
        d: "Projects, datasets, tables, views, materialized views, external tables, snapshots, routines and ML models, with nested STRUCT and ARRAY columns as a tree.",
      },
      {
        t: "Jobs and stages",
        d: "Job history with bytes, slot time and cache hits; Explain Analyze shows the job's stages. Table pages are read with the free tabledata.list.",
      },
      {
        t: "Sign in with Google",
        d: "Browser sign-in with your own OAuth client, Application Default Credentials, a service account key or an access token.",
      },
    ],
    features: ["logs-analytics", "ai-assistant-mcp"],
  },
  {
    slug: "trino",
    name: "Trino, Presto and Starburst",
    group: "Analytics and warehouses",
    language: "Trino SQL",
    flavors: [
      { name: "Trino", depth: "Good" },
      { name: "PrestoDB", depth: "Good" },
      { name: "Starburst Enterprise and Galaxy", depth: "Good" },
    ],
    title: "Trino and Presto with live query progress",
    metaTitle: "Trino and Presto GUI client with live progress and distributed explain",
    summary:
      "Catalogs, schemas and tables in one tree, live progress with splits and rows read, a distributed Explain as one tree, and running queries you can kill.",
    highlights: [
      { t: "Live progress", d: "State, splits, rows read and elapsed time while a query runs, with Cancel." },
      {
        t: "Explain across fragments",
        d: "EXPLAIN (TYPE DISTRIBUTED) as one tree over all fragments; Explain Analyze shows CPU per operator, spill and row misestimates.",
      },
      {
        t: "Read-only means read-only",
        d: "Read-only connections run every statement in START TRANSACTION READ ONLY, so the server refuses writes too.",
      },
      {
        t: "Insights",
        d: "Running queries with splits, rows, bytes and CPU, Kill query after you type its id, nodes and catalogs.",
      },
    ],
    features: ["logs-analytics", "sql-databases"],
  },
  {
    slug: "databricks",
    name: "Databricks SQL",
    group: "Analytics and warehouses",
    language: "Databricks SQL",
    flavors: [{ name: "Databricks SQL on AWS, Azure and GCP", depth: "Good", note: "tested against a mock workspace" }],
    title: "Databricks SQL with the warehouse under control",
    metaTitle: "Databricks SQL client with Unity Catalog, warehouses and Delta history",
    summary:
      "Unity Catalog in the tree, a warehouse bar that asks before starting a billed warehouse, Explain Formatted with Photon operators, and Delta history with restore.",
    highlights: [
      {
        t: "Warehouse bar",
        d: "Pick the warehouse, see its state, start it (asks first, since a running warehouse is billed) and stop it. A statement that would start a stopped warehouse asks too.",
      },
      {
        t: "Unity Catalog",
        d: "Catalogs, schemas, tables, views, materialized views, streaming tables, volumes and functions, with SHOW CREATE TABLE DDL.",
      },
      {
        t: "Delta history",
        d: "DESCRIBE HISTORY for Delta tables, with Restore to version after you type the table name.",
      },
      {
        t: "Plans and history",
        d: "Explain Formatted with Photon operators and scans without a pushed filter flagged; Explain Analyze adds time, rows, files read, pruning and spill.",
      },
    ],
    notes: ["Databricks support is tested against a mock workspace, not a real Databricks account yet."],
    features: ["logs-analytics"],
  },
  {
    slug: "spanner",
    name: "Google Cloud Spanner",
    group: "Analytics and warehouses",
    language: "GoogleSQL and PostgreSQL dialect",
    flavors: [
      { name: "Cloud Spanner (GoogleSQL)", depth: "Good" },
      { name: "Cloud Spanner (PostgreSQL dialect)", depth: "Good" },
    ],
    title: "Cloud Spanner, interleaved tables and all",
    metaTitle: "Google Cloud Spanner GUI client with query plans and lock statistics",
    summary:
      "Instances, databases and interleaved tables in the tree, grid edits as mutations, query plans and profiles, and query, transaction and lock statistics from SPANNER_SYS.",
    highlights: [
      {
        t: "Schema as Spanner sees it",
        d: "Interleaved tables with their parent and ON DELETE action, interleaved indexes, views, change streams and sequences, with DDL from getDatabaseDdl.",
      },
      {
        t: "Edits as mutations",
        d: "Grid edits become update, insert and delete mutations with a check that the key still matches one row.",
      },
      { t: "Plans and profiles", d: "Explain uses query mode PLAN and Explain Analyze PROFILE, with full scans flagged." },
      {
        t: "Insights",
        d: "Query, transaction and lock statistics and the oldest active queries from SPANNER_SYS, with Cancel query.",
      },
    ],
    features: ["logs-analytics"],
  },
  {
    slug: "dynamodb",
    name: "Amazon DynamoDB",
    group: "Document and key-value",
    language: "PartiQL and the DynamoDB API",
    flavors: [{ name: "Amazon DynamoDB, DynamoDB Local and LocalStack", depth: "Good" }],
    title: "DynamoDB with the capacity cost of every page",
    metaTitle: "DynamoDB GUI client with Scan and Query builders, PartiQL and CloudWatch metrics",
    summary:
      "Scan and Query builders that show consumed capacity, a PartiQL editor that flags full scans, a table designer, backups and point-in-time restore, and CloudWatch metrics per table.",
    highlights: [
      {
        t: "Scan and Query builders",
        d: "Key conditions, filters, projection, index, consistent read and paging, with the consumed capacity of every page and a full-scan cost estimate.",
      },
      {
        t: "PartiQL editor",
        d: "Completion of tables, indexes and attributes, and SELECTs without a partition key condition flagged as full scans.",
      },
      {
        t: "Tables and items",
        d: "Create and edit tables with indexes, capacity, streams, TTL and recovery; edit items as DynamoDB JSON or plain JSON with conditions.",
      },
      {
        t: "Metrics and backups",
        d: "CloudWatch read and write capacity, throttles and latency per table or index; on-demand backups and point-in-time restore.",
      },
      {
        t: "Any AWS sign-in",
        d: "The default credential chain, a profile, SSO or access keys, in any region, or an endpoint URL for DynamoDB Local and LocalStack.",
      },
    ],
    screen: {
      id: "dynamodb-scan",
      alt: "MotionQL's DynamoDB Scan builder showing items and consumed capacity",
      caption: "A DynamoDB scan with consumed capacity shown for the page.",
    },
    features: ["logs-analytics", "cross-database-links"],
  },
  {
    slug: "cassandra",
    name: "Cassandra and ScyllaDB",
    group: "Document and key-value",
    language: "CQL",
    flavors: [
      { name: "Apache Cassandra 3, 4 and 5", depth: "Good" },
      { name: "ScyllaDB", depth: "Good" },
      { name: "DataStax Enterprise", depth: "Good" },
      { name: "DataStax Astra DB", depth: "Good", note: "checked with mocks only" },
    ],
    title: "Cassandra and ScyllaDB that warn before ALLOW FILTERING",
    metaTitle: "Cassandra and ScyllaDB GUI client with a CQL console and table designer",
    summary:
      "Keyspaces and tables from system_schema, a filter builder that knows the partition key, a CQL console with tracing, a table designer and a cluster panel.",
    highlights: [
      {
        t: "Model-aware browsing",
        d: "Keyspaces with replication, tables, materialized views, indexes, user types and functions, and columns marked partition key, clustering or static.",
      },
      {
        t: "Filters that know your keys",
        d: "Rows paged with CQL paging state and a filter builder that warns before a query needs ALLOW FILTERING.",
      },
      {
        t: "CQL console",
        d: "Highlighting and completion, a consistency picker, tracing with the trace events, More rows and history.",
      },
      {
        t: "Schema changes",
        d: "A table designer for keys, clustering order, compaction, TTL and gc_grace_seconds with a CQL preview; secondary or SAI indexes and materialized views.",
      },
    ],
    screen: {
      id: "cassandra-rows",
      alt: "Rows of a Cassandra table in MotionQL with the partition key marked",
      caption: "A Cassandra table's rows, paged with CQL paging state.",
    },
    notes: ["DataStax Astra DB through a secure connect bundle is offered but untested against a live database."],
  },
  {
    slug: "influxdb",
    name: "InfluxDB",
    group: "Search, time series and graph",
    language: "Flux, InfluxQL and SQL",
    flavors: [
      { name: "InfluxDB 2.x", depth: "Good" },
      { name: "InfluxDB 3 Core and Enterprise", depth: "Good" },
      { name: "InfluxDB Cloud", depth: "Good", note: "checked with mocks only" },
    ],
    title: "InfluxDB in Flux, InfluxQL or SQL",
    metaTitle: "InfluxDB GUI client for Flux, InfluxQL and SQL with a data explorer",
    summary:
      "A query console with a time-range picker and charts, a data explorer that writes the query for you, line protocol checks before writing, and a health panel with cardinality.",
    highlights: [
      {
        t: "Three languages, one console",
        d: "Flux, InfluxQL or SQL with highlighting and completion, a time-range picker, table and chart views, and CSV export.",
      },
      {
        t: "Data explorer",
        d: "Pick a bucket, measurement, fields, tag filters, window and aggregate, and see the Flux, InfluxQL or SQL as you go.",
      },
      {
        t: "Write safely",
        d: "Write line protocol checks the lines and previews the points and field types first. Delete by predicate needs the bucket name typed.",
      },
      {
        t: "Health and cardinality",
        d: "Health and readiness, series and tag cardinality, tasks with their runs and logs, and on InfluxDB 3 the recent queries.",
      },
    ],
    screen: {
      id: "influx-console",
      alt: "An InfluxDB query in MotionQL with a line chart of the results",
      caption: "An InfluxDB query charted over the selected time range.",
    },
    notes: ["InfluxDB Cloud is offered but untested against a live account."],
  },
  {
    slug: "neo4j",
    name: "Neo4j and Memgraph",
    group: "Search, time series and graph",
    language: "Cypher",
    flavors: [
      { name: "Neo4j 5 Community and Enterprise", depth: "Good" },
      { name: "Neo4j Aura", depth: "Good" },
      { name: "Memgraph", depth: "Good" },
    ],
    title: "Neo4j and Memgraph, as a graph and as a table",
    metaTitle: "Neo4j and Memgraph GUI client with a Cypher console and graph view",
    summary:
      "A Cypher console with completion and parameters, a force-directed graph view, a label browser with a typed node editor, and guided indexes and constraints.",
    highlights: [
      {
        t: "Cypher console",
        d: "Completion of labels, relationship types, properties, parameters and procedures; :param, :params and :use; EXPLAIN and PROFILE in the plan viewer.",
      },
      {
        t: "Graph view",
        d: "A force-directed graph with label colours, expand on double-click, pin, zoom and an inspector, next to Table, Record and JSON views.",
      },
      {
        t: "Labels and schema",
        d: "Paged nodes with filter and sort, a typed node editor, the schema graph, and guided range, text, point, full-text and vector indexes and constraints.",
      },
      {
        t: "Server tab",
        d: "SHOW TRANSACTIONS with terminate, database size and counts, settings and servers.",
      },
    ],
    screen: {
      id: "neo4j-graph",
      alt: "A Cypher query result shown as a force-directed graph in MotionQL",
      caption: "Customers, orders and products from a Cypher query, as a graph.",
    },
    features: ["ai-assistant-mcp"],
  },
  {
    slug: "jdbc",
    name: "Db2, Firebird, H2, HSQLDB and Derby",
    group: "Relational",
    language: "Each engine's own SQL",
    flavors: [
      { name: "IBM Db2", depth: "Good" },
      { name: "Firebird", depth: "Good" },
      { name: "H2", depth: "Good" },
      { name: "HSQLDB", depth: "Good" },
      { name: "Apache Derby", depth: "Good" },
    ],
    title: "Db2, Firebird, H2, HSQLDB and Derby in a modern client",
    metaTitle: "IBM Db2, Firebird, H2, HSQLDB and Derby GUI client",
    summary:
      "The databases other modern clients skip, through a JDBC bridge on your own Java with the driver JAR you choose. Nothing is downloaded or bundled, and the JAR is checked on every load.",
    highlights: [
      {
        t: "Your driver, verified",
        d: "Runs on your own Java 11+ with the JAR you pick, and checks its SHA-256 on every load. Embedded H2, HSQLDB and Derby files open directly.",
      },
      {
        t: "Db2 in depth",
        d: "The SYSCAT catalog, Script as CREATE, access plans with predicates, sessions, lock waits, top SQL, tablespaces and buffer pools, and users and authorities.",
      },
      {
        t: "Firebird backups",
        d: "Backup and restore through the Services API in gbak format, streamed to and from a file on your computer.",
      },
      {
        t: "Migrate out (Pro)",
        d: "Move a schema from these engines into PostgreSQL or a new SQLite file, with keys, indexes, identity counters and a row-count and checksum check.",
      },
    ],
  },
];

export const databaseBySlug = (slug: string) => databases.find((d) => d.slug === slug);

/** Every database and service name, for the marquee and structured data. */
export const allDatabaseNames = databases.flatMap((d) => d.flavors.map((f) => f.name));

/** The app's Add connection dialog lists "64 engines and hosted services" (src/shared/engines/registry.ts). Rounded down for copy. */
export const databaseCountText = "60+";

export const databaseGroups = [
  "Relational",
  "Document and key-value",
  "Analytics and warehouses",
  "Search, time series and graph",
] as const;

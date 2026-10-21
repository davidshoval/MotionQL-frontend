// Marketing copy that more than one page uses. Feature facts come from the app's own docs
// (motionql-platform README, CHANGELOG 1.0.0, docs/FAQ.md, docs/LICENSING.md).

export type Mark = "yes" | "no" | "partial" | "paid" | string;

export interface CompareRow {
  feature: string;
  note?: string;
  motionql: Mark;
  studio3t: Mark;
  compass: Mark;
}

export interface CompareGroup {
  group: string;
  rows: CompareRow[];
}

/**
 * Competitor columns reflect each vendor's public documentation as checked in October 2026.
 * "paid" means the feature exists only in paid editions.
 */
export const comparison: CompareGroup[] = [
  {
    group: "Price and licensing",
    rows: [
      {
        feature: "Full feature set",
        motionql: "Free Pro license for 12 months",
        studio3t: "Paid per-user subscription",
        compass: "Free, fewer features",
      },
      {
        feature: "Free edition allowed for commercial work",
        motionql: "yes",
        studio3t: "no",
        compass: "yes",
        note: "Studio 3T's free Community edition is for non-commercial use in recent versions.",
      },
      {
        feature: "Works offline with no license check-ins",
        motionql: "yes",
        studio3t: "no",
        compass: "yes",
        note: "Studio 3T seats check in with its License Manager; long offline periods expire the token.",
      },
    ],
  },
  {
    group: "Querying",
    rows: [
      {
        feature: "Visual query builder",
        motionql: "yes",
        studio3t: "yes",
        compass: "partial",
        note: "Compass has a query bar, not a drag-and-drop builder.",
      },
      { feature: "Aggregation editor with stage preview", motionql: "yes", studio3t: "yes", compass: "yes" },
      { feature: "Shell with autocomplete", motionql: "yes", studio3t: "yes", compass: "yes" },
      { feature: "SQL queries against MongoDB", motionql: "yes", studio3t: "paid", compass: "no" },
      { feature: "Code generation", motionql: "9 languages", studio3t: "yes", compass: "8 languages" },
      { feature: "Explain plans", motionql: "yes", studio3t: "yes", compass: "yes" },
    ],
  },
  {
    group: "Data movement",
    rows: [
      { feature: "Import and export JSON and CSV", motionql: "yes", studio3t: "yes", compass: "yes" },
      { feature: "Excel, BSON and SQL INSERT formats", motionql: "yes", studio3t: "yes", compass: "no" },
      { feature: "Data Compare and Sync", motionql: "yes", studio3t: "paid", compass: "no" },
      {
        feature: "SQL to MongoDB migration",
        motionql: "yes",
        studio3t: "paid",
        compass: "no",
        note: "MongoDB offers Relational Migrator as a separate tool.",
      },
      { feature: "Dump and restore", motionql: "yes", studio3t: "yes", compass: "no" },
    ],
  },
  {
    group: "Schema, governance and automation",
    rows: [
      { feature: "Schema analysis", motionql: "yes", studio3t: "yes", compass: "yes" },
      { feature: "Data masking", motionql: "yes", studio3t: "paid", compass: "no" },
      { feature: "Scheduled tasks", motionql: "yes", studio3t: "yes", compass: "no" },
    ],
  },
  {
    group: "AI",
    rows: [
      { feature: "Natural language to queries and pipelines", motionql: "yes", studio3t: "yes", compass: "yes" },
      {
        feature: "Use your own AI provider key",
        motionql: "yes",
        studio3t: "yes",
        compass: "no",
        note: "Compass uses a MongoDB-hosted model.",
      },
      { feature: "Local models (Ollama and other OpenAI-compatible servers)", motionql: "yes", studio3t: "no", compass: "no" },
    ],
  },
];

export const faqs = [
  {
    q: "Is MotionQL really free?",
    a: "Yes. Create an account and you get a personal Pro license that is valid for 12 months, with no credit card. Most of the app is free without any license at all: every database connection, the SQL editor and query builder, EXPLAIN plans, server insights, Logs & analytics, projects and environments, the MongoDB tools, import/export and the AI assistant. Pro adds migration between databases, Data Masking, scheduled tasks, SQL schema and data compare, Git version control, the stored-procedure debugger, Supabase and Neon branches, Redis RDB analysis and Atlas management.",
  },
  {
    q: "What happens after the 12 months?",
    a: "The free Pro year is one per email address and isn't renewed. From 30 days before it ends, MotionQL reminds you. When it ends, only the Pro features pause: MotionQL still opens, connects and shows your data, every free feature keeps working, and nothing on your computer is deleted. You can then upgrade to keep Pro.",
  },
  {
    q: "Can I move over from DBeaver, DataGrip or Studio 3T?",
    a: "Yes. Import your connections and saved queries from DBeaver, DataGrip, pgAdmin, MySQL Workbench, Azure Data Studio, Navicat, Compass or Studio 3T in one step, or paste a connection string. SSH tunnels with jump hosts, TLS and cloud sign-ins such as AWS IAM work as they do today, and your mongosh-style commands work in IntelliShell.",
  },
  {
    q: "Which databases does it support?",
    a: "60+ databases and hosted services. Relational: PostgreSQL (and Supabase, Neon, Aurora, CockroachDB, YugabyteDB and more), MySQL and MariaDB, SQL Server and Azure SQL, Oracle, SQLite and DuckDB. Document and key-value: MongoDB and compatible services, Redis and Valkey, DynamoDB, Cassandra and ScyllaDB. Analytics: ClickHouse, Snowflake, BigQuery, Trino, Databricks and Spanner. Search, time series and graph: Elasticsearch and OpenSearch, InfluxDB and Neo4j. Anything else with a JDBC driver connects too. See the full list on the Databases page.",
  },
  {
    q: "Does my data go to MotionQL?",
    a: "No. MotionQL connects straight from your computer to your databases. We never receive your documents, queries, connection strings or credentials. Passwords are encrypted with your operating system's keychain.",
  },
  {
    q: "What does the AI assistant see?",
    a: "Only what it needs: your request, plus database, collection and field names, types, indexes and explain-plan structure. Document values, passwords and connection strings are never sent. It is off for every connection until you turn it on, and it uses your own Gemini, Claude or OpenAI-compatible key, or a local model.",
  },
  {
    q: "Do I need internet to activate my license?",
    a: "No. Keys are verified offline with a digital signature, so MotionQL works behind firewalls and on air-gapped machines.",
  },
  {
    q: "Is there a version for teams?",
    a: "Yes, and team seats are free for their first year too. Create a team, invite people by email, and each member gets their own key. Admins can free a seat, reissue a key or remove someone at any time from the team page.",
  },
];

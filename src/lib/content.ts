// Marketing copy that more than one page uses. Feature facts come from the app's own docs
// (Xquery.io-Platform README, CHANGELOG 1.0.0, docs/FAQ.md, docs/LICENSING.md).

export type Mark = "yes" | "no" | "partial" | "paid" | string;

export interface CompareRow {
  feature: string;
  note?: string;
  xquery: Mark;
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
        xquery: "Free Pro license for 12 months",
        studio3t: "Paid per-user subscription",
        compass: "Free, fewer features",
      },
      {
        feature: "Free edition allowed for commercial work",
        xquery: "yes",
        studio3t: "no",
        compass: "yes",
        note: "Studio 3T's free Community edition is for non-commercial use in recent versions.",
      },
      {
        feature: "Works offline with no license check-ins",
        xquery: "yes",
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
        xquery: "yes",
        studio3t: "yes",
        compass: "partial",
        note: "Compass has a query bar, not a drag-and-drop builder.",
      },
      { feature: "Aggregation editor with stage preview", xquery: "yes", studio3t: "yes", compass: "yes" },
      { feature: "Shell with autocomplete", xquery: "yes", studio3t: "yes", compass: "yes" },
      { feature: "SQL queries against MongoDB", xquery: "yes", studio3t: "paid", compass: "no" },
      { feature: "Code generation", xquery: "9 languages", studio3t: "yes", compass: "8 languages" },
      { feature: "Explain plans", xquery: "yes", studio3t: "yes", compass: "yes" },
    ],
  },
  {
    group: "Data movement",
    rows: [
      { feature: "Import and export JSON and CSV", xquery: "yes", studio3t: "yes", compass: "yes" },
      { feature: "Excel, BSON and SQL INSERT formats", xquery: "yes", studio3t: "yes", compass: "no" },
      { feature: "Data Compare and Sync", xquery: "yes", studio3t: "paid", compass: "no" },
      {
        feature: "SQL to MongoDB migration",
        xquery: "yes",
        studio3t: "paid",
        compass: "no",
        note: "MongoDB offers Relational Migrator as a separate tool.",
      },
      { feature: "Dump and restore", xquery: "yes", studio3t: "yes", compass: "no" },
    ],
  },
  {
    group: "Schema, governance and automation",
    rows: [
      { feature: "Schema analysis", xquery: "yes", studio3t: "yes", compass: "yes" },
      { feature: "Data masking", xquery: "yes", studio3t: "paid", compass: "no" },
      { feature: "Scheduled tasks", xquery: "yes", studio3t: "yes", compass: "no" },
    ],
  },
  {
    group: "AI",
    rows: [
      { feature: "Natural language to queries and pipelines", xquery: "yes", studio3t: "yes", compass: "yes" },
      {
        feature: "Use your own AI provider key",
        xquery: "yes",
        studio3t: "yes",
        compass: "no",
        note: "Compass uses a MongoDB-hosted model.",
      },
      { feature: "Local models (Ollama and other OpenAI-compatible servers)", xquery: "yes", studio3t: "no", compass: "no" },
    ],
  },
];

export const faqs = [
  {
    q: "Is XQuery really free?",
    a: "Yes. Create an account and you get a personal Pro license that is valid for 12 months, with no credit card. Most of the app, including the query builder, aggregation editor, IntelliShell, SQL Query, import/export and Compare & Sync, is free without any license at all. Pro adds SQL Migration, Data Masking, scheduled tasks and Atlas management.",
  },
  {
    q: "What happens after the 12 months?",
    a: "While the free plan is on, you renew for another year with one click on your account page. If we ever start charging, you will see pricing before your year ends, and everything that is free today stays free. Nothing on your computer is deleted.",
  },
  {
    q: "Can I move over from Studio 3T or Compass?",
    a: "Yes. Paste the same connection strings, or import them. XQuery supports the same hosts and auth methods, including SRV, replica sets, sharded clusters, SSH tunnels with jump hosts, X.509, LDAP, Kerberos, AWS IAM and OIDC. Your mongosh-style commands work in IntelliShell.",
  },
  {
    q: "Which databases does it support?",
    a: "MongoDB 4.4 and later (Community, Enterprise and Atlas, standalone, replica sets and sharded clusters). Amazon DocumentDB, Azure Cosmos DB for MongoDB and FerretDB work through the same driver, limited to what those services implement. SQL Migration reads from PostgreSQL, MySQL, MariaDB, SQL Server and Oracle.",
  },
  {
    q: "Does my data go to XQuery?",
    a: "No. XQuery connects straight from your computer to your databases. We never receive your documents, queries, connection strings or credentials. Passwords are encrypted with your operating system's keychain.",
  },
  {
    q: "What does the AI assistant see?",
    a: "Only what it needs: your request, plus database, collection and field names, types, indexes and explain-plan structure. Document values, passwords and connection strings are never sent. It is off for every connection until you turn it on, and it uses your own Gemini, Claude or OpenAI-compatible key, or a local model.",
  },
  {
    q: "Do I need internet to activate my license?",
    a: "No. Keys are verified offline with a digital signature, so XQuery works behind firewalls and on air-gapped machines.",
  },
  {
    q: "Is there a version for teams?",
    a: "Yes, and team seats are free for now too. Create a team, invite people by email, and each member gets their own key. Admins can free a seat, reissue a key or remove someone at any time from the team page.",
  },
];

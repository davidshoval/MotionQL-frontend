// Documentation manifest. Page bodies are Markdown files in content/docs/<slug>.md, written from the desktop
// app's own guides (motionql-platform docs/USER_GUIDE.md, INSTALLATION.md, TROUBLESHOOTING.md, FAQ.md, CHANGELOG.md).
import { readFile } from "node:fs/promises";
import path from "node:path";
import { slugify } from "./slugify";

export interface DocPage {
  slug: string;
  title: string;
  description: string;
}

export interface DocSection {
  title: string;
  pages: DocPage[];
}

export const docSections: DocSection[] = [
  {
    title: "Getting started",
    pages: [
      {
        slug: "install",
        title: "Download and install",
        description: "System requirements, installers for macOS and Windows, and what to do about security warnings.",
      },
      {
        slug: "activate",
        title: "Register and activate Pro",
        description: "Create an account, get your free 12-month Pro key and activate it in the app.",
      },
    ],
  },
  {
    title: "Connecting",
    pages: [
      {
        slug: "connections",
        title: "Connections",
        description: "Connection strings, SRV, replica sets, sharded clusters, organizing and sharing connections.",
      },
      { slug: "authentication", title: "Authentication methods", description: "SCRAM, X.509, LDAP, Kerberos, AWS IAM and OIDC." },
      {
        slug: "tls-ssh-proxy",
        title: "TLS, SSH and proxies",
        description: "Certificates, SSH tunnels with jump hosts, and SOCKS5 or HTTP proxies.",
      },
      {
        slug: "in-use-encryption",
        title: "In-use encryption (CSFLE)",
        description: "Client-Side Field Level Encryption and Queryable Encryption with local or cloud KMS keys.",
      },
      {
        slug: "connection-safety",
        title: "Read-only and safety settings",
        description: "Per-connection read-only mode, AI and server-side JavaScript switches.",
      },
    ],
  },
  {
    title: "Querying and editing",
    pages: [
      {
        slug: "browsing-editing",
        title: "Browsing and editing documents",
        description: "The explorer, tree, table and JSON views, in-place editing and document history.",
      },
      { slug: "query-bar", title: "Query bar", description: "Filter, projection, sort, skip, limit and query options in shell syntax." },
      {
        slug: "visual-query-builder",
        title: "Visual query builder",
        description: "Build filters with drag-and-drop conditions and AND/OR groups.",
      },
      {
        slug: "aggregation-editor",
        title: "Aggregation editor",
        description: "Stage-by-stage pipelines with preview, templates and code generation.",
      },
      {
        slug: "intellishell",
        title: "IntelliShell",
        description: "mongosh-style commands, autocomplete, history and the optional Script mode.",
      },
      { slug: "sql-query", title: "SQL Query", description: "Run SELECT statements against MongoDB collections." },
      {
        slug: "gridfs",
        title: "GridFS, views and transactions",
        description: "File buckets, views, multi-operation transactions and change streams.",
      },
    ],
  },
  {
    title: "Schema and performance",
    pages: [
      {
        slug: "schema-tools",
        title: "Schema tools",
        description: "Schema analysis, compare and history, ER diagrams, Reschema and Data Masking.",
      },
      { slug: "indexes", title: "Indexes", description: "Create, hide and review indexes, and read usage statistics." },
      {
        slug: "explain-profiler",
        title: "Explain plans and the profiler",
        description: "Read query plans, spot collection scans and find slow operations.",
      },
    ],
  },
  {
    title: "Moving data",
    pages: [
      { slug: "import-export", title: "Import and export", description: "JSON, JSON Lines, CSV, BSON, Excel and SQL INSERT files." },
      {
        slug: "dump-restore",
        title: "Copy, dump and restore",
        description: "Copy collections and use mongodump-compatible folders and archives.",
      },
      { slug: "compare-sync", title: "Compare and Sync", description: "Diff two collections field by field and sync the differences." },
      {
        slug: "sql-migration",
        title: "SQL Migration",
        description: "Move tables from PostgreSQL, MySQL, SQL Server and Oracle into MongoDB.",
      },
    ],
  },
  {
    title: "Automation and AI",
    pages: [
      {
        slug: "tasks-cli",
        title: "Tasks and the command line",
        description: "Schedule repeatable jobs, run them in the background or from scripts.",
      },
      { slug: "dashboards", title: "Dashboards", description: "Charts, metrics and tables backed by live aggregations." },
      // "Get a free Gemini API key" was checked against Google's pages on 2026-10-04:
      // - ai.google.dev/gemini-api/terms: unpaid services' content is used "to provide, improve, and develop Google
      //   products", "human reviewers may read, annotate, and process your API input and output", "Do not submit
      //   sensitive, confidential, or personal information to the Unpaid Services"; paid prompts aren't used to
      //   improve products.
      // - ai.google.dev/gemini-api/docs/rate-limits: RPM, TPM (input) and RPD; "applied per project, not per API key";
      //   limits vary by model; RPD resets at midnight Pacific time. Numbers aren't copied because Google changes them.
      {
        slug: "ai-mcp",
        title: "AI assistant and MCP",
        description: "Bring your own model, chat with your database and connect AI coding tools.",
      },
    ],
  },
  {
    title: "Reference",
    pages: [
      { slug: "keyboard-shortcuts", title: "Keyboard shortcuts", description: "Default shortcuts and how to rebind them." },
      {
        slug: "licensing-teams",
        title: "Licensing and teams",
        description: "Editions, what Pro unlocks, renewals, team seats and the Team Server.",
      },
      { slug: "troubleshooting", title: "Troubleshooting", description: "Fixes for install, connection, license and keychain problems." },
    ],
  },
];

export const docPages: (DocPage & { section: string })[] = docSections.flatMap((s) => s.pages.map((p) => ({ ...p, section: s.title })));

export function getDoc(slug: string) {
  const i = docPages.findIndex((p) => p.slug === slug);
  if (i < 0) return null;
  return { page: docPages[i], prev: docPages[i - 1] ?? null, next: docPages[i + 1] ?? null };
}

export async function readDocSource(slug: string) {
  return readFile(path.join(process.cwd(), "content/docs", `${slug}.md`), "utf8");
}

export interface Heading {
  depth: 2 | 3;
  text: string;
  id: string;
}

/** h2/h3 headings of a Markdown source, skipping fenced code. Ids match the ones the renderer gives headings. */
export function extractHeadings(source: string): Heading[] {
  const out: Heading[] = [];
  let fenced = false;
  for (const line of source.split("\n")) {
    if (/^\s*```/.test(line)) fenced = !fenced;
    if (fenced) continue;
    const m = /^(##|###)\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2]
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    out.push({ depth: m[1].length as 2 | 3, text, id: slugify(text) });
  }
  return out;
}

export interface SearchEntry {
  slug: string;
  title: string;
  section: string;
  description: string;
  headings: { text: string; id: string }[];
}

/** A small client-side search index: titles, descriptions and headings of every page. */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
  return Promise.all(
    docPages.map(async (p) => ({
      slug: p.slug,
      title: p.title,
      section: p.section,
      description: p.description,
      headings: extractHeadings(await readDocSource(p.slug)).map(({ text, id }) => ({ text, id })),
    })),
  );
}

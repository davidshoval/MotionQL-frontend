# Changelog

All notable changes to MotionQL are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and MotionQL uses [Semantic Versioning](https://semver.org/).

## [1.0.0] — [RELEASE DATE]

First general-availability release of the MotionQL desktop app for macOS (arm64, x64), Windows (x64) and Linux (x64), and of the self-hosted MotionQL Team Server.

### Connections and authentication

- Connection Manager with folders, tags, colors and `dev`/`staging`/`prod` environments (production warning banner), quick connect on Cmd/Ctrl+1–9, health indicator, duplicate, and export/import with secrets stripped or encrypted with a password.
- Standalone, seed lists, `mongodb+srv`, replica sets with read preference and tags, sharded clusters through mongos, direct and load-balanced connections, and Unix domain sockets.
- TLS with CA and client certificate files; SSH tunnels with password or key authentication, host-key pinning and up to four jump hosts; SOCKS5 and HTTP proxies.
- Authentication: SCRAM-SHA-256/1, X.509, LDAP (PLAIN), Kerberos (GSSAPI), AWS IAM and OIDC (browser sign-in with PKCE, and workload identity for Azure, GCP and Kubernetes).

### Querying and editing

- Collection tab: filter, projection, sort, skip and limit in shell syntax; collation, read/write concern, read preference, `maxTimeMS` and hint; visual query builder; cancel; tree, table and JSON views with a column picker; in-place editing; copy as Extended JSON or shell; explain tab; find-to-aggregation conversion; a COLLSCAN / in-memory sort badge on filtered or sorted queries (checked with a `queryPlanner` explain that does not run the query), linking to the plan and Index Review; document version history with revert.
- IntelliShell: mongosh-style commands parsed without executing JavaScript, with autocomplete, history, snippets, Query Assist and explain; optional Script mode runs JavaScript in a local QuickJS sandbox (can be turned off by policy). Script mode covers the common mongosh helpers, including `rs.*`, `sh.*`, `db.aggregate`, `coll.explain()`, exact `NumberLong` math and cursor read preference and read concern; the list of what works is in [docs/SHELL_COMPATIBILITY.md](docs/SHELL_COMPATIBILITY.md). Number literals are typed as in mongosh: whole numbers outside the 32-bit range are stored as Double, not Long.
- Aggregation editor with stage-by-stage preview, full operator library, options and templates.
- SQL Query: read-only `SELECT` with joins, grouping and ordering, translated to MongoDB queries; `.sql` files.
- Query Code for mongo shell, Node.js, Python, Java, C#, PHP, Ruby, Go and Rust from deterministic templates.

### Data movement and transformation

- Import and export: JSON, JSON Lines, CSV, BSON, Excel and SQL `INSERT`; column mapping and typing; insert, upsert, replace and merge modes; streamed jobs with progress and cancel.
- Copy collections; dump and restore in mongodump layout with optional gzip, or as one `mongodump --archive` file that mongorestore reads (and MotionQL restores archives from mongodump, gzipped or not).
- Data Compare & Sync with field-level diffs, dry-run preview, selective sync and conflict policies.
- SQL Migration from PostgreSQL, MySQL, MariaDB, SQL Server and Oracle, with reference/embed relationships, preview and progress.
- Data Model: ER diagrams of a database with fields, keys and relationships inferred from field names, DBRefs, views and matching values; editable layout, relationships, cardinality and notes; export to PNG, SVG, Mermaid and JSON.
- Schema analysis with CSV, Markdown and HTML reports; Reschema operations; Data Masking with eleven masking methods and preview.

### Administration and monitoring

- Index management including hidden indexes, usage stats from `$indexStats`, live build progress (per shard through mongos) and the shard key with the index that backs it; server monitoring; running operations with kill; query profiler; topology view.
- Users and custom roles with a privilege inspector.
- GridFS browser; views; multi-operation transactions with dry-run and review modes; change stream viewer.
- MongoDB Atlas: organizations, projects, clusters, database users and access lists; pause/resume clusters; create connections from clusters.
- Scheduled tasks (export, import, copy, compare, reschema, masking, SQL migration, dump, restore, script, schema snapshot, index review, continuous sync) with once, interval, daily, weekly and cron schedules, missed-run policy and a run log; an optional background runner (launchd, Task Scheduler, systemd user timer) runs them while the app is closed, and a `--cli` runs them from scripts.
- Dashboards: charts, metrics, tables and notes on a drag-and-resize grid, backed by live aggregations with shared filters, auto refresh and `maxTimeMS`. A chart editor with a live preview covers column, bar, stacked, line, area, pie, doughnut, scatter, radar and polar-area charts, date grouping (hour to year), series, colour palettes, legends, axis titles, number formats and value labels. Built-in and saved templates, one-click layouts, a present mode, and export to PNG, multi-page PDF (A4 or Letter, cut between widgets), per-widget PNG and CSV, and dashboard JSON.

### AI assistant (optional)

- Google Gemini, Anthropic Claude (native, with a model picker), or any OpenAI-compatible endpoint, with the customer's own key (stored encrypted); offline mode.
- Natural language to find, aggregation and SQL; explain plans; fix errors; index advice; pipeline debugging; compare summaries; masking suggestions; schema questions; SQL Migration relationship suggestions.
- Off by default for every connection; sends schema-level context, not documents; suggestions are validated before display.

### Security and governance

- Sandboxed, context-isolated renderer with strict CSP; IPC sender verification and allow-listed methods; Electron fuses and integrity-checked `app.asar`.
- Secrets encrypted with the OS keychain and never exposed to the UI.
- Per-connection read-only, AI and server-side JavaScript policies enforced in the main process, including `$out`/`$merge` and explain-wrapped writes; typed-name confirmation for drops.
- Local audit log with credential redaction; app lock with idle timeout, OS-lock and sleep triggers.
- Enterprise `policy.json` for updates, Team Server URL and sign-in requirement, license deployment, crash-report control and machine-wide security restrictions (read-only hosts, AI, server-side JavaScript, Script mode, background tasks, idle lock), all validated fail-closed.

### Team Server (self-hosted)

- OpenID Connect SSO with PKCE (Okta, Microsoft Entra ID, Google Workspace and other OIDC providers) and SCIM 2.0 provisioning.
- Org roles, teams and folder permissions; shared connections (never with secrets), queries, aggregations, shell and SQL scripts, snippets and tasks, with version history.
- Signed effective policies applied by desktops as a floor, including offline.
- Hash-chained, signed and verifiable audit log with desktop event forwarding, export and SIEM forwarding (webhook, syslog over TLS).
- PostgreSQL or SQLite; Docker image running non-root on a read-only filesystem; CLI for keys, audit, users and SCIM tokens.
- Optional read-only web viewer (`XQ_WEB_VIEWER=true`) at `/web/`: shared items with version history, team policy, and the audit log with filters, verification and export, behind the same SSO and roles. Its sessions are read-only on the server.

### Platform

- Settings, rebindable keyboard shortcuts and a command palette; light and dark themes; accessibility improvements.
- Auto-update over HTTPS with signature verification, stable and beta channels, no downgrades, and enterprise controls.
- 14-day trial and offline Ed25519-signed license keys; first-run EULA acceptance.
- Opt-in crash reporting and a redacted diagnostics export.
- Signed and notarized builds with SHA-256 checksums, a CycloneDX SBOM and build-provenance attestations; third-party notices.

### Known limitations

- No `.pkg` (macOS) package; no Windows on Arm or Linux arm64 builds.
- IBM Db2, SAP ASE and SQLite are not supported as SQL Migration sources.
- Map-Reduce is intentionally not supported.
- The Team Server web viewer is read-only; administration is through the desktop app, API and CLI.

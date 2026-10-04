MotionQL 1.0 is available today for **macOS** (Apple silicon and Intel) and **Windows**. It's a desktop IDE for MongoDB, Atlas and MongoDB-compatible databases, built for the people who spend their day inside a database: developers, DBAs and data teams.

It's also free. The core app needs no license key at all, and when you create an account you get a **Pro license for 12 months at no cost**, no credit card.

## Why we built it

The MongoDB GUI market has two familiar shapes. There's the free official tool, which is good at the basics. And there are full-featured commercial IDEs, where the features that save real time (SQL, data compare, migrations, scheduled jobs) sit behind a per-user subscription.

We wanted a third option: a complete, serious IDE that you can install and use for real work without a purchasing conversation. MotionQL 1.0 is our first step there.

## What's in 1.0

**Connect to anything you run.** Standalone servers, replica sets, sharded clusters, `mongodb+srv` and Atlas. SCRAM, X.509, LDAP, Kerberos, AWS IAM and OIDC sign-in. TLS with your own CA, SSH tunnels with up to four jump hosts and host-key pinning, SOCKS5 and HTTP proxies, and in-use encryption (CSFLE and Queryable Encryption). Amazon DocumentDB, Azure Cosmos DB for MongoDB and FerretDB work through the same driver.

**Query the way you think.**

- A query bar in shell syntax, with a warning badge when a query would scan the whole collection or sort in memory.
- A **visual query builder** with drag-and-drop fields and nested AND/OR groups.
- An **aggregation editor** with stage-by-stage preview.
- **IntelliShell**, which accepts mongosh-style commands and, by default, parses them instead of executing JavaScript, so a pasted command can't run code on your machine. Script mode is there when you need loops and variables.
- **SQL Query**: write `SELECT` with joins and `GROUP BY`, and see the MongoDB query it becomes.
- **Query Code** in nine languages, generated from templates rather than AI, so the same query always produces the same code.

**Move data.** Import and export JSON, JSON Lines, CSV, BSON, Excel and SQL `INSERT` files. Copy collections between servers. Dump and restore in mongodump-compatible folders and archives. **Compare and Sync** two collections with a field-level diff and a dry run before anything is written. **SQL Migration** from PostgreSQL, MySQL, MariaDB, SQL Server and Oracle, with a choice to reference or embed each relationship.

**Understand and tune.** Schema analysis, schema history and an ER diagram that infers references between collections. Index management with hidden indexes and usage stats, an index review, explain plans, a profiler, server monitoring and running operations.

**Automate.** Save exports, imports, compares, dumps, migrations and scripts as **tasks**, schedule them, run them in the background while the app is closed, or start them from the command line.

**AI, on your terms.** The assistant is off until you turn it on for a connection and add your own Gemini, Claude or OpenAI-compatible key, or point it at a local model. It sends names, types and query shapes, not your documents, and it calls your provider directly. MotionQL can also act as an MCP server so tools like Claude Code and Cursor can use your open connections, with every write waiting for your approval.

**Safe around production.** Per-connection read-only mode is enforced in the app's background process, not just by hiding buttons, and covers `$out`, `$merge` and write commands. Connections labeled `prod` keep a warning banner on screen. Drops ask you to type the name.

The full list is in the [changelog](/changelog) and the [documentation](/docs).

## What "free" means

- **Free, forever:** connections, the query bar and builder, IntelliShell, the aggregation editor, SQL Query, Query Code, import and export, Compare and Sync, schema tools, indexes and the AI assistant with your own key.
- **Pro, free for 12 months:** SQL Migration, Data Masking, scheduled tasks and MongoDB Atlas management. While the launch offer runs, you renew for another year with one click. If that ever changes, you'll see pricing before your year ends, and everything that's free today stays free.
- **Teams:** team seats are free for now too. An admin invites people and each member gets their own key.

License keys are verified offline with a digital signature. There's no phone-home at launch, and MotionQL works on air-gapped machines. More in the [FAQ](/faq).

## What it isn't yet

We'd rather you hear the gaps from us:

- **Installers aren't code-signed yet.** macOS and Windows will warn you the first time you open the app. The [install guide](/docs/install) shows the two clicks it takes, and how to check the file's checksum.
- **No Linux build in 1.0.** Linux (AppImage and deb) arrives with the next release, as an x64 AppImage and a `.deb` package.
- **No in-app updates yet**, because they require signed builds. Download new versions from the site.
- **MongoDB only.** Connecting to SQL databases as first-class targets is on the roadmap; today, SQL databases are a source for SQL Migration.

## Try it

1. [Create a free account](/register) and grab your Pro key from your account page.
2. [Download MotionQL](/download) and follow the [install guide](/docs/install).
3. Paste a connection string and click **Test**.

If you're coming from another tool, our [migration guide](/blog/move-from-studio-3t-or-compass) walks through moving your connections and habits over, and the [comparison page](/compare) lays out the differences feature by feature.

Questions, bugs or ideas: write to us from the [support page](/support). We read everything.

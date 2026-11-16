MotionQL works with Apache Cassandra 3, 4 and 5, ScyllaDB and DataStax Enterprise over the CQL native protocol. The server is detected when you connect. DataStax Astra DB can be reached with its secure connect bundle, but Astra support is **cloud-only and untested**: it has only been checked against mocks, never against a live Astra database.

## Connecting

- Click **+** under **Apache Cassandra / ScyllaDB** in the sidebar.
- **Cassandra / ScyllaDB:** enter one or more **contact points** (comma separated; `host:port` overrides the port), the **port** (9042 by default) and the **local data center**, which `nodetool status` shows. Requests go to the nodes of that data center. Add a user name and password for `PasswordAuthenticator`. Pick a **keyspace** to `USE` on connect and a **default consistency** (LOCAL_ONE when none is set).
- **TLS** turns on encryption. You can choose a CA, a client certificate and a key (PEM files, read when you connect), and you can turn off certificate verification for local servers only.
- **Astra DB (bundle):** choose the `secure-connect-<database>.zip` file, then enter `token` as the client id and the `AstraCS:…` application token as the secret.
- **Test connection** shows the server and its version, the cluster, the data center, the number of nodes and the protocol version. When the test fails, **Ask AI why it failed** explains the error and can offer a fix, such as the port or TLS (see AI help). Passwords and tokens are kept encrypted.
- **Read-only connection** refuses every write: rows, CQL `INSERT` / `UPDATE` / `DELETE` / `BATCH`, DDL and `TRUNCATE`. `SELECT`s still work. **Production mode** shows a colour bar, confirms every write, and asks you to type the name before you drop or truncate anything. `DROP` and `TRUNCATE` always need the name typed. Every write and schema change is written to the audit log.

## Browsing

- Under a connection the sidebar lists the **keyspaces**, read from `system_schema`, with their replication (`Simple, RF 1`, or each data center's factor) and whether durable writes are on. System and virtual keyspaces are grouped apart.
- A keyspace holds **Tables**, **Materialized views**, **Indexes** (SAI and custom index classes are named), **User types**, **Functions** and **Aggregates**. Expand a table to see its columns, marked as partition key (PK), clustering (CK, with ↓ for descending) or static.
- Right-click an object for **Show CREATE …** and **Drop …**. On a keyspace you can also **Create table…** or **Alter keyspace (replication)…**; on a table, **Alter table…**, **Create index…**, **Create materialized view…** and **Truncate…**.

## Rows

- Opening a table shows its **Rows** and **Details**. Rows are read in pages of 25 to 1000 using CQL paging state. The arrows go forward and back, and **Show CQL** shows the exact `SELECT`.
- **Add filter** builds the `WHERE` clause. The builder knows the primary key. It says when a filter reads one partition. When a filter would need **ALLOW FILTERING** (a regular column without an index, or a clustering column without the columns before it), it warns you and explains why. The query only runs with ALLOW FILTERING when you tick **Run with ALLOW FILTERING anyway**.
- A **consistency** picker sets the read consistency for the page.
- Double-click a row to edit it. The primary key cannot change, and only the columns you changed are written. **Add row** inserts a row (an upsert, or **IF NOT EXISTS** as a lightweight transaction), with an optional TTL. Tick rows and **Delete selected** removes them by primary key. It asks first, and in production mode it asks you to type the table name.
- **CSV** and **JSON** export every row that matches the current filter.

## CQL console

- Open it with **New CQL console** on a connection, **Query in CQL** on a table, or **Mod+T** on a Cassandra tab. It has highlighting and completion of keywords, types, functions, keyspaces, tables and columns.
- **Ctrl+Enter** runs the statement under the cursor. If you select several statements, they run in order, each with its own result. You can set the keyspace, the consistency and the page size. **More rows** continues a large result.
- **Tracing** turns on `TRACING` for each statement and shows the trace events: the activity, the node and the elapsed time, on a timeline.
- Statements that use ALLOW FILTERING are flagged. Writes ask first in production mode and are refused on read-only connections. History is kept per connection.

## Schema changes

- **Create keyspace…** and **Alter keyspace…** set SimpleStrategy or NetworkTopologyStrategy, the factor for each data center, and durable writes.
- The **table designer** sets the columns and their types, the partition key, the clustering columns and their order, static columns, compaction (size-tiered, leveled, or time window with its window), the default TTL, `gc_grace_seconds` and a comment. It previews the exact CQL first. **Alter table** adds and drops columns and changes the options. Dropping a column asks first.
- **Create index…** creates a secondary index or an SAI index on a column, collection values, keys, entries or a FULL frozen value. **Create materialized view…** builds a view from a base table and its full primary key.
- **Drop** (keyspace, table, view, index, type, function, aggregate) and **Truncate** ask you to type the name.

## Cluster panel

**Cluster, nodes and settings** on a connection shows the **nodes** (address, status, data center, rack, version, tokens, host id and schema version), **table sizes** from `system.size_estimates` (it warns about large partitions), and, on Cassandra 4 and later, the **settings**, **clients**, **thread pools** and **caches** virtual tables.

## AI help

When AI is allowed for the connection, **Ask AI** on a table or in the CQL console can:

- write CQL from plain English;
- explain or fix a statement;
- rewrite a query that needs ALLOW FILTERING into one that reads one partition;
- advise on modelling (a query table for each access pattern, partition size, clustering order).

It sends the table's schema, keys, indexes and size estimate, never rows. Statements it writes are checked before you see them. The check flags writes on read-only connections, destructive statements, ALLOW FILTERING, and reads that touch every partition. The statements are only put in the console, never run. The [MCP server](/docs/ai-mcp) has read-only tools for open Cassandra connections: `cassandra_list_tables`, `cassandra_describe_table`, and `cassandra_select` (one `SELECT` of at most 20 rows; values are masked unless the connection allows them).

MotionQL works with Elasticsearch, OpenSearch, Elastic Cloud and Elasticsearch Serverless, Amazon OpenSearch Service and OpenSearch Serverless. The distribution and version are detected when you connect and shown as a badge; features the server lacks (SQL without the plugin, ILM vs ISM, hot threads on managed domains) are hidden or marked as not available.

## Connecting

- Click **+** under **Elasticsearch & OpenSearch** in the sidebar.
- Enter one or more node URLs (`https://host:9200`, an optional path prefix for a proxy), or an Elastic Cloud **Cloud ID**.
- Sign in with a user and password, an **API key**, a **bearer token**, **AWS SigV4** (access keys with an optional session token, a named AWS profile, or the default credential chain; the region and service, `es` or `aoss`, are read from the endpoint name), or no authentication.
- TLS: a custom CA, or (for test servers only) skip verification. An **SSH tunnel** is optional.
- Passwords, keys and tokens are kept encrypted. A saved secret is only reused for the same host, Cloud ID, sign-in method and user.
- **Read-only connection** refuses every request that changes documents, indices, templates or the cluster, in the editors, the console and the panels. Unknown POST, PUT and DELETE requests count as writes. **Production mode** asks you to type the index name before deleting or closing an index and before other dangerous requests (`_delete_by_query`, `_update_by_query`, requests on wildcard patterns, cluster settings).
- **Test** shows the detected service, version and capabilities.

## Browsing

- Under a connection the sidebar lists **indices** (health, document count: top-level documents, not counting the nested documents Lucene stores for `nested` fields, as in the index tab and size), **data streams**, **aliases**, **templates** (index, component and legacy) and **lifecycle policies** (ILM on Elasticsearch, ISM on OpenSearch). Hidden and system indices are left out.
- Opening an index shows its **Documents**, **Mapping** and **Settings and stats**.
- **Documents:** a grid paged with `search_after` over a point in time, so pages stay stable while documents change. Filter with a Query DSL query or a query string, and sort by any sortable field. Double-click a row to see the document as JSON.
- **Edit** a document in the JSON view and **Save**. The save uses the sequence number and primary term, so it fails if someone else changed the document in the meantime. **New document** and **Delete document** ask for confirmation first.
- **Mapping** shows the fields as a tree, with object, nested and multi-fields (such as `title.keyword`).
- The index menu has **Refresh index**, **Force merge…**, **Reindex into…**, **Close index** / **Open index**, **Delete index…** and **Create index…** (on the connection). Each one asks first, is refused on read-only connections and is written to the audit log.

## Documents tab

- The pager shows **Page X of Y** with first, previous, next and last. Pages stay stable while documents change because they are read over a point in time. Pages past the index's `index.max_result_window` (10,000 by default) still open: MotionQL walks to them with `search_after`, up to document 100,000. Past that, narrow the query or reverse the sort.
- Right-click a cell to filter on its value (equal, not equal, exists, missing), or a column header to keep only documents with or without that field. Click a header to sort. The filters are added to the query box.
- **Explain** shows how the server rewrote the query (`_validate/query?explain`) and, where available, the Profile API's time per shard. **Query Code** gives the same search as curl, Python, JavaScript or a Kibana console request. **AI Assistant** writes or explains the query from the mapping.
- Tick rows to get the bulk bar: **Delete N** deletes the selection, and **Update N…** runs a Painless script on it (`_update_by_query`). **Update…** in the toolbar runs a script on every document the query matches. Both show the count and ask you to type it (`delete 3`, `update 120`), are refused on read-only connections and are written to the audit log.
- A connected cluster with no indices shows **Create index** (not on read-only connections), **Console** and the command that loads the demo data from the test-data kit.

## Console

- Write requests as in Kibana Dev Tools, for example `GET /products/_search` followed by a JSON body. Triple-quoted strings (`"""…"""`), `#` comments and several requests per tab all work. `_bulk` and `_msearch` take NDJSON bodies.
- Completion offers methods, endpoints, index names, Query DSL keys and aggregation types, and the fields of the index's mapping.
- **Ctrl+Enter** runs the request under the cursor. A search shows its hits as a table, its aggregations as tables and charts, and the raw JSON.
- **Profile** runs the search under the cursor with the Profile API and shows the time spent in each query and collector on each shard.
- **SQL** mode (Elasticsearch SQL or the OpenSearch SQL plugin) runs `SELECT` statements with paging, and **Translate** shows the Query DSL a statement runs as.

## Panels

Open them from the connection's menu in the sidebar.

- **Cluster health:** status, nodes, shard counts and pending tasks. **Documents** counts top-level documents (`_count` over the open and hidden indices). The Lucene doc count from `_cluster/stats` is shown under it when it differs, because Lucene stores every object of a `nested` field as a separate document. When the user may not run `_count`, the card shows the Lucene count and says so. The index list tooltip also shows both figures.
- **Nodes:** roles, heap, CPU, load and disk of each node.
- **Shards:** every shard with its state, size and node. **Why unassigned?** (or the button on a shard's row) shows the allocation explanation.
- **Tasks:** running tasks. Cancellable tasks can be cancelled after confirmation.
- **Hot threads:** the busiest threads of each node.
- **Snapshots:** repositories and their snapshots. Deleting a snapshot asks first; in production mode you type its name.

## Administration

Open these from the connection's menu in the sidebar (Discover from an index's menu). Every change asks first, is refused on read-only connections and is written to the audit log by object name, never with passwords, keys or documents.

- **Discover** (a tab on each index next to Documents, Mapping and Settings): a query bar for **KQL**, **Lucene** query strings or **Query DSL**, a time field with quick ranges, a date histogram of the hits, and a field list with each field's **top values**. Click a value to filter on it (or out of it); expand a hit to see the document. **Visualize** turns the current query into a bar, line or pie chart (count over time, or the top values of a field) and adds it to a dashboard, where it refreshes like any other widget.
- **Security** (Elasticsearch security or the OpenSearch security plugin): **Users** (roles, full name, email, enabled; passwords are only sent to the cluster), **Roles** with cluster privileges, index privileges, field level security and document level security queries (OpenSearch: FLS and masked fields), **Role mappings**, and **API keys** with an expiry and role descriptors. A new key's secret is shown once; invalidating a key asks first. Reserved users and roles are read-only.
- **Lifecycle policies:** ILM (Elasticsearch) or ISM (OpenSearch) policies on a phase timeline. Edit each phase's rollover, force merge, shrink, replicas, read-only, searchable snapshot and delete age in a form, or the JSON. Managed policies are read-only; **Explain** shows where an index is in its policy.
- **Templates:** composable index templates, component templates and legacy templates, with **Simulate** to see the settings, mappings and aliases an index name would get.
- **Ingest pipelines:** edit a pipeline's JSON, load the first documents of an index as samples (or write your own) and **Simulate**: each document shows each processor's result, errors included, and the document it ends as.
- **Snapshots → Restore:** pick the indices and data streams of a snapshot, rename them on the way (pattern and replacement, `restored-$1` by default, with a preview of the names), include the global state or aliases, allow a partial restore and override index settings. Restoring over an open index fails on the server, so renaming is on by default. The restore asks first and is followed in the **Shards** panel.
- **Ask AI** on Security (explains who can reach what and drafts roles), Lifecycle policies (suggests a policy from the index's size and ingest rate) and Ingest pipelines (explains or fixes a pipeline from the simulate errors). Drafts fill the form; nothing is saved until you save it.

## Import, export and migration

- **Import / export…** exports an index, optionally filtered by a query and limited to some fields, as **NDJSON** (one document per line, with `_id`) or **CSV**. The scroll API reads the index, so big indices use little memory. It imports NDJSON (export files or `_bulk` bodies) and CSV into an index with `_bulk`. Imports are refused on read-only connections and ask first.
- **Migrate to MongoDB / SQL…** (Pro, with the SQL Migration license) copies an index into a MongoDB collection or a SQL table (PostgreSQL, MySQL, MariaDB, SQL Server, SQLite or DuckDB). `_id` becomes the id; date fields of the mapping become dates. For SQL, objects can be flattened into columns, and the table can be created for you. **Preview** writes nothing. Writes are upserts by id, and read-only targets refuse the run.

## AI help

When AI is allowed for the connection, **AI help** in the console writes a request from plain English using the index's mapping, explains or fixes the request under the cursor, explains a mapping, or explains the cluster's health. Literal values in your requests are replaced by placeholders unless the connection allows sending them. Requests the AI writes are checked like console requests: they are marked when they change data, and dangerous ones still ask first. The [MCP server](/docs/ai-mcp) has read-only tools for open search connections: listing indices, reading mappings, running a search of at most 20 hits (document values are masked unless allowed) and reading cluster health.

- **AI chat** and **Ask your database** (on the connection's menu) work on search connections. The chat lists indices, reads mappings and runs masked searches, and proposes a request you open in the console. Ask your database writes one read-only search (at most 500 hits) and runs it when you click **Run**.
- **Why did this fail?** under a failed connection test explains the error and can fix the port or the scheme (http / https) of the node URL, with **Undo**.
- **Explain this panel** (the AI button) on Discover, Shards, Snapshots and Templates, and **Ask AI why there are no results** when a search in the console or the documents tab finds nothing.
- **Inline completion** suggests the rest of the request as ghost text in the console. It never suggests a write on a read-only connection.

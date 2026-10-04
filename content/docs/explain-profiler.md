## Explain a query

You can explain a query from three places:

- the **Explain** tab of a collection tab;
- IntelliShell, with `.explain()` or `.explain("executionStats")`;
- the aggregation editor.

MotionQL shows the **winning plan** as a tree, with the index used, the number of **documents examined** and the execution time.

## What to look for

| Stage | Meaning |
|---|---|
| `COLLSCAN` | The server read every document in the collection. Fine for small collections; slow for big ones |
| `IXSCAN` | The server walked an index to find matching documents |
| `FETCH` | The server loaded full documents after an index scan |
| `SORT` | The results were sorted in memory, because no index provides the requested order |
| `PROJECTION_COVERED` | The index alone answered the query; no documents were loaded |

A healthy query usually returns about as many documents as it examines. If **documents examined** is far higher than **documents returned**, an index on the filtered fields will probably help.

The [query bar](/docs/query-bar) warns you before you run: a **COLLSCAN** or **in-memory sort** badge appears on filtered or sorted queries that would scan or sort without an index. It's checked with a `queryPlanner` explain, which doesn't execute the query.

For a longer walkthrough, read [Reading MongoDB explain plans: COLLSCAN vs IXSCAN](/blog/reading-mongodb-explain-plans).

## Query profiler

The **Query Profiler** uses MongoDB's database profiler to find slow operations.

1. Open **Query Profiler** from the command palette.
2. Set the **profiling level**: off, slow operations only (above a threshold in milliseconds), or all operations.
3. Run your workload, then look at the **summary** of slow operations and the individual samples.
4. **Clear** the profiling data when you're done.

The profiler writes to `system.profile` and adds some load, so prefer "slow operations only" on busy servers.

## Server monitoring and operations

- **Server Monitoring:** live server metrics.
- **Running Operations:** list current operations and **kill** one. Killing is a write, so it's blocked on read-only connections.
- **Topology:** replica set members and their roles, and the shards of a sharded cluster.

## AI help

With **Allow AI** on for the connection, the assistant can **explain a plan** in plain words and suggest indexes. It receives the shape of the plan, not your documents. See [AI assistant](/docs/ai-mcp).

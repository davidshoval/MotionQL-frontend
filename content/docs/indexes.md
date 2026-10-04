## Manage indexes

Open **Indexes** from a collection's context menu. You can:

- **List** every index with its keys, options and size;
- **Create** an index with any key type (ascending, descending, compound, multikey, text, `2dsphere`, hashed, wildcard) and options such as unique, partial filter, sparse, TTL and collation;
- **Drop** an index;
- **Hide** and **unhide** an index. A hidden index is kept up to date but the query planner ignores it, so you can test the effect of dropping it without rebuilding it later;
- See **usage statistics** from `$indexStats`: how many times each index was used since the server started.

While an index builds, MotionQL shows **live build progress**, per shard when you're connected through `mongos`. For a sharded collection it also shows the **shard key** and the index that backs it.

Creating, dropping and hiding indexes are writes and are blocked on [read-only connections](/docs/connection-safety).

## Index Review

**Index Review** analyzes a collection's indexes and points out:

- **unused** indexes (no recorded use);
- **duplicate** or redundant indexes, such as `{ a: 1 }` when `{ a: 1, b: 1 }` also exists;
- **missing** indexes suggested by your query patterns.

With **Allow AI** on for the connection, the assistant can add commentary to the review. Save a review as a scheduled [task](/docs/tasks-cli) to keep an eye on it.

Before you drop an index flagged as unused, remember that usage statistics reset when a server restarts and are kept per server. Check every member of a replica set, or hide the index first and watch for slow queries.

## Related

- [Explain plans and the profiler](/docs/explain-profiler) to see whether a query uses an index.
- The blog post [Reading MongoDB explain plans: COLLSCAN vs IXSCAN](/blog/reading-mongodb-explain-plans).

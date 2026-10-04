A slow MongoDB query almost always has the same root cause: the server is reading far more data than it returns. The **explain plan** tells you whether that's happening and why. This post walks through how to read one, with a focus on the two stages that matter most: `COLLSCAN` and `IXSCAN`.

## Getting an explain plan

In mongosh (or MotionQL's IntelliShell):

```js
db.orders
  .find({ customerId: 4182, status: "paid" })
  .sort({ createdAt: -1 })
  .explain("executionStats")
```

There are three verbosity levels:

| Verbosity | What it does |
|---|---|
| `"queryPlanner"` | Chooses a plan and shows it. **Doesn't run the query.** Safe on production |
| `"executionStats"` | Runs the winning plan and reports what it did: documents and keys examined, time taken |
| `"allPlansExecution"` | Also reports partial statistics for the candidate plans that lost |

Start with `executionStats` on a non-production copy, or `queryPlanner` when you can't afford to run the query.

In MotionQL, the **Explain** tab of a collection tab shows the same plan as a tree. MotionQL also runs a `queryPlanner` explain in the background for filtered or sorted queries and shows a **COLLSCAN** or **in-memory sort** badge before you run them.

## The plan is a tree of stages

The part to read is `queryPlanner.winningPlan`. It's a tree: each stage passes documents (or index keys) to its parent. Read it from the innermost stage outwards. A typical indexed query looks like:

```text
FETCH            ← loads the full documents
└── IXSCAN       ← walks the index { customerId: 1, status: 1 }
```

The stages you'll see most:

| Stage | What it means |
|---|---|
| `COLLSCAN` | Reads every document in the collection, in storage order |
| `IXSCAN` | Walks a range of an index to find matching keys |
| `FETCH` | Loads the full document for each key the index scan found |
| `SORT` | Sorts results in memory because no index provides the order |
| `PROJECTION_COVERED` | Answers the query from the index alone, without loading documents |
| `LIMIT`, `SKIP` | Apply limit and skip |
| `SHARD_MERGE`, `SHARDING_FILTER` | Combine results from shards, and drop orphaned documents |

On recent MongoDB versions you may also see `EXPRESS_IXSCAN` or `IDHACK` for simple lookups by `_id` or a unique index. Those are fast paths and nothing to worry about.

## COLLSCAN: reading everything

```text
COLLSCAN
  filter: { customerId: { $eq: 4182 }, status: { $eq: "paid" } }
```

A collection scan reads every document and checks each against the filter. Its cost grows with the size of the collection, not with the number of results. On a 50-document lookup table it's fine. On a collection with millions of documents it's usually the reason the query is slow, and it competes for disk and cache with everything else on the server.

A `COLLSCAN` is expected when:

- the collection is small;
- the query has no filter (you asked for everything);
- you're returning most of the collection anyway.

Otherwise, it means **no index matches the query's filter**.

## IXSCAN: using an index

```text
FETCH
└── IXSCAN
      keyPattern: { customerId: 1, status: 1 }
      indexBounds: { customerId: ["[4182, 4182]"], status: ["[\"paid\", \"paid\"]"] }
```

An index scan only looks at the part of the index that can match. `indexBounds` shows that range. Tight bounds like `[4182, 4182]` are what you want. Bounds like `[MinKey, MaxKey]` mean the index is being walked end to end, which is often little better than a collection scan.

## The three numbers that matter

From `executionStats`:

| Field | Meaning |
|---|---|
| `nReturned` | Documents returned |
| `totalKeysExamined` | Index keys read |
| `totalDocsExamined` | Documents read |

The rule of thumb: **in a well-indexed query, all three are close to each other.**

- `totalDocsExamined` is much larger than `nReturned`: the server reads documents it then throws away. Either there's no suitable index (`COLLSCAN`), or the index only covers part of the filter and the rest is checked after the `FETCH`.
- `totalKeysExamined` is much larger than `nReturned`: the index is being scanned over a wide range. Field order in a compound index is usually the cause.
- `totalDocsExamined` is `0` and the stage is `PROJECTION_COVERED`: a covered query. The index answered everything.

## Fixing a COLLSCAN

For the query above, an index on the filtered fields turns the scan into an index scan:

```js
db.orders.createIndex({ customerId: 1, status: 1 })
```

The query also sorts by `createdAt`. Without that field in the index, the plan gets a `SORT` stage: the server collects every match and sorts in memory, which is slow for large result sets. Past the server's memory limit for sorts, it either spills to disk or fails, depending on your MongoDB version and settings. Adding the sort field to the index removes the in-memory sort:

```js
db.orders.createIndex({ customerId: 1, status: 1, createdAt: -1 })
```

A common guideline for compound index field order is **Equality, Sort, Range** (ESR): fields you match exactly first, then fields you sort by, then fields you filter with ranges (`$gt`, `$lt`, `$in` over many values). MongoDB's documentation covers ESR in detail.

## Before you add an index

Indexes aren't free: each one uses memory and disk, and slows writes a little. Before creating one:

- **Check for an existing index** that a small change could reuse. An index on `{ customerId: 1, status: 1 }` already serves queries on `customerId` alone, because it's a prefix.
- **Look for unused indexes** to drop at the same time. `$indexStats` shows how often each index is used since the server last started.
- **Build on a busy production server with care.** Index builds use resources while they run.

In MotionQL, [Index Review](/docs/indexes#index-review) lists unused, duplicate and missing indexes for a collection, and **hiding** an index lets you see what happens without it before you drop it.

## A quick checklist

1. Run `explain("executionStats")` on the slow query.
2. Find the innermost stage. `COLLSCAN` on a large collection means no index matches the filter.
3. Compare `nReturned`, `totalKeysExamined` and `totalDocsExamined`.
4. Look for a `SORT` stage: the sort isn't using an index.
5. Create or adjust a compound index (Equality, Sort, Range), and explain again.

Further reading: the [explain plans and profiler docs](/docs/explain-profiler), and the explain results reference in MongoDB's own documentation.

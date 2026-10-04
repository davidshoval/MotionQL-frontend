Every collection tab starts with a query bar. Write each part in MongoDB shell syntax, the same as in mongosh.

## Fields

| Field | Example |
|---|---|
| **Filter** | `{ status: "A", qty: { $lt: 30 } }` |
| **Projection** | `{ name: 1, email: 1, _id: 0 }` |
| **Sort** | `{ createdAt: -1 }` |
| **Skip** | `20` |
| **Limit** | `50` |

Shell types work as you'd expect: `ObjectId("…")`, `ISODate("2026-01-01")`, `NumberLong(…)`, `NumberDecimal("…")`, regular expressions such as `/^acme/i`.

The input is **parsed as literal values, never executed as code**. Pasting a query can't run JavaScript on your computer. Operators that run JavaScript on the server (`$where`, `$function`, `$accumulator`) are refused unless you allow server-side JavaScript for the connection.

## Options

Open **Options** to set:

- **Collation** (locale, strength and so on);
- **read concern** and **write concern**;
- **read preference**;
- **`maxTimeMS`**, so a slow query stops on the server instead of running on;
- an index **hint**.

A default `maxTimeMS` and query timeout can be set in **Settings → General**.

## Run and cancel

Press **Mod+Enter** or click **Run**. A long-running query can be cancelled.

## Collection-scan warning

When a filtered or sorted query would scan the whole collection or sort in memory, MotionQL shows a **COLLSCAN** or **in-memory sort** badge. It checks with a `queryPlanner` explain, which doesn't run the query. Click the badge to open the [plan](/docs/explain-profiler) or an [index review](/docs/indexes).

## From here

- **Convert to aggregation:** turn the current find into a pipeline in the [aggregation editor](/docs/aggregation-editor) with one click.
- **Query Code:** generate the same query in mongo shell, Node.js, Python, Java, C#, PHP, Ruby, Go or Rust. The code comes from fixed templates, not AI, so the same query always gives the same code.
- **Explain:** see the winning plan on the **Explain** tab.
- **Build visually:** open the [visual query builder](/docs/visual-query-builder).

Open SQL Query with **Mod+Shift+Q**. Write a `SELECT` against your collections; MotionQL translates it to a MongoDB find or aggregation, shows you the generated query, and runs it.

```sql
SELECT customer, COUNT(*) AS orders, SUM(total) AS revenue
FROM orders
WHERE status = 'paid' AND createdAt >= '2026-01-01'
GROUP BY customer
HAVING COUNT(*) > 5
ORDER BY revenue DESC
LIMIT 20
```

## What's supported

| Clause | Support |
|---|---|
| `SELECT` | Columns, expressions, aliases, `DISTINCT` |
| `FROM` | One collection, plus joins |
| `JOIN` | `INNER JOIN` and `LEFT JOIN`, translated to `$lookup` |
| `WHERE` | `AND`, `OR`, `NOT`, comparisons, `IN`, `LIKE`/`ILIKE`, `BETWEEN`, `IS NULL` |
| `GROUP BY` | Aggregate functions, and `COUNT(DISTINCT …)` |
| `HAVING`, `ORDER BY`, `LIMIT`, `OFFSET` | Yes |

Other `DISTINCT` aggregates (for example `SUM(DISTINCT …)`) aren't supported; only `COUNT(DISTINCT …)` is.

## Read-only

SQL Query only runs `SELECT`. `INSERT`, `UPDATE` and `DELETE` are refused, so it's safe to point at any connection.

## Learn MongoDB from SQL

Because the translation is shown, SQL Query is a good way to learn the MongoDB equivalent of a query you already know. Open the translation in [IntelliShell](/docs/intellishell) or the [aggregation editor](/docs/aggregation-editor) to keep working on it, or generate it as code in nine languages.

## Files

Save and open `.sql` files.

Looking to move data from a relational database into MongoDB instead? See [SQL Migration](/docs/sql-migration).

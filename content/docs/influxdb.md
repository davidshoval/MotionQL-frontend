MotionQL works with InfluxDB 2.x (Flux, and InfluxQL through the v1 compatibility API) and InfluxDB 3 Core and Enterprise (SQL and InfluxQL) over their HTTP APIs. The product and version are detected when you connect. InfluxDB Cloud (the v2 API on `<region>.cloud2.influxdata.com`) works the same way as 2.x, but Cloud support is **untested**: it has only been checked against mocks, never against a live Cloud account.

## Connecting

- Click **+** under **InfluxDB** in the sidebar and pick **InfluxDB 2.x / Cloud** or **InfluxDB 3**.
- Enter the **URL** (`http://localhost:8086` for 2.x, `http://localhost:8181` for InfluxDB 3; a bare host gets the product's port) and an **API token**. For 2.x add the **organization** (its name or ID). A **default bucket** (2.x) or **database** (3) is used when a query does not name one.
- With `https://` you can choose a CA certificate, or turn off certificate verification for local servers only. A **schema lookback** sets how many days back the tree looks for tag and field keys (30 by default).
- **Test connection** shows the product, version and build. When it fails, **Ask AI why it failed** explains the error and can offer a fix, such as the port or `https` (see AI help). Tokens are kept encrypted.
- **Read-only connection** refuses every write: line protocol, deletes, bucket changes, and InfluxQL `DROP` / `DELETE` / `CREATE`. Queries still work. **Production mode** shows a colour bar and confirms every write. Every write, delete and bucket change is written to the audit log.

## Browsing

- Under a connection the sidebar lists the **organizations** (2.x), the **buckets** or **databases** with their retention, and the **measurements** in each. Expand a measurement to see its **tag keys** and **field keys** with their types (float, integer, string, boolean).
- Right-click a bucket for **New query here**, **Data explorer**, **Write line protocol…**, **Series cardinality** and **Delete bucket…** (on 2.x also **Delete data by predicate…** and **Edit retention…**). Right-click a measurement to query or explore it, see its **tag cardinality**, or delete its data. **Create bucket…** (**Create database…** on InfluxDB 3) is on the connection's menu.

## Query console

- **New query** on a connection or bucket opens a console in **Flux**, **InfluxQL** or **SQL** (what the server speaks: Flux and InfluxQL on 2.x, SQL and InfluxQL on InfluxDB 3). It has highlighting and completion of keywords, functions, buckets, measurements, tags and fields.
- The **time range** picker (last 5 minutes to 30 days, or a custom range) fills `v.timeRangeStart`, `v.timeRangeStop` and `v.windowPeriod` in Flux, and `:timeFilter:` and `:interval:` in InfluxQL and SQL, so a saved query works for any range.
- **Ctrl+Enter** runs the selection or the whole editor; **Cancel** stops it. Each result (a Flux `yield`, or an InfluxQL statement) is shown as a **table** or a **chart** with one line per series. The chart draws every series at first (up to eight, one colour each; with more, a note says how many are hidden and the series buttons swap them). **CSV** exports the result; history is kept per connection.

## Data explorer

**Data explorer** builds a query without writing it: pick the bucket, the measurement, the fields, tag filters (any of several values), an aggregate window and function, the tags to keep as separate lines, and whether empty windows are filled. The Flux, InfluxQL or SQL it writes is shown as you go; **Open in console** copies it into a console.

## Writing and deleting

- **Write line protocol…** takes pasted or typed line protocol and a precision. Before anything is written it checks each line and shows the points per measurement, the field types and the time range, with any error by line number.
- **Delete data by predicate…** (2.x) deletes points in a time range that match a predicate such as `_measurement="cpu" AND host="a"`. It shows the predicate and range, and you type the bucket name to confirm. On InfluxDB 3, **Delete table…** drops a measurement after you type its name.
- **Create bucket…**, **Edit retention…** and **Delete bucket…** manage buckets (**Create database…** and **Delete database…** on InfluxDB 3). Deleting a bucket, or making its retention shorter, needs the name typed.

## Health panel

**Health, cardinality, tasks and tokens** on a connection shows `/health` and `/ready`, **series cardinality** per bucket and **tag cardinality** per measurement, **tasks** (2.x) with their recent runs and each run's log, and **users and tokens** (descriptions and permissions only; token values are never read). On InfluxDB 3 it also lists the recent queries from `system.queries`.

## AI help

When AI is allowed for the connection, **Ask AI** in the console or on a measurement can:

- write Flux, InfluxQL or SQL from plain English;
- explain or fix a query;
- advise on the schema: what should be a tag or a field, and what drives series cardinality.

It sends the measurements, tag keys, field keys and their types, never points. Queries it writes are checked before you see them: writes and deletes are flagged, and so are queries without a time range. They are only put in the console, never run. The [MCP server](/docs/ai-mcp) has read-only tools for open InfluxDB connections: `influx_list_buckets`, `influx_describe_measurement`, and `influx_query` (one query that reads, at most 20 rows; values are masked unless the connection allows them).

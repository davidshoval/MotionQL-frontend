MotionQL works with Amazon DynamoDB in any AWS region, and with DynamoDB Local and LocalStack for development. The service is recognised when you connect: on DynamoDB Local, backups and point-in-time recovery are marked as not available instead of failing.

## Connecting

- Click **+** under **Amazon DynamoDB** in the sidebar. With no connections yet, **Connect to DynamoDB Local** fills in `http://localhost:8000`.
- **Amazon DynamoDB:** pick a region (or type any region name), then sign in with the **default credential chain** (environment variables, the default profile, SSO or the instance or container role, like the AWS CLI), a named **AWS profile** (from `~/.aws/config` and `~/.aws/credentials`, including role and `credential_process` profiles), an **SSO profile** (run `aws sso login --profile <name>` first when the session has expired) or **access keys** with an optional session token. An optional endpoint URL covers VPC and FIPS endpoints.
- **DynamoDB Local / LocalStack:** enter the endpoint URL (DynamoDB Local listens on 8000, LocalStack on 4566). No credentials are needed.
- Secret keys and session tokens are kept encrypted, and a saved one is only reused for the same access key id, region and endpoint.
- **Read-only connection** refuses every write: items, PartiQL `INSERT` / `UPDATE` / `DELETE`, table changes, backups, restores and imports. Scans, queries and `SELECT`s still work. **Production mode** confirms every write and asks you to type the table name before deleting a table (or the key before deleting items with PartiQL). A project environment that confirms writes or is read-only applies to DynamoDB connections too.
- **Test** shows the service, the region, the number of tables and, on AWS, the account.

## Browsing

- Under a connection the sidebar lists the **tables** of the region. Expand a table to see its primary key (partition key and sort key with their types), **global** and **local secondary indexes** (keys, projection and status), **capacity** (on-demand or provisioned RCU / WCU), **TTL**, the **stream**, **point-in-time recovery** and **backups**. Click an index to query it.
- Opening a table shows its **Items** and **Details**. Details has the item count, size, table class, ARN, keys, attributes, capacity, an estimate of what a full scan costs, the stream, TTL and recovery settings, and every index with its size and capacity.

## Table metrics

The table's **Details** end with a **Metrics** card read from Amazon CloudWatch: **consumed read and write capacity** per second (with the provisioned capacity as a dashed line on provisioned tables), **read and write throttle events**, and the average, peak and latest **latency** of GetItem, Query, Scan, PutItem, UpdateItem and DeleteItem. Choose a range from the last hour to the last 7 days, or one of the table's global secondary indexes (capacity and throttles of the index). Hover a line for the value of each period. A warning appears when requests were throttled in the range.

The card uses the connection's own region and sign-in; the identity needs the `cloudwatch:GetMetricData` permission. DynamoDB Local, LocalStack and other endpoint overrides publish no CloudWatch metrics, so the card only shows a note for them.

## Search, breadcrumbs and links

DynamoDB connections and the tables the sidebar has listed are found by the sidebar **search** (with the item count of tables already opened), can be **bookmarked**, and appear in **Recent**. A DynamoDB tab shows **connection › table** under the tab strip. In a project, **Find links** reads DynamoDB tables too (key attributes and the attributes of a few sampled items) and suggests links such as `Orders.customer_id → customers.id`; checking a suggestion samples the attribute with a Scan and looks the values up with a PartiQL `IN`. Linked attributes are marked in the items grid and open the related-record panel; a related DynamoDB item opens as a PartiQL `SELECT` of it.

## Scan and Query

- Choose **Scan** or **Query**, and the table or one of its indexes. A Query takes the partition key value and, optionally, a sort key condition (`=`, `<`, `<=`, `>`, `>=`, between or begins with) and the order.
- **Filter** adds conditions on any attribute path (`address.city`, `tags[0]`): comparisons, between, begins with, contains, in, exists, not exists and type checks, joined with AND or OR. **Projection** limits the attributes returned. **Consistent read** is offered on tables and local indexes.
- Results come in pages of 25 to 1000 items; the arrows follow DynamoDB's paging keys. Each page shows the **consumed capacity** (RCU), the items read versus returned, and the time. **Show request** shows the exact Scan or Query request, with its expression placeholders.
- A Scan shows beforehand what reading the whole table costs. Filters do not lower that cost: DynamoDB charges for every item it reads.

## Editing items

- Double-click a row to open the item. Edit it as **DynamoDB JSON** (typed: `{"S": "x"}`, `{"N": "1"}`, sets and binary kept exactly) or as plain **JSON** (a warning lists anything plain JSON cannot keep exactly, such as sets and long numbers).
- **Replace item** writes the whole item (PutItem). **Update expression** runs an UpdateItem such as `SET #s = :v REMOVE note ADD visits :one`, with names and values.
- A **condition** can guard each write: only if the item exists, only if it does not exist, or a custom condition expression (for example a version check). A failed condition leaves the item unchanged.
- **New item** adds one, by default only if no item has that key. Tick rows and **Delete selected** removes them in batches. Deletes ask first; in production mode every write asks. Every write is written to the audit log by table and key, never with the item's values.

## PartiQL editor

- **New PartiQL editor** on a connection, **Query in PartiQL** on a table, or **Mod+T** on a DynamoDB tab.
- Completion offers keywords, functions, statement templates, table and index names, and the attributes of the table in the statement (its keys, plus attribute names seen in a few sampled items).
- **Ctrl+Enter** runs the statement under the cursor. `?` parameters take a JSON array of DynamoDB JSON values. **More items** continues a large result.
- A `SELECT` without an equality on the partition key runs as a full scan; the result says so. `INSERT`, `UPDATE` and `DELETE` are refused on read-only connections and ask first.

## Creating and changing tables

- **Create table…** on a connection: name, partition and sort key, on-demand or provisioned capacity, table class, global and local secondary indexes (keys, projection, capacity), stream, TTL attribute, point-in-time recovery and deletion protection.
- **Edit table…** on a table changes capacity, adds or removes global secondary indexes, and changes the stream, TTL, recovery and deletion protection. Local secondary indexes cannot be changed after a table is created.
- Both show the exact API calls they will make before you confirm. DynamoDB allows one index change per update, so MotionQL runs the calls in order and waits for the table to become active between them. Removing an index asks you to type the table name.
- **Delete table…** asks you to type the table name and is refused when deletion protection is on.

## Backups and restore

**Backups and restore** (on a connection or a table) lists on-demand backups, creates one, deletes one (after typing its name) and restores a backup, or a point in time when point-in-time recovery is on, into a new table. Restores ask first. DynamoDB Local has no backups; the panel says so.

## Import, export and migration

- **Import / export…** exports a table, optionally limited to a number of items, as a **JSON** array, **DynamoDB JSON** lines (the format of DynamoDB's own S3 export) or **CSV**. It imports the same formats into a table with batched writes; CSV key columns take the table's key types. Imports ask first and are refused on read-only connections.
- **Migrate to MongoDB / SQL…** (Pro, with the SQL Migration license) copies a table into a MongoDB collection or a SQL table. The key becomes `_id` (`pk` or `pk#sk`), and DynamoDB types become JSON types. **Preview** writes nothing.

## AI help

When AI is allowed for the connection, **Ask AI** on a table or in the PartiQL editor writes PartiQL from plain English, explains or fixes a statement, explains what a Scan or Query costs and how to read less, and advises on key and index design for the access patterns you describe. It sends the key schema, index definitions, attribute names and types, size and billing mode, and the statement with its values replaced by placeholders (unless the connection allows sending values), never items. Statements it writes are marked when they change data or scan the whole table, and are only put in the editor, never run. The [MCP server](/docs/ai-mcp) has read-only tools for open DynamoDB connections: listing tables, describing a table and running one `SELECT` of at most 20 items (values are masked unless allowed).

- **AI chat** and **Ask your database** work on DynamoDB connections: the chat lists tables, reads key schemas and indexes and proposes a PartiQL statement you open in the PartiQL editor; Ask your database writes one `SELECT` on a listed table and warns when it scans the whole table. Only key names, index names and sampled attribute types are sent, not item values, unless literals are allowed.
- **Why did this fail?** in the connection dialog can fix the endpoint's port or scheme.
- **Ask AI why there are no results** appears when a Query, a filtered Scan or a PartiQL `SELECT` returns no items.
- **Inline completion** in the PartiQL editor suggests one statement; writes only when you have started typing them, and none on read-only connections.

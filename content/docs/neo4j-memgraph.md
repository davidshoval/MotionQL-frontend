MotionQL connects over Bolt to **Neo4j** (Community or Enterprise, 4.4 and 5), **Neo4j Aura** and **Memgraph**. The server is recognised when you connect. Features a server lacks are marked as not available instead of failing: SHOW SERVERS on Community, multiple databases on Memgraph, and so on.

## Connecting

- Click **+** under **Graph databases** in the sidebar, or use **Connect to a local Neo4j** / **Memgraph** when you have no connections yet.
- **Paste a URI** such as `neo4j+s://xxxx.databases.neo4j.io` or `bolt://localhost:7687`. MotionQL fills in the scheme, host, port and TLS from it:
  - `neo4j://` routes across a cluster; `bolt://` talks to one server (use it for a proxy, an SSH tunnel or Memgraph).
  - `+s` turns TLS on with the system CA store; `+ssc` accepts a self-signed certificate.
  - **TLS** can also verify against a CA file you pick.
- **Neo4j Aura** always uses `neo4j+s://` with the user and password the instance generated. Aura is cloud-only: MotionQL's tests cover it with a simulated server.
- **Sign in** with a user and password, a bearer token (SSO) or no authentication.
- **Database:** **Test** runs `SHOW DATABASES`. You can then pick one, or leave it empty to use your home database.
- **SSH tunnels**, **read-only**, **production** and **allow AI** work as they do for SQL connections.
- When a connection fails, **Ask AI why it failed** explains the error (wrong port, TLS on or off, wrong password, routing) and offers fixes.

## Browsing

- Under a connection the tree lists its **databases** with their node counts. Under each database:
  - **Labels**, coloured and counted. A click opens the label browser.
  - **Relationship types**, counted.
  - **Property keys**.
  - **Indexes** and **constraints**. Right-click to drop one.
  - **Procedures** and **functions**.
  - **Schema graph**.
- Right-click a connection or a database for a new Cypher console, the schema graph, creating an index or constraint, and the server tab.

## Cypher console

- Open it from **New Cypher console** on a connection, by clicking a database, or with **Mod+T** on any graph tab.
- **Ctrl+Enter** runs the statement under the cursor (or the selection). **Explain** shows the plan without running the statement. **Profile** runs it and shows rows and DB hits for each operator, in the same plan viewer as SQL. The **Rows** box limits how many rows are kept.
- **Completion** offers keywords, functions, the database's labels, relationship types and property keys, parameters, and procedures after `CALL`.
- **Parameters:**
  - `:param name => expression` evaluates the expression on the server.
  - `:params {"a": 1}` replaces all parameters, `:params` lists them and `:param clear` clears them.
  - The **Parameters** panel edits values as JSON. Temporal values use `{"$type": "date", "value": "2025-01-31"}`.
  - `2.0` (with a decimal point or an exponent) is sent as a FLOAT and `2` as an INTEGER. Whole-number FLOAT properties read from the database show as `2.0` and stay FLOAT when you edit the node.
  - A statement that uses an unset `$parameter` is not sent.
- `:use <database>` switches the database; the toolbar picker does the same.
- **History** keeps the last 100 statements per connection; a click puts one back in the editor.
- **Cancel** stops a running query and terminates its server transaction.
- **Read-only connections** run reads in read transactions and refuse anything that writes. The server's own `EXPLAIN` decides what writes. **Production** connections ask before a write.

## Results

- **Graph:** a force-directed view of the nodes, relationships and paths in the result, coloured by label.
  - Click a node or relationship to see its properties in the inspector.
  - Double-click a node (or use **Expand**) to load its neighbours.
  - Drag a node to move it; it stays pinned. **Unpin** releases all nodes.
  - The mouse wheel zooms, dragging the background pans, and **Fit** shows everything. **Hide** removes a node from the view.
- **Table:** the rows in the same grid as SQL, with **Record** and **JSON** views. **Export ▾** saves CSV or JSON.
- **Plan** and **Summary** show the plan, counters ("3 nodes created"), server timings and notifications (for example a cartesian product warning).

## Label browser

- Shows the nodes of a label, or the relationships of a type, a page at a time. You can filter on a property (contains), sort by a property, and switch between table and graph.
- **Editing a node:** click it. Edit its labels and typed properties (auto, string, integer, float, boolean, date, datetime or JSON); an empty value removes the property. **New node** creates one.
- **Deleting:**
  - **Delete** removes a node without relationships.
  - **Delete with relationships** runs `DETACH DELETE`, and always asks you to type `DETACH DELETE`.
  - Deleting a relationship asks first.
- Writes are refused on read-only connections, confirmed in production, and written to the audit log without property values.

## Schema

- The **schema graph** draws `db.schema.visualization()`: one node per label with its count, and the relationship types between labels. Its inspector lists each label's indexes and constraints.
- **Indexes and constraints** lists every index (type, properties, state, reads) and constraint. **Index or constraint** opens a guided dialog with a statement preview:
  - **Indexes:** range, text, point, full-text and vector.
  - **Constraints:** unique, key, not null and property type.
  - On Memgraph, the dialog writes Memgraph's syntax.
- Dropping an index or constraint asks you to type its name.

## Server tab

- **Transactions:** `SHOW TRANSACTIONS`, with your own console runs marked. **Terminate** asks you to type the transaction id; it is refused on read-only connections and audited.
- **Database size:** node, relationship, label, type, property key, index and constraint counts, and the store size where the server reports it.
- **Settings:** `SHOW SETTINGS`, with a filter.
- **Servers:** `SHOW SERVERS` on Enterprise and Aura.

## AI help

- The AI card in the console can:
  - write Cypher from a description;
  - explain or fix the current statement (it opens on **Fix** after an error);
  - read an EXPLAIN / PROFILE plan;
  - advise on the graph model.
- It sends label and relationship type names with counts and property types, the `(:A)-[:TYPE]->(:B)` patterns and the indexes. It never sends node or relationship data.
- Statements it writes are checked like the console checks them, and are never run for you.

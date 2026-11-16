A notebook keeps notes, queries and charts together in one tab, across SQL, MongoDB and Redis connections. Start one with **New Notebook** in the command palette, **New notebook** on the welcome screen, or **New notebook** in the context menu of a SQL connection or schema, a MongoDB connection, database or collection, or a Redis connection. Started from a connection, the notebook takes it as its default and opens with a first cell for it.

**Cells.** Add cells with the bar at the end (or the **+** between two cells):

- **SQL**: runs on the notebook's default SQL connection and schema, or on the connection and schema chosen in the cell.
- **MongoDB**: a find, an aggregation or shell commands (`use`, `show collections`, `db.orders.find({...})`, `db.orders.aggregate([...])`).
- **Redis**: one command per line, on the chosen connection and logical database. Lines starting with `#` or `//` are comments.
- **Markdown**: notes. Headings, lists, code, bold, italic and `https` links are shown.
- **Chart**: draws a result of an earlier cell with the same chart controls as the SQL result chart (bar, line, area, pie, scatter or a grouped table).
- **AI**: write a question, and the existing AI assistant turns it into a SQL, MongoDB or Redis cell for the chosen connection. It follows the connection's AI policy and masks literals as everywhere else.

Every cell has a name (`cell_2` and so on). Rename it in its header.

**Running.**

- **Run** a cell, or press Ctrl/Cmd+Enter in its editor.
- **Run from here** runs that cell and every cell after it.
- **Run all** runs the whole notebook.
- Cells run one at a time. A batch stops at the first error.
- **Cancel** stops the running cell on the server.
- Statements that change or drop data ask for confirmation first, as in the editors.
- Read-only connections run reads only.

**AI inline completion.** With **Settings > AI > Inline completion** on, SQL and MongoDB cells get the same ghost text as the SQL editor and the MongoDB shell, for the cell's connection (and schema, or database). Tab accepts, Esc dismisses. Redis cells and cells whose connection is not connected get none.

**Results are a snapshot.** Each cell keeps up to 500 rows (and 100 columns) of its last run, saved with the notebook along with the time it ran. Run a cell again to refresh it. **Clear results** removes every kept result.

**Using earlier results.** On DuckDB and SQLite a cell can query an earlier cell's kept result by its name, for example `SELECT city, SUM(total) FROM cell_2 GROUP BY city`. You can also join it with real tables. The result shows **from cell_2** when this happened. Only reading statements read earlier results.

**Saving and sharing.**

- **Save** writes a `.mqnb` file. It is JSON with the cells and their kept results. **Open** reads one back.
- **Save to folder** (shown once a workspace folder is chosen) saves it in the workspace folder under `notebooks/`. It opens from the Workspace panel, and its cells find connections by name on another computer.
- **Share to team…** shares it on a Team Server; results are left out when they are too large.
- **Export** writes Markdown or a standalone HTML page (light and dark, charts as images) with every cell and its snapshot.

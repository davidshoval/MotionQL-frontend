MotionQL also works with PostgreSQL, MySQL, MariaDB, SQL Server and Oracle directly. PostgreSQL and MySQL get the most testing.

## Connecting

- In the Connection Manager, click **New SQL Connection**. You can also click **+** under **SQL databases** in the sidebar.
- Pick the engine, then enter the host, port, database, user and password, TLS, and optionally an SSH tunnel.
- Passwords are kept encrypted in the OS keychain, like MongoDB secrets.
- **Read-only connection** blocks writes and DDL. Machine policy can also force read-only.

## Browsing

The sidebar tree shows each connection's schemas (MySQL and MariaDB: its databases), with tables and views. Expand a table to see its columns and indexes.

For PostgreSQL, **Other databases** lists the other databases on the server you may connect to. Each opens with the same connection settings.

## SQL editor

To open one, use the code icon on a connection, schema or table.

- **Running SQL:**
  - **Ctrl/Cmd+Enter** runs the selection, or everything.
  - **Ctrl/Cmd+Shift+Enter** runs the statement under the cursor.
  - **Cancel** stops a running query.
- **Autocomplete** offers tables, views and columns from the selected schema, plus keywords.
- **Results:**
  - Each statement that returns rows gets its own result tab, with the row count and duration.
  - **Messages** shows row counts, notices and errors. The failing statement is marked in the editor.
  - **Max rows** sets how many rows are kept per result; the full count is still shown.
- **Export:** results export to **CSV, JSON or Excel**.
- **Files:** open and save `.sql` files.
- **Sessions and transactions:**
  - Each editor tab has its own server session, so `BEGIN`/`START TRANSACTION`, temp tables and `SET` stay within that tab.
  - Closing the tab, or moving it to another window, rolls back an open transaction.
  - **Oracle:** each statement commits by default. Turn off **Auto-commit** to keep changes until **Commit** or **Rollback**. `SET TRANSACTION` also starts a transaction.
- **Confirmation:** `DROP`, `TRUNCATE`, `ALTER … DROP`, and `DELETE`/`UPDATE` without `WHERE` ask for confirmation first.
- **Batches:** SQL Server splits batches on `GO` lines.

## Table tab

Click a table in the tree to open it.

- **Data:**
  - Filter with conditions (`=`, `<>`, `<`, `>`, `like`, `in`, `is null`, …).
  - Click a column header to sort.
  - Page through rows; **Count rows** gives the exact total.
- **Editing** (tables with a primary key):
  - Double-click a cell to change it, or set it to NULL, then click **Save changes**.
  - Select rows and click **Delete** to delete them.
  - Each change is saved by primary key and must match exactly one row, or nothing is saved.
  - Tables without a primary key, views, and read-only connections can't be edited.
- **Info:** columns and types, nullability, primary key, indexes, foreign keys and the row estimate.
- **Export** writes every row that matches the filter to CSV, JSON or Excel.

## Policies and audit

- Read-only is enforced by MotionQL and also by the database, inside a read-only transaction.
- Changes are written to the audit log by statement type only. Values and statement text are never logged.


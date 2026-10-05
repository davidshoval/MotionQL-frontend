## The explorer

The tree on the left shows **connections → databases → collections → indexes**.

- Collections load when you expand a database. Badges mark **views**, **time-series**, **capped** and **clustered** collections.
- Search and filter the tree, and keep **favorites** and recently used items at hand.
- Right-click anything for its actions: open, create, drop, rename, statistics, indexes, schema, import and export, compare, copy and more.
- **Create collection** supports capped, validator, collation, clustered, time-series and change-stream pre- and post-image options. **Create view** defines a view from a pipeline.

## Opening a collection

Double-click a collection to open it in a tab. The tab has the [query bar](/docs/query-bar) at the top and the results below. Press **Mod+Enter** to run the query, and cancel it if it takes too long.

## Result views

Switch between three views of the same results:

- **Tree:** expandable documents, best for nested data.
- **Table:** one row per document with a **column picker**. Good for flat data and quick comparisons.
- **JSON:** the raw Extended JSON.

Results are paged. Choose the page size and whether counts are **exact** or **estimated** (faster on big collections) in **Settings → General**. The first rows appear without waiting for the count.

**Load all:** set **Results** in the info bar to **Load all** to stream every matching document into one scrollable list instead of pages. A status line shows how many have loaded, with **Stop loading**. It stops at 200,000 documents or 256 MB by default; change the default mode and both limits in **Settings → General**.

## Split panes and tab groups

Drag a tab to the edge of another pane, or use **Split Right** or **Split Down** on a tab, to see two or more tabs side by side. Every pane keeps its own live results. Secondary panels (previews, stats, help and history) open and close with a button, and each screen remembers your choice. **Ctrl/Cmd+Alt+B** hides the sidebar.

## Editing documents

- **Edit in place:** change a value in the tree or table and save.
- **Insert**, **duplicate** and **delete** documents.
- **Copy** documents as canonical or relaxed Extended JSON, or in shell syntax.

Edits are writes, so they're blocked on [read-only connections](/docs/connection-safety).

## Document history

MotionQL keeps up to **50 earlier versions** of each document you change in the app. Open **Document history** to see what changed and **revert** a change. These copies are stored only on your computer, in MotionQL's data folder.

## Statistics

Database and collection **statistics** (document count, sizes, indexes, storage) are one right-click away in the explorer.

## Command palette

Almost every tool can be opened from the **command palette** with **Mod+K**. Type part of its name, for example "profiler", "compare", "value search" or "mask".

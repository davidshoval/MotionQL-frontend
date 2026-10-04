Imports and exports run as background **jobs** with progress and a cancel button, and large files are streamed rather than loaded into memory.

## Export

Export a whole collection, a view, the results of the current query, or just the documents you selected.

| Format | Notes |
|---|---|
| **JSON** | An array of Extended JSON documents |
| **JSON Lines** | One document per line (`.jsonl`, `.ndjson`). Best for large exports |
| **CSV** | Choose the fields, the delimiter (`,` `;` tab `|`) and how nested fields are flattened |
| **BSON** | Compatible with `mongodump` and `mongorestore` |
| **Excel** | An `.xlsx` workbook |
| **SQL** | `INSERT` statements for generic SQL, MySQL or PostgreSQL |

Exporting as SQL is also how you move MongoDB data into a relational database.

## Import

Import from **JSON**, **JSON Lines**, **CSV**, **Excel**, **BSON** or SQL **`INSERT`** files.

1. Choose the file. MotionQL inspects it first and shows a sample.
2. **Map and type the columns:** `string`, `int`, `long`, `double`, `decimal`, `bool`, `date`, `objectId`, `json`, or **skip** a column.
3. Choose the mode. Documents are matched on `_id` by default, or on the match fields you choose:

| Mode | What happens |
|---|---|
| **Insert** | Inserts every document. A document whose `_id` already exists fails and is counted as failed; the rest still go in |
| **Upsert** | Replaces the matching document, or inserts it if there's no match |
| **Replace** | Replaces matching documents only; documents with no match are not inserted |
| **Merge** | Sets the imported fields on the matching document and keeps its other fields; inserts it if there's no match |

Imports are writes and are blocked on [read-only connections](/docs/connection-safety).

## Tips

- **Type errors on import:** set column types explicitly, for example `string` for ZIP codes that start with 0, or `date` for timestamps.
- **Slow exports:** add a filter or projection, or export as JSON Lines or BSON instead of Excel.
- **Repeat it:** save an import or export as a scheduled [task](/docs/tasks-cli).

Schema reports have their own export (CSV, Markdown or HTML) on the [schema tools](/docs/schema-tools) page.

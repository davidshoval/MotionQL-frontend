## GridFS

GridFS stores large files in MongoDB as chunks. The GridFS browser lets you:

- browse **buckets** and the files in them;
- **preview** a file without saving it first;
- **upload** files, including by dragging them from your desktop onto the bucket, and **download** them;
- **rename** and **delete** files.

Uploads, renames and deletes are writes and are blocked on read-only connections.

## Views

Create, edit and drop **views** from an aggregation pipeline. In the explorer, views are marked with a badge; open them like any collection to query them.

## Transactions

Group several write operations and run them together in a transaction. Choose a mode:

| Mode | What happens |
|---|---|
| **Dry run** | Runs the operations, then aborts. Nothing is saved |
| **Review** | Runs the operations and lets you inspect the result, then **commit** or **abort** |
| **Commit** | Runs and commits |

Transactions need a replica set or a sharded cluster.

## Watch changes

Open a **change stream** on a collection, a database or the whole deployment, and see insert, update, replace and delete events as they happen.

## Oplog

If your role can read `local.oplog.rs`, **Oplog & Change History** lets you filter entries by namespace and operation type, export them, or replay selected operations (with confirmation; blocked on read-only connections). Hosted services that hide the oplog, such as Atlas shared tiers, can use **Watch Changes** instead.

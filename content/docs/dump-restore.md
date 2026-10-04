Open **Copy, Dump & Restore** from the command palette (**Mod+K**).

## Copy a collection

Copy a collection to another database, on the same connection or a different one. Useful for moving test data between environments.

## Dump

Dump a database to:

- a **folder in mongodump layout**: BSON plus metadata per collection, optionally gzipped;
- **one export file per collection** (JSON, CSV or SQL);
- a **single archive file**, like `mongodump --archive`, optionally gzipped like `--archive --gzip`.

The output works with MongoDB's own tools: `mongorestore --archive` reads a MotionQL archive.

```sh
mongorestore --archive=shop.archive --gzip
```

## Restore

Restore from a mongodump folder or a `mongodump --archive` file, gzipped or not. MotionQL asks for confirmation before it overwrites existing data, and checks archives against their checksums while restoring.

Restore is a write, so it's blocked on [read-only connections](/docs/connection-safety).

## Scheduled backups

Save a dump as a [task](/docs/tasks-cli) and run it daily or weekly. With **one folder per run**, each run writes a new `motionql-dump-<UTC time>` folder, and **keep last N** deletes older run folders. It only ever deletes folders MotionQL created, never your own files.

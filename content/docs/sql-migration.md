**SQL Migration** imports tables from a relational database into MongoDB. It's a Pro feature, included in the [free Pro key](/docs/activate).

## Supported sources

PostgreSQL, MySQL, MariaDB, Microsoft SQL Server and Oracle. The drivers are bundled; Oracle runs in thin mode, so no Oracle client is needed.

For other databases (IBM Db2, SAP ASE, SQLite), export the tables to CSV and use [Import](/docs/import-export).

## Migrate step by step

1. **Add a source.** Save the SQL connection: host, port, database, user and password (encrypted), and a TLS mode of `disable`, `require` or `verify` with an optional CA file. The source is always read in a read-only session.
2. **Introspect** the schema. MotionQL lists tables, columns, types, primary keys and foreign keys.
3. **Map each table to a collection.** Choose columns, filters and type conversions.
4. **Model relationships.** For many-to-one and one-to-many relationships, choose:
   - **Reference:** keep the foreign key as a field, like `customerId`. Best when the related data is large or changes on its own.
   - **Embed:** nest the related rows inside the document, like an `items` array inside each order. Best when you always read them together.
5. **Preview** the documents the mapping will produce.
6. **Run.** Progress shows rows read, written and failed per table, and you can cancel.

## AI relationship suggestions

On a connection with **Allow AI** on, the assistant can suggest which relationships to embed or reference. It only sees table and column names, types and keys, never row data.

## Repeat it

Save a migration as a scheduled [task](/docs/tasks-cli), for example to refresh a MongoDB copy of a reporting database every night.

## The other direction

To move MongoDB data into SQL, use **Export → SQL** to write `INSERT` statements for generic SQL, MySQL or PostgreSQL. A task can write one script per collection on a schedule.

Open IntelliShell with **Mod+Shift+I**. It accepts the mongosh commands you already know.

## Commands

```js
show dbs
use shop
show collections
db.orders.find({ status: "paid" }).sort({ createdAt: -1 }).limit(20)
db.orders.countDocuments({ status: "paid" })
db.orders.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }])
db.orders.updateMany({ status: "pending" }, { $set: { status: "stale" } })
db.runCommand({ serverStatus: 1 })
```

Supported out of the box:

- `show dbs`, `show collections`, `use <db>`, `db.stats()`, `db.getCollectionNames()`, `help`;
- `find` with `.sort()`, `.skip()`, `.limit()`, `.projection()`, `.hint()`, `.maxTimeMS()`, `.collation()`, `.count()` and `.explain()`;
- `findOne`, `countDocuments`, `estimatedDocumentCount`, `distinct`, `aggregate`;
- `insertOne`/`insertMany`, `updateOne`/`updateMany` (with `upsert` and `arrayFilters`), `replaceOne`, `deleteOne`/`deleteMany`;
- index commands, `createCollection`, `drop`, `dropDatabase`, `db.runCommand(...)`, `db.adminCommand(...)` and `db.currentOp()`.

## Safe by default

By default IntelliShell **parses** each statement instead of running JavaScript. Arguments must be literal values and BSON constructors (`ObjectId`, `ISODate`, `NumberLong`, `NumberDecimal` …). Variables, loops and functions aren't supported in this mode. That's deliberate: nothing you paste can run code on your computer.

Writes are blocked on read-only connections, and destructive statements (drops, `deleteMany` or `updateMany` without a filter) ask for confirmation.

## Script mode

Turn on **Script mode** when you need JavaScript: variables, loops and functions. Scripts run in a **sandbox** on your computer, and database calls still follow the connection's read-only and server-side JavaScript settings. Script mode covers the common mongosh helpers, including `rs.*`, `sh.*`, `db.aggregate`, `coll.explain()`, `NumberLong` math, and cursor read preference and read concern.

Scripts stop after **60 seconds**. For longer work, save the script as a scheduled **script** [task](/docs/tasks-cli), whose time limit can be raised to 30 minutes. Your administrator can turn Script mode off.

Number literals are typed as in mongosh: whole numbers outside the 32-bit range are stored as Double, not Long. Use `NumberLong(...)` when you need a 64-bit integer.

## Productivity

- **Autocomplete** for collections, fields (from a schema sample) and operators.
- **History** per connection, with search.
- **Snippets** for statements you use often.
- **Query Assist:** edit returned documents in place.
- **Explain** straight from the shell.
- **Open and save** `.js` files.

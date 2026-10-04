Each connection has a **Safety** tab with three switches.

| Setting | Default | What it does |
|---|---|---|
| **Read-only** | Off | Blocks every write: inserts, updates, deletes, drops, index changes, imports, sync, masking write-back, user and role changes, write commands through `runCommand`, and aggregations with `$out` or `$merge` (even inside `explain`) |
| **Allow AI** | Off | Lets the AI assistant work on this connection. You also need an AI provider key |
| **Allow server-side JavaScript** | Off | Allows `$where`, `$function`, `$accumulator` and JavaScript code values. When it's off, queries using them are refused |

Changes apply immediately to open connections and are recorded in the local audit log.

## How read-only is enforced

Read-only is checked in MotionQL's background process for every request, not just by hiding buttons in the UI. A blocked request shows a message like:

```text
Blocked: "deleteMany" is not allowed on a read-only connection.
```

Your database roles are still the real control. Use a read-only database user for production when you can, and read-only mode as a second safety net.

## Confirmations

Destructive actions ask before they run: dropping a database or collection, restoring over existing data, sync overwrites and masking write-back. Drops require you to **type the name** of what you're dropping.

## Production label

Give a connection the **prod** environment label in the Connection Manager and MotionQL keeps a warning banner visible while you're connected to it.

## Organization policy

If your company deploys a machine policy file or runs a Team Server, it can make these settings stricter (for example, force read-only for hosts matching `*.prod.example.com`, or turn AI off). It can never make them looser. Locked settings show the reason in the app.

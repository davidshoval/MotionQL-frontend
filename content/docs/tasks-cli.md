Save repeatable work as **tasks** and run them on demand, on a schedule, in the background while MotionQL is closed, or from the command line. Scheduling is a Pro feature, included in the [free Pro key](/docs/activate).

## Task kinds

| Kind | What each run does |
|---|---|
| **Export** / **Import** | Export a collection or query to a file, or import a file |
| **Copy** | Copy a collection to another database or connection |
| **Compare** | Compare two collections and record the differences |
| **Reschema** / **Masking** | Apply a saved transform, for example to refresh a masked test copy |
| **SQL migration** | Run a saved SQL → MongoDB migration, or write MongoDB collections as SQL `INSERT` scripts |
| **Dump** / **Restore** | Back up a database (mongodump layout, archive or JSON/CSV/SQL files) or restore one |
| **Script** | Run a saved IntelliShell script in the local sandbox |
| **Schema snapshot** / **Index review** | Record a schema snapshot or an index review |
| **Continuous sync** | Apply a collection's change stream to another collection |

## Schedules

Run a task now, or schedule it:

- **once** at a given time;
- **every N** minutes, hours or days;
- **daily**, or **weekly** on chosen days;
- a **cron** expression.

Choose what happens to runs missed while MotionQL was closed or your computer was asleep: **run once** at start-up, or **skip**. The **run log** keeps each run's result: success, partial, failed or skipped, and how it started (manual, schedule, background or command line).

Every run respects the connection's read-only setting and is recorded in the run log and the audit log. Task definitions are stored encrypted.

## Continuous sync

A **continuous sync** task picks up from where the previous run stopped, applies inserts, updates and replaces by `_id`, then keeps listening for the **listen time** (default 50 seconds, up to 1 hour). Schedule it every minute to keep a target collection current. Deletes are only applied when you turn them on. **Copy existing documents** copies the collection on the first run, and **mask in flight** masks fields before anything is written. The source must be a replica set or sharded cluster.

## Run tasks while MotionQL is closed

By default tasks run only while MotionQL is open. Turn on **Settings → Tasks → Run scheduled tasks when MotionQL is closed** and MotionQL registers a per-user entry with your operating system that starts it **without a window** every 5 minutes while you're signed in to your computer:

| OS | Entry |
|---|---|
| macOS | A LaunchAgent in `~/Library/LaunchAgents/` |
| Windows | A Task Scheduler task under `\MotionQL\`, "run only when user is logged on", with no stored password |

Each start runs the tasks that are due and exits, so a task may start up to 5 minutes late. Turning the option off removes the entry.

## Command line

The MotionQL program also has a command-line mode:

```sh
MotionQL --cli tasks list [--json]
MotionQL --cli tasks run <id|name> [--wait] [--json]
MotionQL --cli tasks export <id|name> > task.json
MotionQL --cli tasks import task.json [--confirm <name>] [--json]
MotionQL --cli version
```

`MotionQL` is the program itself: `/Applications/MotionQL.app/Contents/MacOS/MotionQL` on macOS, or `MotionQL.exe` in the install folder on Windows. Run `MotionQL --cli install-cli` once to install a short `motionql-cli` wrapper. On Windows, use the wrapper so the command waits and returns the exit code.

- **`tasks run`** starts the run in the background and returns; with **`--wait`** its exit code is the result.
- **`tasks export`** prints a task as JSON, without run history or secrets. **`tasks import`** creates a task from such a file; a destructive task needs `--confirm <target name>`.
- Output never contains passwords, keys or connection strings.
- If an app password is set, pass it in the `MOTIONQL_APP_PASSWORD` environment variable.

| Exit code | Meaning |
|---|---|
| 0 | Success |
| 1 | The task failed, partly failed, or could not run |
| 2 | Usage error |
| 3 | Refused by license or policy |

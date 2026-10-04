Switching database tools is mostly about moving your **connections** and rebuilding a few **habits**. This guide covers both. It takes about fifteen minutes for a typical setup.

You don't have to switch all at once. MotionQL installs alongside other MongoDB tools, so keep your current one open while you move over.

## 1. Install MotionQL and activate Pro

[Create an account](/register), [download the installer](/download) and follow the [install guide](/docs/install). Then paste the free Pro key from your account page into **Settings → License**. Pro unlocks SQL Migration, Data Masking, scheduled tasks and Atlas management; everything else works without a key.

## 2. Move your connections

The reliable way to move a connection between any two MongoDB tools is its **connection string**.

1. In your current tool, copy each connection's URI (`mongodb://…` or `mongodb+srv://…`). If a tool doesn't show one, note the host, port, replica set name, authentication database and options instead.
2. In MotionQL, press **Mod+N** (Cmd on macOS, Ctrl on Windows) and paste the URI. The form fills in.
3. Re-enter the **password** on the Authentication tab. MotionQL encrypts it with your operating system's keychain.
4. Add anything that lives outside the URI:
   - **TLS files** (CA, client certificate and key) on the TLS tab. If your URI contained `tlsCAFile=…`, pick the same file here.
   - **SSH tunnels**, including jump hosts, on the SSH tab.
   - **Proxies** on the Proxy tab.
   - **In-use encryption** (CSFLE or Queryable Encryption) settings and KMS credentials.
5. Click **Test**, then **Save**.

Then organize: put connections in **folders**, give them **colors**, and label production ones **prod** so a warning banner stays on screen while you're connected. Mark them **read-only** on the Safety tab if you only read from them; MotionQL then blocks every write, including `$out` and `$merge`.

**Moving to another computer later?** Export your MotionQL connections encrypted with a password, then import them on the other machine.

## 3. Bring your queries and scripts

- **Shell commands.** IntelliShell (**Mod+Shift+I**) accepts mongosh-style commands such as `db.orders.find({...}).sort({...})`, `show dbs`, `use`, CRUD and index commands. By default it parses commands rather than running JavaScript; for scripts with variables and loops, turn on **Script mode**. The [IntelliShell docs](/docs/intellishell) list what's supported.
- **Saved find queries.** Paste the filter, projection and sort into the collection tab's [query bar](/docs/query-bar). Save ones you reuse as templates in the [visual query builder](/docs/visual-query-builder).
- **Aggregation pipelines.** Paste the pipeline array into IntelliShell as `db.coll.aggregate([...])`, or rebuild it in the [aggregation editor](/docs/aggregation-editor) to get stage-by-stage preview, and save it as a template.
- **SQL.** If you used SQL against MongoDB elsewhere, [SQL Query](/docs/sql-query) (**Mod+Shift+Q**) runs `SELECT` with joins, `GROUP BY`, `HAVING` and `ORDER BY`, and shows the MongoDB query it generates. It's read-only.

## 4. Recreate scheduled jobs

If you schedule exports, imports, compares or migrations today, recreate each one as a MotionQL [task](/docs/tasks-cli): set it up once in the tool, save it as a task, then add a schedule (interval, daily, weekly or cron). Turn on **Run scheduled tasks when MotionQL is closed** if they should run without the app open, and use `MotionQL --cli tasks run <name> --wait` from scripts and CI.

## 5. Learn the shortcuts you'll reach for first

| Action | Shortcut |
|---|---|
| Command palette (find any tool) | Mod+K |
| Run the query | Mod+Enter |
| New connection | Mod+N |
| IntelliShell | Mod+Shift+I |
| Aggregation editor | Mod+Shift+A |
| SQL Query | Mod+Shift+Q |
| Settings | Mod+, |

Every rebindable shortcut can be changed in **Settings → Keyboard**. The full list is in the [keyboard shortcuts](/docs/keyboard-shortcuts) reference.

## 6. Check what's different

A few things work differently from what you may be used to:

- **AI is opt-in per connection** and uses your own provider key (Gemini, Claude, an OpenAI-compatible endpoint or a local model). See [AI assistant](/docs/ai-mcp).
- **Map-Reduce isn't supported.** MongoDB has deprecated it; use the aggregation editor.
- **Server-side JavaScript** (`$where`, `$function`, `$accumulator`) is off per connection until you allow it.
- **Licenses are verified offline.** No license server check-ins, and the app works on air-gapped machines.

For a feature-by-feature view, see [MotionQL vs Studio 3T](/compare/studio-3t) and [MotionQL vs Compass](/compare/compass).

## Something missing?

If a workflow you depend on doesn't have an equivalent yet, tell us on the [support page](/support). Several items on the [roadmap](/roadmap) came straight from people switching tools.

MotionQL works with Redis, Valkey and Redis-compatible services: Dragonfly, KeyDB, Amazon ElastiCache and MemoryDB, Azure Cache for Redis, Upstash and Redis Cloud. The service is detected when you connect and shown as a badge; you can override it in the connection settings.

## Connecting

- In the Connection Manager, click **New Redis / Valkey**, or click **+** under **Redis & Valkey** in the sidebar.
- Choose **Standalone**, **Cluster** (one or more seed nodes) or **Sentinel** (the sentinels and the primary's name).
- Enter the ACL user (empty means `default`) and password, the database number, TLS (CA, client certificate and key) and, optionally, an SSH tunnel. Cluster nodes are each reached through the tunnel.
- Passwords are kept encrypted, like MongoDB and SQL secrets.
- **Read-only connection** blocks every command that changes data or server state, in the editors, the console and the panels. Unknown commands count as writes. Machine and team policy can also force read-only.
- **Production mode** shows a colour bar on every tab of the connection, asks before deletes, and asks you to type the command name before `FLUSHALL`, `FLUSHDB`, `KEYS`, `CONFIG SET`, `SHUTDOWN`, mass `DEL`/`UNLINK` (over 100 keys) and other dangerous commands.
- **Test** shows the detected service, version, modules and capabilities.

## Key browser

- Keys are read with `SCAN` (never `KEYS`), page by page, so millions of keys stay fast. Filter by pattern (`MATCH`) and type. In a cluster every primary is scanned.
- A Valkey 9+ cluster started with `cluster-databases` greater than 1 has several databases: the **DB** selector, the console (including `SELECT`), bulk delete and the memory analysis then work on the database you choose, across every shard (other clusters have database 0 only).
- Switch between a flat list and a **namespace tree** grouped by the delimiter (`:` by default; change it per connection).
- Click a key to see its type, TTL, memory (`MEMORY USAGE`), encoding, length and, in a cluster, its slot. Change or remove the TTL, rename it (`RENAMENX`) or delete it.
- **Editors:** strings (text, JSON, hex or base64), hashes (with per-field TTL on Redis 7.4+ and Valkey 9+), lists, sets, sorted sets, streams (add and delete entries), JSON documents and time series charts. Large values are shown truncated; keys and values that are not valid UTF-8 are kept byte for byte. Hashes, sets and streams load more rows with **Load more**; a field or member pattern keeps scanning on the server (for up to a second per page) until it has found a page of matches, so a rare pattern in a collection of a million items still answers in one click.
- **New key** creates a key of any type; it never overwrites an existing key.
- **Right-click a key** (or press **Shift+F10**) for **Open in a new tab**, **Open in console** (the console opens with the type's read command, such as `HGETALL key`, ready to run), **Copy key name** and **Delete key…** (asks first; off on read-only connections). Right-click a folder in the tree for **Scan only prefix\*** and **Copy prefix**.
- **Delete keys by pattern** first counts the matching keys and shows a sample, then asks you to type the pattern, then deletes in batches with `UNLINK` and shows progress. You can cancel it.
- **An empty database** says so and offers **Add key**, **Load demo data…**, **Import…**, the other databases that have keys, and the console. A filter that matches nothing offers **Clear the filter**.

## Console

- Type commands as in `redis-cli` (quotes and `\x` escapes work), with command completion and syntax hints from `COMMAND DOCS`, and history with the arrow keys.
- As in `redis-cli`, `\xHH` inside double quotes is one raw byte, so binary arguments can be typed exactly: for example `SET k "\xff\x00\x80"` stores three bytes, and a FLOAT32 vector blob for `FT.SEARCH … PARAMS` can be written byte by byte.
- Each console tab has its own connection, so `SELECT`, `MULTI` and `CLIENT SETNAME` stay within that tab. In a cluster, keyed commands go to the right node.
- Blocking and streaming commands (`BLPOP`, `XREAD BLOCK`, `SUBSCRIBE`, `MONITOR` and similar) are not run in the console; use the Streams and Pub/Sub panels instead.
- A reply shows at most 10,000 items. A command that reads a whole collection or keyspace and would return more (`HGETALL`, `HKEYS`, `HVALS`, `SMEMBERS`, `LRANGE`, `ZRANGE`, `XRANGE` without `COUNT`, `KEYS`) asks first, says how many items it would send and names the `SCAN` form that reads them in steps. A long reply shows its first 1,000 lines with **Show all**; **Copy output** copies all of it.
- **AI ghost text** (when AI inline completion is on in the AI settings): pause while typing and the rest of the command appears greyed out; **Tab** or **→** at the end accepts it, **Esc** dismisses it. It sends the line with key names generalised and arguments replaced by placeholders, the server version and key name patterns, never values. A suggestion must be one known command; dangerous commands, and writes on a read-only connection, are only suggested when you typed that command yourself.
- **Ask AI why there are no results** appears under an empty `SCAN`, `FT.SEARCH`, `(nil)`, empty list or zero count: the AI lists the likely reasons (wrong database, a pattern that does not match your key names, an unfinished `SCAN`, other cluster nodes, `FT.SEARCH` syntax) with read-only commands to check each.

## Panels

Open them from the connection's menu in the sidebar.

- **Streams:** stream info, consumer groups with pending counts and lag, consumers, and the pending entries list with idle time. Acknowledge, claim and auto-claim entries, create or delete groups and consumers, and tail new entries live.
- **Pub/Sub:** active channels and subscriber counts, subscribe to channels, patterns or shard channels and watch messages arrive, and publish.
- **Memory:** samples keys with `MEMORY USAGE` to find the biggest keys, memory by type, a TTL histogram and the largest namespaces.
- **Performance:** live charts from `INFO` (memory, operations per second, hit ratio, clients, evictions), the slow log (and Valkey 8.1's large-request and large-reply logs) with a timeline of slow commands, and **Latency**: `LATENCY DOCTOR`, the latest spike of each event and a timeline of `LATENCY HISTORY` (set `latency-monitor-threshold` to record events).
- **Clients:** `CLIENT LIST` with kill.
- **Cluster:** shards and nodes, a map of the 16,384 slots, and the hottest slots (`CLUSTER SLOT-STATS`, Valkey 8+ and Redis 8.2+).
- **ACL:** users and their rules (password hashes are never shown), add rules or a password, delete users, the ACL log, and an `ACL DRYRUN` tester to check whether a user may run a command.
- **Search** (Redis 8, Redis Stack or valkey-search): build an index from a form with a preview of the `FT.CREATE` command, drop indexes, and run queries.

- **Scripts and functions:** a Lua editor with **KEYS** and **ARGV** fields and a list of the commands the script calls (writes are marked). **Run EVAL** (or **EVAL_RO**, which the server refuses to let write, and which read-only connections may use), **Load** into the script cache and run **By SHA1** with `EVALSHA`, check whether a SHA1 is cached, and **Flush cache**. The **Functions** tab (Redis 7+ and Valkey) lists libraries and their functions with their flags; edit a library and **Load library** / **Replace library**, delete one, and call a function with `FCALL`, or `FCALL_RO` for functions flagged `no-writes`. Script runs that can write ask first (in production mode you type the name), and the audit log records the script's SHA1 or the function's name, never keys or arguments. **Ask AI about this script** explains what a script or library does, whether it is atomic and safe on a cluster, and can rewrite it.
- **Keyspace notifications:** the `notify-keyspace-events` flags as checkboxes with presets (all events, expired keys only, off). **Apply** sets them on every primary after you confirm. **Watch** subscribes to `__keyspace@<db>__` and `__keyevent@<db>__` for a key pattern and shows events live, with counts per event; it stops when you leave the tab.
- **Bulk actions by pattern** (key browser): besides **Delete by pattern**, set or remove a TTL on every key matching a pattern; each asks you to type the pattern.

**Ask AI** on the Clients, Streams, Keyspace notifications, Pub/Sub, migration and RDB analysis panels (and the bulk TTL / delete dialogs) explains what the panel shows and suggests commands to run, which open in the console rather than running; it sees counts, names generalised to patterns and settings, never values.

Killing clients, resetting the slow log, changing ACL users, dropping indexes and deleting groups or consumers ask first, are disabled on read-only connections, and are written to the audit log. The audit log records the action and the key or name, never values or passwords.

## Export, import and snapshots (tasks)

Redis data can be saved and restored with [tasks](/docs/tasks-cli), run now or on a schedule:

- **Redis export** writes the keys matching a pattern (and types) in one database to a file in a folder you choose. **JSON Lines** keeps everything byte for byte: every type (strings, hashes, lists, sets, sorted sets with exact scores, streams with their entry ids, JSON documents, and module types such as time series as a `DUMP` payload) and each key's remaining TTL. Keys and values that are not valid UTF-8 are written as `{"b64": "…"}`. **CSV** (`key,type,field,value,ttl_ms`) holds strings and hashes only, for spreadsheets; it cannot be imported back. The file name is a template with `{connection}`, `{db}`, `{date}`, `{time}` and `{datetime}` (UTC); without a date token each run overwrites the same file, with one **keep last N** deletes older exports of the same template. Gzip is optional.
- **Redis snapshot** writes every non-empty database of a connection into one timestamped file, `motionql-kv-snapshot-<connection>-<UTC time>.jsonl[.gz]`, with **keep last N**.
- **Redis import** restores an export or snapshot file into a connection (all databases as in the file, or into one database you choose). Keys that already exist are **skipped** or **replaced**; TTLs are restored as the time that was left when the file was written (counted from the import). Imports are refused on read-only connections, and saving the task asks you to type the target connection's name; if the connection is renamed later, the task stops until you confirm again.

Keys are read with `SCAN` on every primary of a cluster, in batches, so memory stays low with millions of keys; big hashes, sets, lists, sorted sets and streams are read in chunks. Retention only ever deletes files that carry MotionQL's header line, never your own files. Not exported: hash field TTLs (Redis 7.4+/Valkey 9) and stream consumer groups; module values exported with `DUMP` restore only on a server with the same module and a compatible version.

## Migrate to MongoDB or SQL (Pro)

**Migrate to MongoDB / SQL…** in a Redis connection's menu copies keys into a MongoDB collection or a SQL table (PostgreSQL, MySQL, MariaDB, SQL Server, SQLite or DuckDB, from the SQL client's saved connections). It needs the SQL Migration license.

- **Keys:** a pattern such as `user:{id}`, where `{id}` marks the part of the key that becomes the id; or the whole key, optionally without a prefix. Ids that are whole numbers can be stored as numbers.
- **Mapping:** a hash becomes one field (column) per hash field; a string becomes `value` (optionally parsed as JSON); a JSON document becomes the document itself; lists and sets become arrays, sorted sets arrays of `{member, score}`; a stream becomes an array of entries, or one document (row) per entry. The key is kept in `_key` (or a field you name, or left out); a TTL can be kept as an `expireAt` date. Values that are not valid UTF-8 become binary (MongoDB) or `base64:…` text (SQL).
- **SQL:** the table can be created for you, with columns inferred from the first keys, a primary key column (`id`) and a JSON column (`extra`) for fields without a column; arrays and objects go to JSON columns. With an existing table, its own columns are used.
- **Preview** shows the first documents or rows (and the `CREATE TABLE` statement) without writing anything. **Run** shows progress and can be stopped. Writes are upserts by id, so running again updates what an earlier run wrote. The target must be writable: read-only MongoDB or SQL connections (or policy) refuse the run.
- **Save as task** schedules the migration. A task can **keep syncing**: after the copy it follows changes for the listen time (default 50 s), and a scheduled time that comes while it still listens is passed over quietly. When the server has keyspace notifications on (`notify-keyspace-events` including `K` and the classes of the types migrated, e.g. `KEA`) changes are applied as they happen; otherwise (or when `CONFIG` is not allowed, as on many managed services) the keys are rescanned every few seconds and changed ones written. MotionQL never changes `notify-keyspace-events`. **Delete** removes target documents (rows) whose key was deleted in Redis and asks you to type the target collection or table name.

Sync limits: notifications are not stored by Redis, so changes made between two runs are caught by the next run's full copy (which upserts every matching key), not by replaying events; rescans see a TTL being set or removed but not a TTL changed to another length; and keys deleted while no run was listening are removed by the next run's full copy only when the key field is kept, for up to 5 million keys per run.

## Offline RDB analysis (Pro)

**Analyze RDB file…** (the file button or right-click menu on the "Redis & Valkey" sidebar header, or the command palette) reads an RDB snapshot such as `dump.rdb` on your computer, with no server involved. It supports files from Redis 2.x to 8.x and Valkey 7.2 to 9, including streams, hash field TTLs (Redis 7.4+, Valkey 9), functions, module data and cluster slot information. The file is streamed, so multi-GB snapshots work with little memory, and you can cancel at any time. The report has the same views as the Memory panel: the biggest keys by their size in the file, with type, encoding, element count and TTL; the collections with the most elements; size by type and by encoding; keys per database; a TTL histogram (TTLs are relative to the time the file was written, so keys already expired then are counted separately); and the largest namespaces for a delimiter you choose. A truncated file, an unknown record type or a CRC-64 checksum mismatch shows up as a warning with the results read so far. Export the report as JSON or CSV. Sizes are bytes in the file, which are usually smaller than memory use because RDB files are compact and often compressed.

MotionQL works with Cloud Firestore in Native mode (the database behind Firebase) in any Google Cloud or Firebase project, including named databases, and with the Firestore emulator (`firebase emulators:start`) for development.

## Connecting

- Click **+** under **Cloud Firestore** in the sidebar, or pick **Cloud Firestore** or **Firestore emulator** in **Add a connection**.
- **Cloud Firestore:** enter the project id (Firebase console › Project settings › General, the id and not the project name) and choose the database: **List** fills the picker with the project's databases, or type a database id (`(default)` when empty). Sign in with **gcloud / Application Default Credentials** (`gcloud auth application-default login`, or the machine's service account), **Sign in with Google** in the browser (with your own "Desktop app" OAuth client id), a **service account key** (pick the JSON file or paste it) or a pasted **OAuth access token**.
- **Firestore emulator:** enter the emulator's `host:port` (default `localhost:8080`) and any project id (`demo-project`). No sign-in is needed; the emulator gives full access.
- Keys, refresh tokens and access tokens are kept encrypted.
- **Read-only connection** refuses every write: documents, imports, deletes, indexes and TTL policies. Reads, queries and counts still work. **Production mode** shows a colour bar, confirms every write and asks you to type the collection or document path before deleting. **Allow AI** turns AI off for one connection.
- **Test** shows the project, the database (location, edition, mode, point-in-time recovery and delete protection when the credentials can read them), the number of root collections and the signed-in account.

## Browsing documents

- Under a connection the sidebar lists the **root collections**, **Indexes & TTL**, and **Database & Security Rules**. Right-click a collection to browse it, add a document, query it in the console, query it as a **collection group** (every collection with that id, at any depth), open its indexes, or delete it.
- A collection opens as a document grid with a breadcrumb (collection › document › subcollection). **Table** shows one column per field with its type; **JSON** shows each document. The arrows page with Firestore's query cursors.
- The **query builder** adds `where` filters (`==`, `!=`, `<`, `<=`, `>`, `>=`, `array-contains`, `array-contains-any`, `in`, `not-in`, is null, is NaN) on any field path, with the field names and types seen in the documents, `orderBy`, a `select` of fields and the page size. **Count** runs a count aggregation, which costs one read per 1,000 index entries. **Show as code** gives the Firebase JavaScript SDK code of the query.
- When a query needs a composite index, the error shows Firestore's link that creates it, plus **Ask AI**.
- A **types summary** lists each field with the types found in the page, so mixed types (a number stored as a string) stand out.

## Editing documents

- Click a document to edit it as typed JSON: `{"$timestamp": "2026-01-31T12:00:00Z"}`, `{"$ref": "users/alice"}`, `{"$geopoint": [51.5, -0.12]}`, `{"$bytes": "…"}`, `{"$vector": [...]}`, with integers and doubles kept apart (`1` versus `1.0`). Writes can use `{"$serverTimestamp": true}`, `{"$increment": 1}`, `{"$arrayUnion": [...]}`, `{"$arrayRemove": [...]}` and `{"$delete": true}`.
- **Set** replaces the document, **Merge** changes only the fields given, and **Update** takes field paths such as `"address.zip"` like the SDK's `update()`. A save is refused when someone else changed the document since you opened it.
- **New document** takes an id or creates an automatic one. **Duplicate**, **Copy to…** and **Move to…** copy a document to another path, **Copy as code** gives the SDK call, and the editor lists the document's **subcollections** (with **New subcollection**).
- Tick rows and **Delete** removes them, optionally with their subcollections. Every write asks first in production mode and is written to the audit log by path, never with values.

## Query console

- **New query console** on a connection or collection, or **Mod+T** on a Firestore tab. It reads the Firebase JavaScript SDK's namespaced syntax: `db.collection('orders').where('status', '==', 'open').orderBy('created', 'desc').limit(20).get()`, `db.collectionGroup(...)`, `db.doc('users/alice').get()`, `.count()`, `.aggregate({ total: sum('amount') })`, `Filter.or(...)`, cursors, `listCollections()`, and `add` / `set` / `update` / `delete` with `FieldValue` transforms.
- **Ctrl+Enter** runs the statement under the cursor; **More** continues a query; **Stop** cancels it. Completion offers collections, operators, methods and helpers.
- **Explain** shows Firestore's query plan (the indexes used) and, with **Analyze**, the documents read and the billed reads. The emulator does not support Explain.
- Writes are refused on read-only connections and ask first. Consoles can be saved as `.firestore.js` scripts in the scripts folder.

## Indexes, TTL and the database

- **Indexes & TTL** lists the composite indexes (fields, scope and state: creating, ready or needs repair) and single-field overrides, filtered by collection group. **Create index** and **Delete** manage composite indexes; the overrides form adds **TTL policies** (a timestamp field whose documents are deleted after that time) and single-field index exemptions. Index builds and TTL changes appear as long-running operations.
- **Database & Security Rules** shows the database's settings, the project's other databases, the long-running operations (index builds, exports, imports, TTL changes) and the live **Security Rules** source, read-only.
- The emulator has no Admin API, so these panels say so instead of failing. Each panel links to the same page in the Firebase console.

## Import and export

**Export** writes the documents of a collection (or the query's results) as a **JSON** array, **JSON Lines** or **CSV**, optionally with subcollections (`__collections__`). **Import** reads JSON or JSON Lines in the same typed format (with `__id` for document ids) and creates documents, merges into them or replaces them, in batches of 500 writes. Imports ask first and are refused on read-only connections.

## AI help

When AI is allowed for the connection, **Ask AI** is on every Firestore screen:

- In the **collection browser** and the **query console** it writes a query from plain English, explains a query and what it costs, fixes an error (such as a missing composite index or an invalid inequality and orderBy), explains why a query returned nothing (a number stored as a string, a timestamp compared with text, a subcollection queried as a root collection), proposes composite indexes, advises on the data model, and writes or reviews Security Rules.
- On **Indexes & TTL** it designs indexes for the access patterns you describe and reviews TTL policies and exemptions; on **Database & Security Rules** it reviews the rules for open access, missing validation and ownership checks.
- It sends the field paths and their types, the indexes, and the statement or rules with values replaced by placeholders, never documents. Statements it writes are checked by the console's own parser, marked when they change data or need a composite index, and only put in the editor, never run. Proposed indexes open the create-index form, and proposed rules can be copied as `firestore.rules`.
- **Why did this fail?** in the connection dialog explains sign-in and project errors.
- **AI chat** and **Ask your database** work on Firestore connections: they list collections, read field types from sampled documents and propose a console statement you open in the query console. The [MCP server](/docs/ai-mcp) has read-only tools for open Firestore connections: listing collections, describing a collection and running one small query (values are masked unless allowed).

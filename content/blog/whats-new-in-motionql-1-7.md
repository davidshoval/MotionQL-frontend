Since 1.3, MotionQL has shipped five releases. Here is what changed, from the newest database to the way you ask AI for help.

## Ask AI, in one place on every screen

Whatever you ask AI about, a table, a collection, the SQL editor, an aggregation, a plan, an index or a server panel, it now opens in one **Ask AI** panel on the right of the tab. Your rows and documents stay in view next to the chat.

- **It's a conversation.** Follow up on the last answer ("only shipped orders", "group by month") and the chat keeps the thread until you hide the panel or close the tab.
- **You choose what runs.** **Run here** runs a drafted query on the spot. **Put in editor** puts it in the SQL editor, replacing your selection or adding it after your last statement, so nothing you typed is lost.
- **Fix with AI.** When a query fails or finds nothing, one click sends the query and its error into the same chat.
- **One Ask AI per screen.** The toolbar's Ask AI button and **Ask AI about this screen** in the command palette open the panel of the tab you're on.

As before, AI is off for every connection until you allow it, and it sends names and types, never your rows or documents. See [AI assistant](/docs/ai-mcp).

## Double-click to edit in place

In a SQL table, on every SQL database, a double-click on a cell now edits it right in the cell. **Enter** or clicking elsewhere keeps the value, **Esc** puts the old one back, and **Apply** saves. **Shift+Enter** still opens the full editor for NULL, DEFAULT and SQL expressions. In MongoDB's table and tree views, clicking away now keeps your change instead of dropping it. Read-only connections, views and key columns stay read-only.

## Cloud Firestore

MotionQL 1.5 added **Cloud Firestore** and the Firestore emulator. Sign in with gcloud, Google, a service account key or an access token. Browse collections, subcollections and collection groups. Edit documents as typed JSON, with timestamps, references and geopoints. Query in the Firebase SDK's own syntax with Explain, and manage composite indexes, TTL policies and Security Rules. AI helps on every Firestore screen without ever seeing a document. See [Cloud Firestore](/databases/firestore).

## Updates you can see

**Settings → Updates** now downloads and installs a new version with a progress bar and the release notes. After an update, MotionQL tells you which version you have and what's new. The macOS app is signed and notarized by Apple, so it opens without a security warning.

## And more

- **One-click license activation:** the website's **Open in MotionQL** button activates your key after you confirm.
- **A tidier sidebar:** it lists only the database types you have connections for, and **+** still adds any type.
- **Last year and custom time ranges** in monitoring and dashboards.
- **AI tools (MCP) for saved connections:** coding tools can create, test and open connections when you allow it.
- **Faster tooltips** and patched dependencies.

The full list is in the [changelog](/changelog). [Download MotionQL 1.7](/download), or update from **Settings → Updates**.

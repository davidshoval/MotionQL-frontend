**Data Compare & Sync** finds the differences between two collections, on the same connection or on different ones, and syncs them.

## Compare

1. Open **Compare** from the command palette or a collection's context menu.
2. Choose the **source** and **target** collections.
3. Run the comparison. Documents are matched by `_id` (or another key field you choose) and sorted into:
   - **only in source**;
   - **only in target**;
   - **changed**, with a **field-level diff** showing exactly what differs.

**Export the differences** to a file to share or review them.

## Sync

1. **Preview the sync** first. It's a dry run that shows what would be written.
2. Choose what to sync. You can sync everything or pick individual documents.
3. Choose a **conflict policy** for documents that exist on both sides: **source wins**, **target wins** or **skip**.
4. Run the sync and confirm.

Sync writes to the target, so it's blocked when the target connection is [read-only](/docs/connection-safety).

## Keep collections in step

- Save a comparison as a scheduled [task](/docs/tasks-cli) to check for drift regularly.
- For continuous replication, use a **continuous sync** task: it applies a collection's change stream to another collection, optionally masking fields on the way. See [Tasks and the command line](/docs/tasks-cli#continuous-sync).

## AI summary

With **Allow AI** on, the assistant can summarize a large comparison result in plain words.

MotionQL 1.2 puts AI help where you're already working. Instead of switching to a chat window, you click **Ask AI** on the screen in front of you and get a suggestion for that screen.

## Ask AI on nearly every screen

The button is on the chart editor and dashboard builder, the profiler, server monitoring, index review, import and export, test data, bulk edit, value search, the document editor, roles, the task scheduler, the data model, schema compare, connection errors and the SQL editor. The command palette also has **Ask AI about this screen**.

A few examples:

- In the chart editor, describe a chart, or a whole dashboard, and apply it with undo.
- In import, let it map your CSV columns to fields and types.
- In the profiler or server monitoring, ask what is slow and what to do about it.
- When a connection fails, ask what the error means and what to try next.

Every helper suggests something you then apply. Nothing runs on its own, and each one follows the connection's **Allow AI** setting, which is off until you turn it on. Like the rest of MotionQL's AI, it sends your schema, not your document values or credentials.

## Backup models when Gemini is busy

Free Gemini keys sometimes hit "busy" or rate limits. MotionQL 1.2 retries on a backup Gemini model and tells you which model answered. You can change the backup list in **Settings → AI → Backup models**. If you don't have a key yet, the app walks you through getting a free one.

## Calmer screens

Help text and secondary panels now stay hidden until you ask for them, dialogs close with Escape, and the sidebar's Export and Import menu items open the right tools.

The full list is in the [changelog](/changelog). [Download MotionQL 1.2](/download), or update from inside the app.

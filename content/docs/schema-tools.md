## Schema analysis

**Schema** samples documents from a collection and shows each field with its **types**, how often it appears (**frequency**) and **value statistics**. Use it to understand a collection you didn't design, or to spot fields with mixed types. Export the report as **CSV**, **Markdown** or **HTML**.

## Schema compare and history

**Schema Compare & History** compares the inferred schemas of two collections: fields, indexes, validator and collection options. Save **snapshots** to build a **history** of how a collection changes over time, and export the diff as Markdown, HTML or JSON. A schema snapshot can also run as a scheduled [task](/docs/tasks-cli).

## Data model (ER diagram)

Right-click a database and choose **Data Model Diagram**. MotionQL samples every collection and draws:

- each collection's fields with `PK`/`FK` markers, types, required fields and how often each field appears;
- the **references** between collections, found from field names (`customerId` → `customers`, `tagIds` → `tags`, `items[].productId` → `products`), DBRefs and views. Each one is checked by looking up sampled values in the target collection.

**Match by value** also finds references with no name hint, such as `createdBy` → `users`.

Arrange collections by dragging, add or remove relationships, change cardinality, hide collections and write notes. The layout is saved per database. Select a relationship and choose **Open as $lookup** to follow it in the aggregation editor.

**Export** the diagram as **PNG** or **SVG**, copy it as a **Mermaid** `erDiagram`, or save it as JSON to open later. Only names, types and match counts are used; document values never appear in the diagram.

## Value search

**Value Search** finds a substring, exact value or regular expression across the databases and collections you choose, and opens each hit in a collection tab. It uses indexes or Atlas Search when they help, and otherwise scans with progress and cancel.

## Generate test data

**Generate Test Data** creates documents from a JSON template, or from the live schema of an existing collection. Preview the rows, then insert them into a collection or export them as JSON or CSV.

## Reschema and Data Masking

**Reschema & Data Masking** transforms documents and always shows a **preview** before anything is written.

**Reschema operations:** rename, remove, set, copy, flatten, nest, convert type (`string`, `int`, `long`, `double`, `decimal`, `date`, `objectId`, `bool`) and array-to-field.

**Masking methods** (Pro): redact, null, remove, hash (keyed HMAC), fake name, fake email, fake phone, shuffle, partial, date shift and number noise.

Write the result **to a new collection**, for example a masked copy of production data for testing, or **back to the source** (asks for confirmation; blocked on read-only connections). Save a transform as a scheduled [task](/docs/tasks-cli) to refresh a masked copy regularly.

Reschema without masking is free. Data Masking needs a [Pro key](/docs/activate).

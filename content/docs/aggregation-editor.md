Open the aggregation editor with **Mod+Shift+A**, or convert a find from the [query bar](/docs/query-bar).

## Stages

- **Add**, **reorder**, **disable** and **delete** stages. A disabled stage stays in the pipeline but is skipped, which is handy when you're narrowing down a problem.
- **Preview stage by stage:** select a stage to see the documents coming out of it, so you can check each step before running the whole pipeline.
- Each stage is edited in its own code editor.

## Operators

The operator library covers the full aggregation language, including `$lookup`, `$facet`, `$graphLookup`, `$unionWith`, `$setWindowFields`, `$densify`, `$fill`, and Atlas's `$search` and `$vectorSearch`.

## Options

- **Allow disk use** for large sorts and groups.
- **`maxTimeMS`** to cap the run time on the server.
- **Collation.**

## Templates

Start from a built-in template or save your own pipelines as templates.

## Writes

`$out` and `$merge` write to a collection, so they count as writes: they are blocked on [read-only connections](/docs/connection-safety), including inside `explain`.

## Next steps

- **Query Code:** generate the pipeline in mongo shell, Node.js, Python, Java, C#, PHP, Ruby, Go or Rust.
- **Explain** the pipeline to see which stages use indexes. See [Explain plans](/docs/explain-profiler).
- **AI debugging:** with AI allowed on the connection, the assistant can walk through a pipeline stage by stage. See [AI assistant](/docs/ai-mcp).

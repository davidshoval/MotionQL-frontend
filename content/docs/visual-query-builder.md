The visual query builder lets you build a `find` without typing operators. It writes the same filter you could type into the [query bar](/docs/query-bar), so you can switch between the two.

## Build a filter

1. Open the builder from the collection tab.
2. The **Schema Fields** list shows the fields found in a sample of the collection. **Drag a field** into **Query Conditions**, or add a condition and pick the field.
3. Pick an **operator** and enter a **value**.
4. Add more conditions. Each group combines its conditions with **AND** or **OR**, and groups can be nested for queries like *(A and B) or C*.
5. Turn a condition off temporarily without deleting it.

The **Complete Query Preview** updates as you go and tells you when the query is valid. **Copy** puts the MongoDB command on your clipboard.

## Operators

| Kind | Operators |
|---|---|
| Comparison | `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte` |
| Sets | `$in`, `$nin`, `$all` (enter values as a JSON array, for example `["a", "b"]`) |
| Element | `$exists`, `$type` |
| Arrays | `$size` |
| Text | `$regex` (enter `/pattern/flags` or just the pattern) |

## Projection, sort and paging

- **Field Projection:** include or exclude fields.
- **Sort Options:** add fields with ascending or descending direction.
- **Limit Results** and **Skip Documents**.

## Templates and history

- **Save Query Template:** give a query a name and a description, then load or run it later.
- **Query History:** recent queries, ready to load or re-run.

## Opening an existing filter

When you open the builder with a filter already in the query bar, MotionQL turns it into builder rows. Filters that can't be shown as simple rows (for example, `$elemMatch` or values such as `ObjectId` and dates) stay in the query bar, where you can keep editing them as text.

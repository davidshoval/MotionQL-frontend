Speed is the reason MotionQL exists. A MongoDB GUI is something you click hundreds of times a day, and a third of a second of waiting after every click adds up. So we timed MotionQL against MongoDB Compass the same way for both apps, and MotionQL was faster at every step: up to 7.6 times faster in the shell, and 3 to 5 times faster for filters, sorts and paging.

This post shows the numbers, how we measured them, and the changes in the app that got us there.

## The results

Each number is the time from the click (or key press) to the final result on screen, in milliseconds. It's the median of 20 runs over two rounds. Lower is better.

| Step | MotionQL | Compass | MotionQL is |
|---|---|---|---|
| Shell: `db.orders.find({})` | **64 ms** | 485 ms | 7.6× faster |
| Regex search on an unindexed field | **79 ms** | 391 ms | 4.9× faster |
| Sort on an indexed field | **72 ms** | 340 ms | 4.7× faster |
| Filter on indexed city and status | **77 ms** | 353 ms | 4.6× faster |
| Next page | **71 ms** | 274 ms | 3.9× faster |
| Sort on an unindexed field | **133 ms** | 420 ms | 3.2× faster |
| Open a collection (first page of 50) | **81 ms** | 219 ms | 2.7× faster |
| Aggregation: `$match`, `$group`, `$sort` | **158 ms** | 175 ms | 1.1× faster |

MotionQL was also faster at every step in each round on its own, not only in the combined median. The slow-case times (95th percentile) tell the same story; hover a bar in the chart on [MotionQL vs Compass](/compare/compass) to see them.

The aggregation is the closest result, and that's expected: grouping 100,000 documents is work the server does, and no GUI can make the server faster. Everything else is mostly time the app spends between the server's answer and your screen, and that's the part we could fix.

## How we measured

We wanted a test that treats both apps the same and can't be fooled by either app's own timers.

- **One machine, one server.** A MacBook Air (M1) on macOS 15.6, with a local MongoDB 5.0. Both apps used the same server and the same data: 100,000 order documents with indexes on `createdAt` and the customer's city. `total` and `note` have no index, so the unindexed sort and the regex search have to scan.
- **Same view in both apps.** Each app was maximized, in table view, with 50 documents per page. Versions: MotionQL 1.2.1 and MongoDB Compass 1.51.0. Only one app ran at a time.
- **Timed from the screen.** A small macOS tool sends the click or key press itself, then watches the part of the screen where the result appears and stops the clock when it stops changing. It measures to one display frame, and it doesn't need to know anything about either app.
- **Enough runs.** Ten runs per step in each of two rounds, with the first run of each step thrown away as warm-up. The table shows the median.

We didn't time Studio 3T in this round. When we do, we'll publish those numbers the same way.

## What made MotionQL fast

Most of the speed came from finding work the app did that nobody was waiting for, and either removing it or moving it out of the way.

### The first rows never wait for the count

A collection view shows two things: a page of documents and the total ("1–50 of 100,000"). The obvious way to build it, and the way MotionQL used to work, is to fetch both and show them together. But counting is often the slower half. With a filter or a regex, the server may have to look at every matching document just to give you a number, while the first 50 rows were ready long before.

Now the page and the count are separate requests. The rows appear as soon as they arrive, and the info bar says "counting…" until the total follows. A few details make it feel right:

- Paging, sorting and changing the projection reuse the count of the same filter, so **Next page** never counts again.
- A page shorter than the page size *is* the total, so no count is needed at all.
- Going back to a tab shows its last page at once while it reloads, so switching tabs never shows a spinner.
- Places that never show a total, such as `find` in the shell, the query builder and schema sampling, stopped asking for one.

This one change is most of the difference in the open, filter, sort, regex and paging rows.

### Big results cross as one string

MotionQL is an Electron app: the MongoDB driver runs in one process and the window in another. When a result crosses between them, Electron copies it as a graph of objects, twice. That's fine for 50 documents and painful for 50,000. Large results now cross as a single string of JSON, which the window parses in one pass with the browser's native `JSON.parse`.

We also rewrote the step that turns MongoDB's BSON types into JSON for the window. It used to take four passes over every result; now it takes one. For 50,000 documents that's 3.7 seconds instead of 12, and a test checks the new output against the old one for every BSON type.

### Less work after the data arrives

- Turning a page didn't really change most table rows, but they all re-rendered anyway, because a callback passed to every row changed on each render. Now it's stable, so rows that didn't change aren't drawn again.
- The JSON view builds only the documents you can see.
- The previous page stays on screen while the next one loads, so there's no flash of a spinner. It only dims if the wait passes 150 ms.
- Saving an edited cell re-reads just that one document instead of reloading the page and its count.

### Aggregations show the answer first

To show how many documents pass each stage, the aggregation editor used to run the whole pipeline once per stage, one after another, with an explain each time. Now **Run** asks for the final result first and shows it. The per-stage counts fill in afterwards, with each stage capped at 101 documents plus a `$count` only when there are more, and up to four running at once.

### The shell doesn't redo old output

The shell row is where MotionQL wins by the most. Its `find` no longer waits for a count it never shows, and earlier output blocks are kept as they are, so a new command doesn't format every result above it again.

### Ready before you click

Right after you connect, MotionQL opens a few pooled connections in the background, so your first queries don't each wait for a new connection handshake.

## Lighter, too

Speed and memory go together: less code loaded means less to start and less to keep in memory. The code editor, charts, the SQL drivers, Excel import and export, SSH tunnels and most screens now load the first time you use them, not at start-up. The main window loads 1.2 MB of script instead of 5.7 MB.

On the same Mac, MotionQL starts in about half a second, uses 158 MB idle, and 288 MB with the 100,000-order collection open.

## What we didn't do

Some ideas didn't pay off and stayed out: prefetching the next page, decoding results in a background worker, and lower thresholds for the string path. They didn't measure faster in practice, and every one of them would have added code to maintain. Speed work is mostly measuring and then deleting work, not adding clever tricks.

## Try it on your own data

These numbers are from one machine and one dataset, and your data is different. MotionQL is free to download, comes with a free Pro license for your first year, and imports your connections from Compass and Studio 3T in a minute. [Download MotionQL](/download), open your slowest collection, and see for yourself.

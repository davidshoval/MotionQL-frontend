MotionQL 1.1 is the biggest update since launch. It adds SQL databases, side-by-side tabs, Linux, and a long list of speed and polish work. Everything below is free, like the rest of the app.

## SQL databases, next to MongoDB

Connect to **PostgreSQL, MySQL, MariaDB, SQL Server and Oracle** from the same Connection Manager. Browse schemas, tables, views, columns and indexes; run SQL with autocomplete and a result tab per statement; and edit table rows by primary key. Every editor tab has its own session, so transactions stay where you started them, and risky statements such as `DROP` or a `DELETE` without `WHERE` ask first. See [SQL databases](/docs/sql-databases).

## Faster, and lighter on memory

Speed and memory are where MotionQL has to beat Studio 3T and Compass, so 1.1 spent a lot of time there:

- The first rows of a query appear without waiting for the document count.
- Common actions are 1.5 to 8 times faster than in 1.0.
- **Load all** streams every matching document into one list; 50,000 documents open in a few seconds.
- The app uses about 30% less memory.

## Split panes and tab groups

Drag a tab to the side of another, or use **Split Right** and **Split Down**, to compare collections or keep a shell open next to your results. Every pane keeps its own live results.

## Bring your connections

**Import from…** in the Connection Manager reads your saved connections from MongoDB Compass, Studio 3T or Robo 3T, so switching takes a minute. Passwords go straight into your OS keychain.

## Real monitoring and explain

Server monitoring now shows live `serverStatus`, `dbStats` and `top` metrics, and the query builder's Optimization panel runs a real `explain` with index suggestions.

## Share dashboards with your team

Save a dashboard to a workspace folder your team shares, or share it through the Team Server, and teammates open it ready to run against their own connections.

## And more

- Edit database users and change passwords.
- Preview GridFS files and upload them by dragging them onto a bucket.
- Linux: an AppImage and a `.deb` package.
- Every screen redesigned to be more compact, with secondary panels that open and close.

## What came next

1.2 adds an **Ask AI** button on nearly every screen; see [MotionQL 1.2: Ask AI on every screen](/blog/motionql-1-2-ask-ai-on-every-screen). The full list of changes is in the [changelog](/changelog).

[Download MotionQL](/download) or update from inside the app.

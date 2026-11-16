Keep saved queries and scripts as plain files, one per script, in a folder that can be a Git repository, and commit,
branch, pull and push them from MotionQL. Open **Source Control** from the command palette (Ctrl/Cmd+K, "Source
Control") or the branch item in the status bar.

**The folder.** Choose one of: **Use a folder…** (any folder, or a repository you already cloned; a subfolder of a
bigger repository works too), **New repository…** (runs `git init` in an empty folder) or **Clone…** (an https or ssh
URL, into a folder you choose). The scripts folder is separate from the workspace folder and remembered on this
computer. **Close folder** forgets it; the files and their history stay.

**Files.** Each script is one file named by its engine: `.sql` (SQL editor), `.mongodb.js` (IntelliShell, MongoDB
queries and aggregations), `.cql` (Cassandra / ScyllaDB CQL console), `.cypher` (Neo4j / Memgraph Cypher console),
`.flux` and `.influxql` (InfluxDB query console), `.redis` (Redis console), `.es` (Elasticsearch console), `.partiql`
(DynamoDB) and `.mqnb` (notebooks). A `.sql` file whose header names an InfluxDB 3 connection opens in its SQL console.
A file with no connection of its engine yet opens in Source Control's text editor, which says which connection to add. The first lines are comments that remember the connection and database by name, for example
`-- @motionql connection: Shop` and `-- @motionql database: public`, so a teammate's connection with the same name
picks the file up. Folders become folders.

- **Save to scripts folder…** in a tab's menu (or the palette) saves the tab as a file; after that **Ctrl/Cmd+S**
  saves the tab to its file, and **Save to scripts folder as…** writes a copy. A file that exists is replaced only
  after you confirm.
- The tab shows the file's Git state after its title: **M** modified, **S** staged, **U** new (not in Git yet),
  **!** merge conflict.
- **Open in editor** (in Source Control) opens a file in its engine's editor on the connection its header names, or
  the active connection of that kind. CQL files and files with no matching connection open as text in Source Control.
- **Move saved items to the scripts folder** (the arrow in the Source Control header, or the palette) writes the SQL
  editor's saved queries and the active project's saved queries and scripts as files. An item is removed from the app
  only once its file is written, and an existing file is never replaced. Dashboards stay where they are.

Saving and opening files in the scripts folder is free. The Git features below need Pro (or the trial).

**Changes and commits.** Source Control lists **Merge conflicts**, **Staged changes**, **Changes** and **Untracked
files**. Click a file for a side-by-side diff (toggle inline in the diff header); hover it to open, stage, unstage or
discard. **Discard** and deleting a new file always ask first. Type a message and **Commit** (Ctrl/Cmd+Enter). The
first commit in a repository with no `user.name` / `user.email` asks for them and sets them for that repository only.
The sparkle button next to Commit **suggests a message** with AI (screen task `scm-commit-message`): by default it
sends only file names and the shape of each changed line (statement keywords, verbs, field names), never values;
the changed lines themselves are sent only after you allow literal values in Settings > AI.

**Branches.** The branch button lists local and remote branches; type to filter, or type a new name and press Enter
to create a branch from the current commit and switch to it. Choosing a remote branch checks it out as a local branch
that tracks it. When local changes would be overwritten, MotionQL shows Git's message and switches only if you agree
to discard them.

**Fetch, pull and push.** The buttons next to the branch show progress (with Cancel) and Git's own error when one
fails. Pull merges (it never rebases); push sets the upstream on a first push and is **never forced**: when the
remote has new commits, pull first. MotionQL runs your system `git` with your credential helper and SSH agent, never
asks for a Git password and never stores one; it does not open a terminal prompt either, so set up a credential helper
or SSH key for private remotes. If Git is not installed, Source Control says how to install it, and the folder still
works for saving and opening files.

**History.** The clock button shows the folder's commits; the one on a file shows the commits that changed it. Pick a
commit to compare that revision with the working copy, then **Restore this version** (after a confirmation) puts the
old content back on disk as an ordinary change you can review and commit.

**Conflicts.** When a pull stops on merge conflicts, a note says so and the files are listed under **Merge
conflicts**, also in the status bar. Click a file to edit it: keep the lines you want between `<<<<<<<`, `=======` and
`>>>>>>>`, remove the markers, **Save**, then **Mark resolved** (it asks again if markers are left). Commit when none
are left, or **Abort merge** (after a confirmation) to go back to how things were before the pull.

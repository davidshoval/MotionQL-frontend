If you're still stuck after this page, [contact support](/support). A **diagnostics file** helps: **Settings → Diagnostics → Export diagnostics…** creates a redacted JSON file. Review it before you send it.

## Installing and starting

| Symptom | Fix |
|---|---|
| macOS: "Apple could not verify 'MotionQL' is free of malware" | Expected for the current unsigned builds. Open **System Settings → Privacy & Security** and click **Open Anyway**. See [Download and install](/docs/install#install-on-macos) |
| macOS: "MotionQL is damaged and can't be opened" | The download was corrupted or changed. Download it again from the [download page](/download) and check `SHA256SUMS.txt` |
| Windows: "Windows protected your PC" | Click **More info → Run anyway**. See [Download and install](/docs/install#install-on-windows) |
| The license agreement appears every time | MotionQL couldn't save your acceptance. Check that its data folder is writable |

## Passwords aren't remembered

MotionQL only saves secrets encrypted with your OS keychain. If the keychain is unavailable it keeps passwords for the current session only.

- **macOS:** open Keychain Access and check that your login keychain is unlocked. If you clicked **Deny** on the "MotionQL wants to use your confidential information" prompt, restart MotionQL and choose **Always Allow**.
- **Windows:** saved passwords are bound to your Windows account. On a new computer or account, re-enter them, or move connections with an **encrypted export**.

## Can't connect

Always click **Test** in the connection form first: it tells you which stage failed.

| Error | What to check |
|---|---|
| DNS, `ENOTFOUND`, SRV lookup failed | The host name and your network. Some corporate DNS servers and VPNs block SRV lookups; use the standard `mongodb://` connection string instead |
| Server selection timed out | Firewall, VPN, the Atlas IP access list, the port and the replica set name. For a replica set reachable only through one host, try **Direct connection** |
| TLS or certificate errors | The right CA file. For self-signed certificates, add the CA rather than allowing invalid certificates |
| Authentication failed | Username, password and **authentication database** (`admin` by default; `$external` for X.509, LDAP, Kerberos, AWS and OIDC) |
| `Proxy authentication failed (407)` | The proxy username or password |
| SSH host key changed | Confirm the new fingerprint with the server's administrator before accepting it |
| Works in mongosh, not in MotionQL | Paste the exact connection string. If it uses `tlsCAFile` or similar, choose the file on the TLS tab instead |
| DocumentDB, Cosmos DB or FerretDB errors | These services don't implement every MongoDB command; the error comes from the server. For DocumentDB, add `retryWrites=false` |

More detail: [Authentication methods](/docs/authentication), [TLS, SSH and proxies](/docs/tls-ssh-proxy).

## "Blocked" messages

| Message | Meaning |
|---|---|
| `Blocked: "…" is not allowed on a read-only connection.` | The connection is read-only. Turn it off on the Safety tab if you're allowed to |
| `Blocked: $where runs JavaScript on the server …` | Server-side JavaScript is off for this connection |
| `AI assistance is turned off for this connection.` | Turn on **Allow AI** on the Safety tab |
| `MotionQL is locked. Unlock it to continue.` | Unlock with your app password |
| "… needs a MotionQL license" | A Pro feature, and your trial or key has expired. [Activate a free Pro key](/docs/activate) |

## IntelliShell and SQL Query

- **"Unexpected token", or variables don't work:** IntelliShell parses commands instead of running JavaScript. Use literal values and `ObjectId("…")`, `ISODate("…")`, or turn on **Script mode**.
- **"Script stopped after … s (time limit)":** scripts stop after 60 seconds. Narrow the work, or run it as a scheduled script task.
- **SQL Query refuses `INSERT`, `UPDATE` or `DELETE`:** it's read-only by design.

## Import, export and tasks

- **Import stops with type errors:** set column types in the mapping step, or skip the column.
- **A scheduled task didn't run:** tasks run only while MotionQL is open and unlocked, unless you turned on **Run scheduled tasks when MotionQL is closed**. Check the run log in Tasks.

## License

| Problem | Fix |
|---|---|
| "This is not a MotionQL license key." | Paste the complete key, starting with `MQL1.`, without line breaks |
| "The license key signature is not valid …" | Copy the key again from your [account page](/account) |
| Pro features stopped | Your key or trial expired. Renew on your account page and paste the new key |

## App lock

- **Forgot the app password:** it can't be recovered. Quit MotionQL, delete `app-lock.json` in the data folder and restart. Your connections remain.
- **Unlock refused for a while:** after 5 wrong passwords, attempts are delayed, up to 1 hour.

## Reset MotionQL

Quit MotionQL and rename or delete its data folder: `~/Library/Application Support/motionql/` on macOS, `%APPDATA%\motionql\` on Windows. This removes saved connections, settings, saved passwords and license activation. Export your connections first (an encrypted export keeps passwords).

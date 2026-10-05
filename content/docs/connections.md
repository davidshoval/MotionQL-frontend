Open the **Connection Manager** with **Mod+N** (**File → New Connection**) or the **Connect** button. **Mod** is Cmd on macOS and Ctrl on Windows.

## Paste a connection string

The quickest way to connect is to paste a URI. MotionQL fills in the form from it:

```text
mongodb://user@db1.example.com:27017,db2.example.com:27017/?replicaSet=rs0&authSource=admin
mongodb+srv://user@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

Then click **Test**. A failed test tells you which stage failed (DNS, TLS, authentication or a timeout) in plain words. When it passes, click **Save** and **Connect**.

## Server settings

The form has tabs for **Server**, **Authentication**, **TLS**, **SSH**, **Proxy**, **Advanced** and **Safety**. On the **Server** tab you can connect to:

- a **single host** and port;
- a **seed list** of several hosts;
- a **`mongodb+srv`** SRV record, as used by MongoDB Atlas. MotionQL looks up the SRV and TXT records to find the hosts and options;
- a **Unix domain socket**: enter a host that starts with `/`, for example `/tmp/mongodb-27017.sock`.

Also on this tab:

- **Replica set** name and **read preference** (`primary`, `primaryPreferred`, `secondary`, `secondaryPreferred`, `nearest`) with tag sets.
- **Direct connection** (talk to one member only) and **load-balanced** mode.
- **Sharded clusters** connect through `mongos` like any other host.

The **Advanced** tab holds the default database, application name, compressors (`snappy`, `zlib`, `zstd`), timeouts and any other URI option.

### SRV and corporate networks

`mongodb+srv://` needs DNS that answers SRV and TXT queries. Some corporate DNS servers and VPNs block them. If the SRV lookup fails, use the standard `mongodb://` seed-list string instead, which lists every host explicitly.

## Organize connections

- **Folders**, **tags**, **colors** and an **environment** label: `dev`, `staging` or `prod`. While you are connected to a `prod` connection, a warning banner stays visible.
- **Quick connect:** assign a connection to **Mod+1…9** (or **Mod+Alt+1…9**).
- **Duplicate**, **edit** and **delete**. You can have several connections open at once.
- A **health dot** shows the last ping result, server version, replica set and latency.

## Export and import connections

Export saved connections to a file in one of two ways:

- **Without secrets:** passwords and keys are removed. Safe to share.
- **Encrypted with a password you choose** (scrypt and AES-256-GCM). Import it on another computer with the same password.

Use an encrypted export to move to a new computer: saved passwords are tied to your operating-system account and can't be decrypted elsewhere.

## Where passwords are kept

Passwords, key passphrases, tokens and API keys are encrypted with your operating system's keychain and are only ever used by MotionQL's background process. The form shows `••••••` instead of the value. If the keychain is not available, MotionQL keeps secrets for the current session only and asks you again next time.

## Next steps

- [Authentication methods](/docs/authentication)
- [TLS, SSH and proxies](/docs/tls-ssh-proxy)
- [Read-only and safety settings](/docs/connection-safety)

## TLS

On the **TLS** tab:

- Turn **TLS** on (it is on automatically for `mongodb+srv` and Atlas).
- Choose a **CA file** if your server uses a private certificate authority.
- Choose a **client certificate and key** file and its password for mutual TLS or [X.509 authentication](/docs/authentication#x509).
- **Allow invalid certificates** and **Allow invalid hostnames** exist for testing only. For self-signed certificates, add the CA file instead.

Files are picked in a native file dialog. MotionQL stores the file's path, not a copy. If your mongosh URI uses `tlsCAFile=...`, choose the same file on the TLS tab instead.

## SSH tunnels

Use an SSH tunnel when the database is only reachable from a bastion or jump host.

- **Authentication:** password, or a private key with an optional passphrase.
- **Jump hosts:** chain up to **4** hops, each with its own authentication.
- **Keepalive** settings for long-running sessions.
- **Host key pinning:** on first connect MotionQL shows the SSH server's fingerprint and remembers it. If it changes later, the connection is refused. Confirm a new fingerprint with the server's administrator before accepting it.

The SSH server must allow TCP forwarding to the MongoDB host and port. If you see "closed before it was ready", check the SSH host, port, user, key and passphrase, and that forwarding is allowed.

## Proxies

On the **Proxy** tab, choose **SOCKS5** or **HTTP** and enter the host, port and an optional username and password. A `407` error means the proxy rejected those credentials.

## Troubleshooting

| Error | What to check |
|---|---|
| TLS or certificate errors | The right CA file; for X.509, the client certificate, key and password |
| Connection timed out | Firewall, VPN, Atlas IP access list, port, replica set name. For a replica set reachable through one host only, try **Direct connection** |
| SSH host key changed | The server's key changed. It can indicate a man-in-the-middle attack; confirm before accepting |

More in [Troubleshooting](/docs/troubleshooting).

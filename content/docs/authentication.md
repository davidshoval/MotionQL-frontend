Choose the method on the connection's **Authentication** tab.

## Methods

| Method | What to enter |
|---|---|
| **None** | Nothing. For local development and trusted networks |
| **SCRAM-SHA-256 / SCRAM-SHA-1** | Username, password and authentication database (`admin` by default) |
| **X.509** (`MONGODB-X509`) | Choose the client certificate on the TLS tab. The username is optional; it is taken from the certificate |
| **LDAP** (`PLAIN`) | Username and password. Uses the `$external` database |
| **Kerberos** (`GSSAPI`) | Principal, service name (default `mongodb`) and host-name canonicalization (`none`, `forward`, `forwardAndReverse`). Needs a ticket from your OS |
| **AWS IAM** (`MONGODB-AWS`) | Leave the keys empty to use the AWS default credential chain, or enter an access key, secret key and optional session token |
| **OIDC** (`MONGODB-OIDC`) | Sign in through your browser, or use workload identity on Azure, GCP or Kubernetes |

## SCRAM

This is MongoDB's default username and password method. The most common mistake is the **authentication database**: users created in `admin` must authenticate against `admin`, even when you want to work in another database.

## X.509

1. On the **TLS** tab, turn TLS on and choose your **client certificate and key** file (PEM), plus its password if it has one.
2. On the **Authentication** tab, choose **X.509**. You can leave the username empty.

## Kerberos

Get a ticket first (`kinit user@REALM`, check it with `klist`). Set the service name if your servers don't use the default `mongodb`, and try **forward** canonicalization if the server's host name doesn't match its Kerberos principal. If Kerberos isn't offered in the list, the optional Kerberos module could not be loaded on your computer.

## AWS IAM

With empty keys, MotionQL uses the standard AWS credential chain: environment variables, your `~/.aws` profile, then an instance, ECS or EKS role. The IAM user or role must exist as a database user on `$external`.

## OIDC

For people, MotionQL opens your **system browser** to sign in (authorization code flow with PKCE on a local loopback port). Tokens are stored encrypted and refreshed automatically. To sign in as a different user, use the connection's **forget tokens** action and connect again.

For workloads, choose the `azure`, `gcp` or `k8s` environment and MotionQL uses that platform's identity.

## Shared and team connections

When a connection comes from your organization's Team Server, it never contains a password. You enter your own credentials, which stay on your computer. See [Licensing and teams](/docs/licensing-teams).

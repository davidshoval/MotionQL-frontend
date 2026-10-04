MotionQL supports MongoDB's **in-use encryption**: **Client-Side Field Level Encryption** (CSFLE) and **Queryable Encryption**. Fields are encrypted on your computer before they are sent, and decrypted when they come back, so the server only ever stores ciphertext.

Set it up on the connection's **In-Use Encryption** section.

## Turn it on

1. Open the connection and tick **Enable in-use encryption**.
2. Set the **key vault namespace**, the collection that holds your data keys (for example `encryption.__keyVault`).
3. Choose one or more **KMS providers** (where the customer master key lives) and fill in their details.
4. Optionally add an **encrypted fields map** (Queryable Encryption) or a **schema map** (CSFLE). Without a schema map, the server-side schema is used.
5. Save and connect. Encrypted fields are decrypted automatically in results.

## KMS providers

| Provider | Settings |
|---|---|
| **Local** | A 96-byte master key. **Generate** one, **import** it from a file, or paste it as base64. Keep a copy somewhere safe: without it the data can't be decrypted |
| **AWS KMS** | Access key ID, secret access key and optional session token. Leave them empty to use the default credential chain |
| **Azure Key Vault** | Tenant ID, client ID and client secret, or leave empty to use a managed identity |
| **Google Cloud KMS** | Service account email and private key, or leave empty to use the attached service account |
| **KMIP** | Endpoint, CA certificate and a client certificate and key |

All credentials and the local master key are encrypted with your OS keychain like any other saved secret.

## Data keys

From the connection you can list the **data keys** in the key vault, **create** a new data key for a KMS provider, and add or remove **alternate names**. Deleting a data key asks you to type its id or alternate name, because data encrypted with that key becomes unreadable. Key vault changes count as writes: they are blocked on read-only connections and recorded in the audit log.

## Example maps

Queryable Encryption encrypted fields map:

```json
{
  "hr.employees": {
    "fields": [
      { "path": "ssn", "bsonType": "string", "keyId": { "$uuid": "…" }, "queries": { "queryType": "equality" } }
    ]
  }
}
```

CSFLE schema map:

```json
{
  "hr.employees": {
    "bsonType": "object",
    "properties": {
      "ssn": {
        "encrypt": {
          "bsonType": "string",
          "keyId": [{ "$uuid": "…" }],
          "algorithm": "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
        }
      }
    }
  }
}
```

## Options

- **crypt_shared library:** the path to MongoDB's Automatic Encryption Shared Library. Tick **Require crypt_shared** to refuse to fall back to `mongocryptd`.
- **Bypass automatic encryption:** decrypt reads automatically but don't encrypt writes.

Automatic encryption needs a server that supports it (MongoDB Enterprise or Atlas for automatic CSFLE; Queryable Encryption needs MongoDB 7.0 or later). See MongoDB's own documentation for the server-side requirements.

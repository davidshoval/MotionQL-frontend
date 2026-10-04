## Editions

| | Free | Pro | Teams |
|---|---|---|---|
| **Price today** | $0, forever | $0 for 12 months with a free account | $0 per seat for now |
| **Key needed** | No | Yes, from your account page | Each member gets their own key |
| **Features** | Everything except the four below | Free, plus SQL Migration, Data Masking, the Tasks scheduler and MongoDB Atlas management | Pro for every member |

See [Pricing](/pricing) for the current offer.

## How keys work

- A key is a signed string that starts with `MQL1.`. It contains your name, email, edition, number of seats and expiry date.
- MotionQL verifies it **offline** against a public key built into the app. Activation sends nothing anywhere.
- To cancel keys (for example after you reissue one), MotionQL downloads a small, signed list of cancelled keys from time to time. That request carries no identifiers.
- When a key expires, Pro features stop. The app still opens, connects and shows your data, and nothing is deleted.

Get and activate a key: [Register and activate Pro](/docs/activate).

## After the first year

While the free launch offer runs, renew for another year with one click on your [account page](/account). If we ever start charging for Pro, you'll see the pricing before your year ends, and everything that's free today stays free.

## Teams

Teams let one person manage Pro keys for everyone.

1. [Create a team](/team/new) from your account.
2. **Invite** people by email. Each person accepts the invite with their own MotionQL account.
3. **Assign a seat** to a member and they receive their own Pro key, by email and on their account page.
4. Admins can **free a seat**, **reissue** a member's key or **remove** someone at any time. When you free a seat or reissue a key, the old key stops working.

Roles: **owner**, **admin** and **member**. Every change is recorded in the team's audit log.

## Deploying a key to many computers

IT teams can put a key in MotionQL's machine policy file instead of asking each person to paste one:

| Platform | Policy file |
|---|---|
| macOS | `/Library/Application Support/MotionQL/policy.json` |
| Windows | `%ProgramData%\MotionQL\policy.json` |

```json
{ "license": { "key": "MQL1.xxxxx.yyyyy" } }
```

A policy key is verified exactly like one typed in, and it can't be removed in the app. The same file can turn off updates, AI, crash reports and more; ask us for the full reference.

## Team Server (Enterprise)

Larger organizations can run a self-hosted **MotionQL Team Server** for single sign-on (OpenID Connect, optional SCIM), shared folders of connections, queries and scripts with version history, centrally enforced policies (read-only, AI off, allowed AI providers) and a central, tamper-evident audit log. Shared connections never contain passwords: each person enters their own. [Contact us](/support) if you're interested.

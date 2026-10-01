> **Template — have this reviewed by a qualified lawyer in your jurisdiction before publishing. Remove this line and fill every [FIELD] listed in legal/README.md before release.**

# XQuery Security Policy and Vulnerability Disclosure

**Effective [EFFECTIVE DATE]**

**Shoval Real Estate Holdings LLC** ("**we**") takes the security of XQuery seriously. This policy explains which versions we support, how to report a vulnerability, what you can expect from us, and the rules for good-faith research.

---

## 1. Supported versions

We fix security issues in the latest minor release of the current major version. Older releases get security fixes only as stated below.

| Product | Version | Security fixes |
|---|---|---|
| XQuery desktop app | 1.0.x (latest) | Yes |
| XQuery desktop app | Pre-releases (beta channel) | Fixed in the next pre-release and the next stable release |
| XQuery Team Server | Latest release | Yes |
| XQuery Team Server | Previous minor release | Yes, for **90 days** after the next minor release |

When a new major version is released, the previous major version receives security fixes for **12 months**.

Please update to the latest release before reporting, and tell us which version you tested.

## 2. How to report a vulnerability

**Email:** security@xquery.io

Please **do not** open a public issue, post on forums or social media, or contact support through normal channels for security issues.

Include:

- the product and version (desktop app: Settings → About; Team Server: the release you deployed);
- your operating system (desktop) or deployment method (Team Server);
- a description of the issue and its impact;
- clear steps to reproduce, or a proof of concept;
- whether the issue is already public or known to others;
- how you want to be credited, if at all.

## 3. What to expect

| Step | Target |
|---|---|
| Acknowledge your report | within **2 business days** |
| Initial assessment and severity (CVSS) | within **5 business days** |
| Status updates | at least every **14 days** until resolved |
| Fixed release | within the targets in our [Support and Service Level Policy](./SLA_AND_SUPPORT.md#5-security-fixes) |
| Public advisory | when the fix is released, coordinated with you |

We will publish a security advisory (and request a CVE where appropriate) for confirmed vulnerabilities, crediting you unless you prefer to remain anonymous. We ask that you give us **90 days** from your report, or until a fix is released if sooner, before disclosing publicly. If we cannot fix an issue in that time, we will agree a timeline with you.

We do not currently run a paid bug bounty.

## 4. Scope

**In scope:**

- the XQuery desktop app (macOS, Windows, Linux) as distributed by us, including its installers and the update mechanism;
- the XQuery Team Server, including its API, SSO and SCIM endpoints, policy signing and audit chain;
- the Team Server client SDK;
- our release infrastructure's integrity (for example, a way to get an unsigned or tampered build accepted by the updater);
- https://xquery.io and https://xquery.io/account.

Examples of issues we especially want to hear about:

- a way for the renderer (UI) process, a database response, a file, or AI output to run code or call main-process functions it should not;
- bypasses of read-only, AI or server-side JavaScript policies, or of Team Server policy floors;
- secrets (passwords, keys, tokens) written in plain text, logged, sent to an AI provider or the Team Server, or exposed to the renderer;
- authentication, authorization or tenant-isolation flaws in the Team Server;
- tampering with the Team Server audit chain that verification does not detect;
- installing an update that is not signed by us.

**Out of scope:**

- vulnerabilities in databases, AI providers, identity providers or other third-party services you connect XQuery to (report those to the vendor);
- attacks that require an already-compromised device or administrator access on the user's machine or the Team Server host (the product's threat model treats these as out of scope; see the [Security Whitepaper](../docs/SECURITY_WHITEPAPER.md));
- missing hardening that has no demonstrable security impact, such as missing headers on static marketing pages;
- denial-of-service through volumetric traffic, and findings from automated scanners without a demonstrated impact;
- social engineering of our staff or customers, and physical attacks;
- vulnerabilities in third-party dependencies without a demonstrated exploit path in XQuery (please still tell us; we track them through our normal dependency updates);
- the "Allow invalid certificates" and "Allow invalid hostnames" TLS options, which are explicitly unsafe opt-ins.

## 5. Safe harbor

If you make a good-faith effort to follow this policy, we will not pursue legal action against you, and we will not ask law enforcement to investigate you, for your research. We consider such research authorized under applicable anti-hacking and anti-circumvention laws, and we waive restrictions in our EULA and Terms that would otherwise prohibit it (such as reverse engineering), to the extent needed for the research.

Good faith means that you:

- test only against your own installations and accounts, or systems you have permission to test;
- do not access, modify or keep other people's data beyond the minimum needed to demonstrate the issue, and delete it afterwards;
- do not degrade our services or other users' experience;
- give us reasonable time to fix the issue before disclosing it;
- do not demand payment in exchange for not disclosing.

If a third party brings legal action against you for research that followed this policy, we will make it known that your actions were authorized by us.

## 6. Our security practices

A summary of how XQuery is built and released securely (process isolation, encrypted secret storage, main-process policy enforcement, signed updates, CodeQL, Dependabot, `npm audit`, SBOMs and build-provenance attestations) is in the [Security Whitepaper](../docs/SECURITY_WHITEPAPER.md).

## 7. security.txt

We publish the following at `https://xquery.io/.well-known/security.txt` (RFC 9116). A template is kept in the repository at [`docs/.well-known/security.txt`](../docs/.well-known/security.txt).

```text
Contact: mailto:security@xquery.io
Expires: 2027-09-30T00:00:00.000Z
Acknowledgments: https://xquery.io/security/hall-of-fame
Preferred-Languages: en
Canonical: https://xquery.io/.well-known/security.txt
Policy: https://xquery.io/security-policy
```

Sign the file with the PGP key above (`gpg --clearsign security.txt`) and renew it before the `Expires` date.

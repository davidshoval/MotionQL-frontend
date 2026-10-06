# MotionQL Privacy Policy

**Effective 6 October 2026**

This policy explains what personal data **David Shoval**, an individual residing in Israel, trading as MotionQL ("**we**", "**us**"), collects in connection with the MotionQL desktop application (the "**App**"), the self-hosted MotionQL Team Server, our website at https://motionql.com, purchases, license activation and support, how we use it, and your rights.

**Controller:** David Shoval, trading as MotionQL, Uri Zvi Grinberg St. 31, Holon, Israel. Contact: privacy@motionql.com.
**Data protection officer (if appointed):** We have not appointed a data protection officer because we are not required to. Privacy questions go to privacy@motionql.com.
**EU and UK individuals:** If you are in the European Union or the United Kingdom, you can contact us at privacy@motionql.com about any privacy matter, and you can also contact your local data protection supervisory authority (section 10.1).

---

## 1. The short version

- **Your databases are not our business.** The App runs on your computer and connects directly to the databases you choose. We do not receive the contents of your databases, your queries, your connection settings or your credentials.
- **Usage statistics only if you allow them.** If you choose "Allow" when the App first asks, it sends us, at most once a day, a small usage record (a random installation id, App version, operating system, edition and, for paid licenses, a hash of your license id) so we can count active installations and check license use. It never includes your databases, queries, credentials, name, email or IP address. Nothing is sent until you allow it; you can change your mind in Settings → Diagnostics, and your administrator can turn it off for your organization (section 2.8).
- **We do not collect crash reports.** Crash reporting is off. Crash snapshots (minidumps) are uploaded only if your organization's administrator sets up the organization's own crash-report server and you turn crash reporting on; they then go to that server, not to us (section 2.4).
- **License keys are checked offline.** Activating a license does not send your data to us.
- **AI goes to your provider, not to us.** If you use AI features, requests go directly from your computer to the AI provider you configure, with your own API key.
- **The Team Server is yours.** If your organization runs the Team Server, it runs on your organization's infrastructure; your organization is responsible for the data in it.
- We collect personal data when you **visit our website, buy a license, create an account, or contact support**, as described below.

## 2. What the App does and does not collect

### 2.1 Data that stays on your device

The App stores the following **only on your device**, in your user profile folder (see the [Installation Guide](../docs/INSTALLATION.md#data-locations)):

- saved connections and their settings;
- database, SSH and proxy passwords, SSH key passphrases, TLS key passwords, AWS secret keys and session tokens, OIDC tokens, AI API keys, SQL source passwords and Team Server tokens, **encrypted with your operating system's secure storage** (macOS Keychain, Windows DPAPI, or a Linux secret service). Key and certificate files are referenced by their path on your device, not copied;
- settings, keyboard shortcuts, query history, snippets, dashboards and scheduled tasks;
- **document version history**: when you create, edit or delete a document in MotionQL, the App keeps copies of up to 50 earlier versions of that document on your device so you can revert. These copies can contain whatever personal data the document contains. They are stored in the App's data folder without additional encryption, so protect your device (for example with full-disk encryption) and delete the data folder when you no longer need it;
- a **local audit log** of write operations and security events (who, what, when, which connection and database, and whether it succeeded). Credentials are removed from audit entries.

We do not have access to this data. It is not sent to us.

### 2.2 Network connections the App makes

The App connects to:

| Destination | When | What is sent |
|---|---|---|
| Your database servers, SSH servers and proxies | When you connect | Whatever the database protocol requires, including your credentials, directly to that server |
| Your identity provider (MongoDB OIDC, Team Server SSO) | When you sign in | Standard OpenID Connect sign-in in your system browser |
| The AI provider you configure (Google Gemini, Anthropic Claude or an OpenAI-compatible endpoint) | Only when you use an AI feature on a connection where AI is allowed | See section 2.3 |
| Our product service (`api.motionql.com` by default, or a server your administrator configures) | Notice list: about every 4 hours. Usage record: at most once a day, only if you allowed usage statistics. Neither in offline mode | Notice list: nothing about you (no identifier, cookie or body). Usage record: see section 2.8 |
| The update server (our GitHub Releases page by default, or a server your administrator configures) | When checking for updates, unless turned off | Standard HTTPS request headers including your IP address, the App version and platform in the request, as needed to find the right update |
| Your organization's Team Server | Only if you sign in to one | Your sign-in, your organization's shared items, and your local audit events |
| Your organization's crash-report server (we do not operate one) | Only if your administrator configures one and you opt in | See section 2.4 |
| MongoDB Atlas Administration API | Only if you add Atlas credentials and use Atlas features | See section 2.7 |

The update server by default is GitHub, Inc., which processes your IP address and request metadata under its own privacy statement when the App downloads update information. Your administrator can turn update checks off or use an internal server.

### 2.3 AI features

AI features are optional and off for each connection until enabled. When you use one, your request goes **directly from your computer to the AI provider you configured**, using **your own API key**. We are not a party to that exchange and do not receive it. The provider processes it under your agreement with that provider.

The App builds the request on your device and is designed to include only: your request text; database, collection and field names; field types; index definitions; the structure of query plans; and, where applicable, the query, pipeline or error message you are working on, after known credential patterns are removed. For some features you can choose to include **value pattern labels** (for example "this field looks like an email address"); the values themselves are not sent. The App does not send passwords, connection strings or API keys to the provider.

Field names, queries and error messages can themselves contain personal data. Review your AI provider's terms and your organization's rules before using AI features, or leave them off.

### 2.4 Crash reports (not collected by us)

The App uses the crash reporter built into its Electron runtime (Crashpad). When the App's process crashes, a **minidump** is written to your device (in the `Crashpad` folder inside the App's data folder). **We do not operate a crash-report service, and the App as we distribute it has no crash-report server configured, so minidumps stay on your device.** They are uploaded only if your administrator configures your organization's own crash-report server through the enterprise policy file **and** you turn on "Send crash reports" in Settings → Diagnostics; they then go to that server, and your organization is responsible for them. Your administrator can also turn uploads off; a policy can never turn uploads on for you.

A minidump is a technical snapshot of the crashed process: App name and version, operating system and version, CPU architecture, loaded modules, the call stacks and register state of its threads, and **small portions of process memory** around them. Because it captures memory, a minidump can incidentally contain fragments of whatever the App was handling at that moment, which could include parts of database documents or other data. When the report is uploaded, the receiving server also sees your IP address.

We do not receive crash reports. If we ever offer our own crash-report service, we will update this policy first, and uploads will still require you to turn crash reporting on.

### 2.5 Diagnostics file (you decide)

Settings → Diagnostics → **Export diagnostics…** saves a JSON file on your device containing App and OS versions, license status (state, edition, license id, days left), update and crash-report status, recent App log messages and your 50 most recent audit-log entries, with credentials and connection strings redacted. The App never sends this file anywhere. If you choose to send it to our support team, we handle it as support data (section 3). Please review it first.

### 2.6 License activation

Paid licenses use a digitally signed License Key that the App verifies **offline**, on your device. Activation does not send data to us. The License Key itself contains a license id, the licensee (customer) name and email, the edition, the number of seats, issue and expiry dates, and any extra features, as set when you bought it. The 14-day trial is tracked in a file on your device. Your acceptance of the EULA (version and time) is also recorded only on your device.

If you allowed usage statistics and a paid license is active, the usage record includes a one-way hash of your license id (section 2.8).

### 2.7 Other third parties the App contacts

- **MongoDB Atlas Administration API** (`cloud.mongodb.com`): only if you add Atlas credentials (a service account or API key, stored encrypted on your device) and use the Atlas features. MongoDB, Inc. processes these requests under your agreement with MongoDB.

### 2.8 Usage statistics, required updates and in-app notices

**When.** After you accept the EULA, the App asks once whether to send usage statistics ("Allow" or "No thanks", with a "What is sent" link). **Nothing is sent unless you choose "Allow".** If you do, the App sends our product service, at most once a day, a record containing only:

| Field | Example | Why |
|---|---|---|
| Installation id | a random value such as `3f9c…`, created by the App on first run | Count each installation once, without knowing who you are |
| App version and release channel | `1.4.2`, `stable` | Know which versions are in use; decide when an update is required |
| Operating system and architecture | `macOS 15`, `arm64` | Plan platform support |
| Edition (also shows the license state) | `free`, `trial`, `pro` or `enterprise` | Count free, trial and paid use |
| Hash of the license id | a one-way SHA-256 value, only while a paid License Key is active | See how many installations use each License Key, to support seat compliance and detect leaked keys |
| First seen, last seen | dates, recorded by our server | Count active installations over time |

The installation id is not derived from your hardware, user name, network or any account. The record **never** contains database contents, database names or addresses, queries, connection strings, credentials, file paths, your name, email, user or machine name, or your locale. Our server necessarily receives your IP address to answer the request; **we do not store it**, and our servers are configured not to log it.

**Notices and required updates.** Separately, about every 4 hours, the App downloads a signed list of notices and the minimum supported App version (EULA sections 8.5 and 8.6). That download sends no identifier, cookie or other information about you; the App decides on your device which notices apply to its version, platform and edition. It works the same whether usage statistics are on or off.

**Linking to you.** We do not know which person an installation id belongs to. Because we keep a record of the License Keys we issue, we could link a license id hash to the customer who bought that License Key; we do so only to handle license compliance (for example if a key is used on far more installations than its seats) and to answer your requests. We treat these records as personal data for that reason.

**Your choices.** Change your choice at any time in **Settings → Diagnostics**. Your administrator can turn usage statistics off for every device through the enterprise policy file (`productService.disableUsageStats`, or `productService.disabled` to stop all contact with our product service), and the App sends none when the `DO_NOT_TRACK` or `MOTIONQL_DISABLE_USAGE_STATS` environment variable is set or in offline mode. With usage statistics off, every feature, notice and update keeps working.

**Legal basis (GDPR / UK GDPR):** your consent (Art. 6(1)(a)), given by choosing "Allow", which you can withdraw at any time in Settings → Diagnostics without affecting earlier processing. Storing the installation id on your device is also covered by that consent. **Retention:** an installation record is deleted 25 months after it was last seen. We keep aggregated counts (for example "installations per version per month") that cannot identify anyone, without time limit.

## 3. Data we collect when you deal with us

| Category | Examples | Purpose | Legal basis (GDPR / UK GDPR) | Retention |
|---|---|---|---|---|
| Account data | Name, email, company, password hash, account settings, Free Launch License issued | Create and manage your account, issue your Free Launch License | Contract (Art. 6(1)(b)) | Life of account plus 12 months |
| Purchase and billing data | Name, billing address, VAT/tax ID, order history, license keys issued, last digits and type of card (full card numbers are held by our payment provider) | Process orders, issue licenses, invoicing, tax and accounting | Contract; legal obligation (Art. 6(1)(c)) | As required by tax law, typically 10 years |
| Support data | Your messages, contact details, attachments you choose to send | Answer support requests, improve documentation | Contract; legitimate interests (Art. 6(1)(f)) | 3 years after the ticket closes |
| Website data | IP address, browser type, pages visited, referrer, cookie identifiers | Operate and secure the website and the license service (the product service does not log IP addresses) | Legitimate interests | Server logs, including IP addresses, 30 days |
| Marketing preferences | Email, newsletter consent, unsubscribe records | Send product news if you opt in | Consent (Art. 6(1)(a)) | Until you unsubscribe, plus suppression record |
| Usage statistics | See section 2.8 | Count installations, plan platform support, license compliance | Consent | 25 months after last seen; aggregated counts kept |
| Security reports | Your report and contact details | Handle vulnerability reports | Legitimate interests | 3 years |

**Please do not send us database contents, credentials or connection strings in support requests.** If you do, we will delete them once they are no longer needed to resolve your request.

We do not sell personal data, and we do not "share" it for cross-context behavioral advertising (as those terms are defined in the CCPA/CPRA). We do not use your data to train AI models.

## 4. Cookies

The Website uses only cookies that are strictly necessary to operate it (for example, session and checkout cookies, and, if and when we offer paid Editions, those set by our payment provider during checkout). We do not use analytics or advertising cookies. If that changes, we will ask for your consent first through a cookie banner and update this policy. The App does not use cookies for tracking.

## 5. Team Server

If your organization runs the MotionQL Team Server, **your organization is the controller** of the data in it (user accounts, roles, sign-in and audit events, shared items). The Team Server runs on infrastructure your organization chooses; we do not host it or have access to it. Contact your organization's administrator about that data.

## 6. Who we share data with

We share personal data only with:

- **service providers (processors)** who help us run our business, under contracts that require them to protect it and use it only on our instructions (section 7);
- **payment providers and resellers** who process your order;
- **professional advisers**, such as accountants and lawyers, under confidentiality obligations;
- **authorities**, when required by law or to protect our rights, and then only as necessary;
- **a successor**, if our business is sold or merged, subject to this policy.

## 7. Sub-processors

| Provider | Purpose | Location | Transfer safeguard |
|---|---|---|---|
| Render Services, Inc. | Hosting of the Website, customer accounts, license issuing and the product service (API), and their logs | Frankfurt, Germany (EU) | Hosted in the EU; EU Standard Contractual Clauses and UK International Data Transfer Addendum for any access from outside the EEA |
| MongoDB, Inc. (MongoDB Atlas) | Database for Website accounts and the licenses we issue | The cloud region selected for our cluster | EU Standard Contractual Clauses and UK International Data Transfer Addendum |
| Resend | Transactional email (account emails, License Keys) | United States | EU Standard Contractual Clauses and UK International Data Transfer Addendum |
| ImprovMX | Forwarding of email sent to our @motionql.com addresses to our mailbox | The provider's servers, which may be outside the EEA | EU Standard Contractual Clauses and UK International Data Transfer Addendum |
| Google LLC (Gmail) | Our mailbox, where we receive and answer email, including support and privacy requests | United States and other Google locations | EU Standard Contractual Clauses and UK International Data Transfer Addendum |
| GitHub, Inc. | Hosting of release downloads (installers) and update metadata | United States | EU Standard Contractual Clauses and UK International Data Transfer Addendum |

AI providers (Google Gemini, Anthropic Claude and OpenAI-compatible endpoints) are **not** our sub-processors: when you turn AI features on, the App contacts the provider you choose directly, with your own API key (section 2.3). We do not use a helpdesk or crash-reporting provider. If and when we offer paid Editions, we will add our payment provider to this list before it processes your data.

We keep this list current at https://motionql.com/legal/subprocessors and notify business customers who have signed our DPA of changes as described there.

## 8. International transfers

We are based in Israel, which the European Commission and the United Kingdom recognize as providing an adequate level of data protection (an adequacy decision). Some of our service providers are located outside the European Economic Area, the United Kingdom or your country. Where we transfer personal data from the EEA or UK to a country without an adequacy decision, we use the European Commission's Standard Contractual Clauses (and the UK International Data Transfer Addendum) or another lawful transfer mechanism, together with additional safeguards where needed. You can ask us for a copy at privacy@motionql.com.

## 9. Security

We protect personal data with appropriate technical and organizational measures, including encryption in transit, access controls and least-privilege access for our staff. The App itself encrypts secrets with your operating system's secure storage and does not send your database data to us. See our [Security Whitepaper](../docs/SECURITY_WHITEPAPER.md).

## 10. Your rights

### 10.1 EEA and UK (GDPR / UK GDPR)

You have the right to access your personal data, to have it corrected or erased, to restrict or object to processing, to data portability, and to withdraw consent at any time (without affecting processing before withdrawal). You can object at any time to processing based on legitimate interests, and to direct marketing. You also have the right to lodge a complaint with your local data protection authority (in the UK, the Information Commissioner's Office). We do not make decisions based solely on automated processing that produce legal or similarly significant effects.

### 10.2 California (CCPA/CPRA) and other US states

If you are a California resident, you have the right to know what personal information we collect, use and disclose; to request deletion and correction; to opt out of the sale or sharing of personal information (we do not sell or share it); to limit the use of sensitive personal information (we do not use it for purposes that require this right); and not to be discriminated against for exercising your rights. The categories of personal information we collect in the past 12 months are: identifiers (name, email, IP address, the App's random installation id and a hash of your license id), commercial information (purchase history), internet activity (website usage), device and product information (App version, operating system, edition), and, if you send them, professional information (company). Sources, purposes and recipients are described in sections 3, 6 and 7. You can use an authorized agent to make a request. Residents of other US states with comparable laws have similar rights.

### 10.3 How to exercise your rights

Write to privacy@motionql.com. We will verify your request (usually by confirming it from the email address on your account) and respond within the period the law requires (one month under GDPR, 45 days under CCPA, extendable where permitted). For data held only on your device by the App, you control it directly: see "Uninstall and data locations" in the [Installation Guide](../docs/INSTALLATION.md#uninstalling).

## 11. Children

Our products are intended for professionals and are not directed at children under 16. We do not knowingly collect personal data from children.

## 12. Changes

We will post updates to this policy with a new effective date. If a change is material, we will notify account holders by email or through the Website before it takes effect.

## 13. Contact

David Shoval, trading as MotionQL, Uri Zvi Grinberg St. 31, Holon, Israel · privacy@motionql.com

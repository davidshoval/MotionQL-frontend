# MotionQL End User License Agreement

**Version:** 1.1.0 · **Effective:** 6 October 2026

This End User License Agreement (the "**Agreement**") is between **David Shoval**, an individual residing in Israel, trading as MotionQL, of Uri Zvi Grinberg St. 31, Holon, Israel ("**we**", "**us**", "**our**"), and the person or legal entity that installs, activates or uses the Software ("**you**", "**your**"). If you accept this Agreement on behalf of an organization, you confirm that you have authority to bind that organization, and "you" means that organization.

By installing, activating or using the Software, you agree to this Agreement. If you do not agree, do not install or use the Software.

If you and we have signed a separate written agreement that covers the Software (for example an enterprise master agreement), that agreement takes precedence over this one where they conflict.

---

## 1. Definitions

- **"Software"** means the MotionQL desktop application for macOS, Windows and Linux, including its updates, documentation, and any license keys we provide. It does not include Third-Party Components (section 9) or Third-Party Services (section 11).
- **"Team Server"** means the self-hosted MotionQL Team Server software. Its use is governed by the Terms of Service and the Order, and by this Agreement to the extent it applies to software you install.
- **"Edition"** means the version of the Software you are licensed for: **Free** (no License Key), **Trial**, **Pro** or **Enterprise**, as stated in your Order or License Key. A Free Launch License (section 3A) is a Pro Edition license. Editions differ in features and permitted use.
- **"Licensed Features"** means the features that need a Trial or a License Key. In version 1.0 these are: SQL Migration, Data Masking, the Tasks scheduler, Atlas management, and Team Server integration. All other features of the Software are "**Free Features**".
- **"Order"** means an order form, online checkout, quote, invoice or subscription confirmation through which you purchase a license from us or an authorized reseller.
- **"License Key"** means the digitally signed license file or string we issue to activate a paid Edition or a Free Launch License.
- **"Authorized User"** means an individual person you permit to use the Software under a license you hold.
- **"Customer Data"** means all data you access, view, query, create, import, export, transform or store using the Software, including the contents of your databases, your queries, scripts, connection settings and credentials.
- **"Subscription Term"** means the period stated in your Order, or, for a perpetual license, the maintenance period stated in the Order.

## 2. License grant

2.1 **General.** Subject to your compliance with this Agreement and payment of applicable fees, we grant you a non-exclusive, non-transferable, non-sublicensable, revocable (only as described in section 14) license to install and use the Software in object-code form, for the Edition, number of Authorized Users and term stated in your Order.

2.2 **Per Edition.** Unless your Order states otherwise:

| Edition | Features | Who may use it | Devices | Permitted purpose |
|---|---|---|---|---|
| **Free** | Free Features only | Any individual | Any device the individual uses | Any lawful purpose, **including commercial use** by individuals and organizations |
| **Trial** | Free Features and all Licensed Features | Any individual evaluating the Software | Any device the individual uses | Evaluation only, for the Trial Period (section 3) |
| **Pro** | Free Features, SQL Migration, Data Masking, Tasks scheduler, Atlas management, and any extra features named in the License Key | The number of named Authorized Users ("seats") in the License Key | Up to **3** devices per Authorized User | Internal business purposes of you and your Affiliates |
| **Enterprise** | All features, including Team Server integration | The number of named Authorized Users ("seats") in the License Key | Up to **3** devices per Authorized User | Internal business purposes of you and your Affiliates; includes the Team Server license described in the Terms of Service |

"Affiliate" means an entity that controls, is controlled by, or is under common control with you, where "control" means more than 50% of the voting interests.

2.3 **Named users.** A license for an Authorized User may not be shared, pooled or used concurrently by different people. You may reassign a license from one person to another permanently (for example when an employee leaves), but not more often than **once every 30 days**, except to replace a person who has left your organization.

2.4 **Copies.** You may make a reasonable number of copies of the installers for backup, deployment and archival purposes, and deploy the Software through your software-distribution tools (for example MDM, Group Policy or configuration management) to devices used by Authorized Users.

2.5 **Documentation.** You may copy and use the documentation internally in support of your licensed use.

## 3. Trial

3.1 When the Software is first started on a device, the Licensed Features are available for a trial period of **14 days** (the "**Trial Period**"), solely to evaluate whether to buy a license.

3.2 At the end of the Trial Period, the Licensed Features stop working until you enter a valid License Key. The Free Features keep working under the Free Edition. Your data, saved connections, tasks and settings on your device are not deleted, and you can still view and remove items you created with Licensed Features.

3.3 You may not reset, extend or circumvent the Trial Period (for example by reinstalling, changing the system clock, or using multiple accounts), except with our written permission.

3.4 **The Software is provided during the Trial Period "as is", without any warranty, indemnity, service level or support obligation**, and our total liability for the Trial is limited to **USD 100**, to the extent permitted by law.

## 3A. Free launch license

3A.1 **What you get.** During our launch period, every person who registers an account on our website at https://motionql.com (the "**Website**") can obtain, **at no charge**, a License Key for the **Pro** Edition (a "**Free Launch License**"). A Free Launch License is valid for **12 months** from the date we issue it, as shown by the expiry date in the License Key. Unless the License Key states otherwise, it covers one Authorized User, and section 2.2 applies to it as to the Pro Edition.

3A.2 **No fees, no warranty, no support, no refunds.** You pay no fees for a Free Launch License. **A Free Launch License and the Software used under it are provided "as is", without any warranty (including the limited warranty in section 12.1), indemnity, service level or support obligation.** Because no fees are paid, there is nothing to refund. We may answer questions sent to support@motionql.com on a best-effort basis. Our liability is limited as set out in section 13 for licenses for which no fees were paid.

3A.3 **After the free period.** When a Free Launch License expires, the Licensed Features stop working and you may keep using the Free Features under the Free Edition, as described in section 14.4. If and when we offer paid Editions, you may choose to buy one at the prices listed on the Website at the time of your Order. We will announce those prices later, and they may change. **You will not be charged automatically:** we do not ask for payment details for a Free Launch License, and nothing is bought unless you place an Order.

3A.4 **The offer.** We may end the launch offer for new registrations at any time, and may limit the number of Free Launch Licenses one person or organization can obtain. Ending the offer does not shorten a Free Launch License already issued. We may revoke a Free Launch License obtained with false registration details or used in breach of this Agreement.

## 4. License keys and activation

4.1 Paid Editions and Free Launch Licenses are activated with a License Key. License Keys are digitally signed (Ed25519) and the Software verifies them **offline** on your device, so activation works without an internet connection and does not itself send data to us. Your administrator may also deploy a License Key to your device through the enterprise policy file. If you allow usage statistics (section 7.6), they include a one-way hash of your license id, which lets us see how many installations use a License Key.

4.2 A License Key identifies the license, the licensee name and email, the Edition, the number of seats, the issue and expiry dates, and any extra features. You must keep License Keys confidential and must not publish, share or resell them.

4.3 You must not create, modify, forge or distribute License Keys, or remove, disable or circumvent any license verification in the Software.

4.4 **Prices and editions.** If and when we offer paid Editions, their prices are as listed on the Website at the time of your Order. Prices, the features included in each Edition, and the Editions we offer for new purchases may change over time, as described in the Terms of Service. A change does not reduce the features of a License Key you already hold during its term.

4.5 When a subscription ends and is not renewed, the License Key expires and the Licensed Features stop working as described in section 14.4.

## 5. Restrictions

Except as expressly permitted by this Agreement or by mandatory law, you must not, and must not allow anyone else to:

1. copy, modify, translate, or create derivative works of the Software;
2. decompile, disassemble or reverse engineer the Software, or attempt to derive its source code, except to the extent that applicable law (for example, for interoperability) expressly permits this despite this restriction, and then only after first asking us for the information;
3. rent, lease, lend, sell, sublicense, distribute or otherwise make the Software available to any third party, including as a hosted, managed or time-sharing service, except that your contractors may use it on your behalf as Authorized Users;
4. use the Software beyond the Edition, number of Authorized Users, devices or term you are licensed for;
5. remove, alter or obscure any proprietary notices, labels or marks;
6. circumvent or disable any technical measure in the Software, including license checks and enterprise policy enforcement (this does not restrict administrators from configuring policies as documented);
7. use the Software to build a competing product, or publish benchmarks of the Software without our prior written consent, where such a restriction is permitted by law;
8. use the Software in breach of our Acceptable Use Policy or of applicable law, including to access databases or systems you are not authorized to access.

## 6. Ownership

6.1 The Software is licensed, not sold. We and our licensors own all rights, title and interest in the Software, including all intellectual property rights. All rights not expressly granted to you are reserved.

6.2 If you give us suggestions or feedback about the Software, we may use them without restriction or obligation to you. Feedback does not include Customer Data.

## 7. Customer Data

7.1 **You own your Customer Data.** Nothing in this Agreement gives us any right to Customer Data.

7.2 **Local processing.** The Software runs on your device and connects directly to the databases, SSH servers, proxies and services you configure. It does not send Customer Data to us. In particular:

- saved connections, credentials, SSH keys, API keys, tokens and settings are stored on your device, and secrets are encrypted with your operating system's secure storage (macOS Keychain, Windows DPAPI, or a Linux secret service such as GNOME Keyring or KWallet);
- the local audit log is written to your device only;
- the Software sends data to third parties only when you configure or use a feature that needs it (for example, a database server, an AI provider (section 11), the MongoDB Atlas Administration API, a Team Server, or an update server), and the usage statistics described in section 7.6, which contain no Customer Data.

7.3 **Your responsibility.** You are responsible for Customer Data, for having the rights and authorizations needed to access and process it, for configuring the Software (including read-only, AI and server-side JavaScript policies) appropriately for your data, and for keeping backups. The Software can modify or delete data in your databases when you instruct it to; we are not responsible for loss of data caused by operations you or your Authorized Users run.

7.4 **Diagnostics.** We do not operate a crash-report service and do not collect crash reports. Crash reports are uploaded only if your administrator configures your organization's own crash-report server through the enterprise policy file **and** you turn crash reporting on; they then go to that server, not to us, as described in our Privacy Policy. Crash reporting is off unless you turn it on, you can turn it off at any time, and your administrator can prevent it. A crash report is a technical snapshot of the crashed process and may incidentally contain fragments of data the Software was handling at the time of the crash. You may also export a diagnostics file and choose to send it to support; you control whether and what you send.

7.5 **Team Server.** If you deploy the Team Server, you host it and control the data in it. The Team Server stores user accounts, roles, policies, audit events and shared items such as queries and connection settings. It is designed to never store database passwords or other database credentials; each user's credentials stay on that user's device.

7.6 **Usage statistics.** To know how many people use the Software, to plan support for platforms and versions, and to check that License Keys are used within their licensed seats, the Software can send our product service a small usage record at most once a day. **It sends nothing unless you choose "Allow" when the Software first asks you, after you accept this Agreement.** The record contains only: a random installation identifier created by the Software (not derived from your hardware or accounts), the Software version and release channel, operating system and processor architecture, the Edition (which also shows whether you are using the free, trial or paid version), and, only while a paid License Key is active, a one-way hash of the license id. Our service records when each installation was first and last seen. **It never contains Customer Data, database names or addresses, queries, credentials, file paths, your name, email, user or machine name, or your IP address** (our server necessarily sees the IP address of the connection but does not store it). You can change your choice at any time in Settings → Diagnostics, your administrator can turn them off through the enterprise policy file, and the Software also sends none when the DO_NOT_TRACK environment variable is set or in offline mode. Turning them off does not affect any feature. Our Privacy Policy describes this processing in detail.

## 8. Updates

8.1 During your Subscription Term (or maintenance period for perpetual licenses), we may make updates available. Updates are governed by this Agreement unless we provide different terms with the update.

8.2 The Software can check for, download and install updates over HTTPS from our release server or an update server you designate. Updates are verified against our code signature before installation. Installing an update requires an action by the user, or an explicit opt-in to "install on quit".

8.3 Your administrators can turn automatic update checks off, or point the Software at an internal update server, using the enterprise policy described in the Admin Guide.

8.4 We are not obliged to provide updates beyond those included in your Order, or to support versions other than those listed in our Security Policy as supported.

8.5 **Required updates and end of support.** We may end support for older versions of the Software and designate a minimum supported version, for example to fix a security vulnerability, to keep compatibility with database servers or our services, or to correct a defect that risks your data. When your version is below that minimum, the Software will tell you and ask you to update, and, after any cut-off date shown in that message, **we may restrict use of the Software, other than updating it, managing its license and unlocking it, until you install the update**. A required update never deletes or changes your Customer Data, saved connections or settings, and you can always export your saved connections or uninstall the Software. Required-update requests from us do not apply when your administrator has turned required updates or automatic updates off, or points the Software at an internal update server or the organization's own product service, through the enterprise policy file; your administrator is then responsible for keeping the Software up to date. Installing an update always requires a click by the user.

8.6 **In-app notices.** The Software periodically downloads a list of notices from our product service and may show you short messages about security issues, required or available updates, licensing, service changes and new features. That download sends no identifier and no information about you or your installation; the Software chooses which notices to show on your device, from its version, platform and Edition. Notices are digitally signed by us, and the Software ignores notices that are not. We will not use in-app notices to show third-party advertising. You can hide notices about new features; notices about security, updates and licensing cannot be hidden by the user. Your administrator can hide all notices, point the Software at the organization's own product service, or turn off all contact with our product service, through the enterprise policy file, and offline mode stops the download.

## 9. Open-source and third-party components

9.1 The Software includes software components licensed by third parties under open-source licenses ("**Third-Party Components**"), including Electron and Chromium. A list of these components and their licenses is provided in the THIRD_PARTY_NOTICES file that accompanies the Software and is available from https://motionql.com. The Electron and Chromium notices can also be opened in the app from Settings → About → Open third-party licenses.

9.2 Your use of each Third-Party Component is governed by its own license. Nothing in this Agreement restricts rights you have under those licenses. Where an open-source license requires us to make source code available, we will do so as described in the notices file or on request to support@motionql.com.

## 10. Enterprise controls

The Software supports machine-wide policy files and per-connection policies (such as read-only, AI and server-side JavaScript restrictions) that your administrators can set. These controls reduce risk but do not guarantee that data cannot be changed or disclosed, for example by a user who has administrative rights on the device or direct access to the database with the same credentials. You remain responsible for your database access controls.

## 11. AI features and third-party AI providers

11.1 **Optional.** AI features are optional. They are off for each connection until you turn them on for that connection, and administrators can turn them off by policy (per connection, or across the organization when a Team Server is used). An offline mode prevents any AI request.

11.2 **Your provider, your key.** AI features work only with an AI provider account that **you** configure: Google Gemini, Anthropic Claude, or an endpoint compatible with the OpenAI API (which may be hosted by a third party, by you, or run locally). You supply your own API key. **The AI provider is a Third-Party Service. Your use of it is governed by your agreement with that provider, not by this Agreement, and you are responsible for that relationship, including its costs, its data handling, retention and training practices, and its location.**

11.3 **What is sent.** When you use an AI feature, the Software sends the provider your request text and a context it builds on your device. The context is designed to contain database, collection and field names, field types, index definitions and query plan structure, and, only where you choose to include them, labels describing value patterns (for example "email" or "phone number") rather than the values themselves. Depending on the feature, it may also include the query, pipeline or error message you are working on, after known credential patterns are removed. The Software is designed not to send passwords, connection strings, API keys or document values in bulk. You should nevertheless review whether names, queries and error text in your environment are themselves sensitive, and configure AI features accordingly.

11.4 **No warranty on output.** AI output can be wrong, incomplete or unsafe. The Software validates suggestions before displaying them, but you are responsible for reviewing any AI-generated query, pipeline, index, mask rule or other output before you run or rely on it. We do not warrant AI output and are not liable for the results of running it.

11.5 **Third-Party Services generally.** The same applies to any other third-party service you connect the Software to (for example database hosting, identity providers, SSH servers or proxies). We do not control and are not responsible for them.

## 12. Warranty and disclaimer

12.1 **Limited warranty (paid Editions).** This warranty applies only to paid licenses bought under an Order, if and when we offer paid Editions. **During the free launch period there is no warranty and no refund:** this section does not apply to a Free Launch License (section 3A). For **30** days from the date you first obtain a paid license (the "**Warranty Period**"), we warrant that the Software will perform substantially as described in its documentation. Your sole remedy, and our sole obligation, for breach of this warranty is, at our option, to correct the non-conformity or to terminate the license and refund the fees you paid for the non-conforming Software for the then-current term. This warranty does not apply to Trial use, to problems caused by your modifications, misuse, third-party products or services, or use not in accordance with the documentation.

12.2 **Disclaimer.** EXCEPT FOR THE EXPRESS WARRANTY IN SECTION 12.1, AND TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SOFTWARE, AI FEATURES AND ANY THIRD-PARTY COMPONENTS ARE PROVIDED "AS IS" AND "AS AVAILABLE", AND WE DISCLAIM ALL OTHER WARRANTIES, WHETHER EXPRESS, IMPLIED OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE OR UNINTERRUPTED, THAT IT WILL PREVENT DATA LOSS, OR THAT IT WILL WORK WITH EVERY DATABASE VERSION OR CONFIGURATION.

12.3 Some jurisdictions do not allow the exclusion of implied warranties. In those jurisdictions, the exclusions above apply only to the extent permitted, and any implied warranty is limited to the Warranty Period.

## 13. Limitation of liability

13.1 **Excluded damages.** TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, BUSINESS, GOODWILL, OR LOSS OR CORRUPTION OF DATA, ARISING OUT OF OR RELATING TO THIS AGREEMENT, EVEN IF ADVISED OF THEIR POSSIBILITY.

13.2 **Cap.** TO THE MAXIMUM EXTENT PERMITTED BY LAW, EACH PARTY'S TOTAL LIABILITY ARISING OUT OF OR RELATING TO THIS AGREEMENT WILL NOT EXCEED THE FEES YOU PAID OR OWE FOR THE SOFTWARE IN THE **TWELVE (12) MONTHS** BEFORE THE EVENT GIVING RISE TO THE LIABILITY, OR, IF YOU HAVE PAID NO FEES, **USD 100**.

13.3 **Exceptions.** Sections 13.1 and 13.2 do not limit (a) your payment obligations, (b) liability for breach of section 5 (Restrictions) or infringement of the other party's intellectual property, (c) liability for fraud, gross negligence or wilful misconduct, (d) liability for death or personal injury caused by negligence, or (e) any liability that cannot be limited by law.

13.4 **Consumers.** If you are a consumer, nothing in this Agreement affects your statutory rights, including any rights that cannot be excluded or limited under the consumer laws of your country of residence.

## 14. Term and termination

14.1 This Agreement starts when you first install or use the Software and continues until terminated.

14.2 If and when we offer paid Editions, a subscription license lasts for the Subscription Term and renews as stated in the Order and the Terms of Service. A perpetual license continues until terminated under this section.

14.3 Either party may terminate this Agreement by written notice if the other party materially breaches it and does not cure the breach within **30 days** of notice. We may terminate immediately by notice if you breach section 5 or fail to pay fees when due after reminder.

14.4 When your paid license or Free Launch License ends (without termination of this Agreement), the Licensed Features stop working and you may continue to use the Free Features under the Free Edition. When this Agreement terminates, you must stop using the Software and, on our request, uninstall it and destroy copies of License Keys. **Your Customer Data remains on your devices and in your databases; the Software does not delete it.** You can continue to access your local settings files and export your saved connections as described in the documentation.

14.5 Sections 1, 3A.2, 5, 6, 7.1, 7.3, 9, 11.2, 11.4, 12.2, 13, 14.4, 14.5 and 15–17 survive termination.

## 15. Export control and sanctions

15.1 The Software, including its cryptographic functions, may be subject to export control and sanctions laws of the United States, the European Union, the United Kingdom and other countries. You must comply with those laws.

15.2 You represent that you are not (a) located in, organized under the laws of, or ordinarily resident in any country or region subject to comprehensive sanctions, or (b) named on, or owned or controlled by anyone named on, any applicable sanctions or restricted-party list. You must not export, re-export or transfer the Software, or allow it to be used, in violation of those laws, or for any prohibited end use.

## 16. Government users

If you are a government entity, the Software is "commercial computer software" and its documentation is "commercial computer software documentation". Government use, reproduction and disclosure are governed by this Agreement, consistent with FAR 12.212 and DFARS 227.7202 (or equivalent provisions), and no other rights are granted.

## 17. General

17.1 **Governing law and venue.** This Agreement is governed by the laws of **the State of Israel**, excluding its conflict-of-laws rules. The United Nations Convention on Contracts for the International Sale of Goods does not apply. The competent courts of **Tel Aviv-Jaffa, Israel** have exclusive jurisdiction, except that either party may seek injunctive relief in any competent court. If you are a consumer, you may also bring proceedings in the courts of your country of residence.

17.2 **Audit.** No more than once in any 12-month period, on at least 30 days' written notice, we may ask you to certify in writing that your use complies with the licenses you have purchased. If your use exceeds your licenses, you will pay for the excess at our then-current list price.

17.3 **Assignment.** You may not assign this Agreement without our prior written consent, except to a successor of your entire business, on notice to us. We may assign or transfer this Agreement, on notice to you, to a company we form or control (for example, a company incorporated to operate the MotionQL business), or to a successor or buyer of all or part of our business; that company, successor or buyer then takes our place under this Agreement.

17.4 **Entire agreement.** This Agreement, together with the Order, the Terms of Service, the Privacy Policy and any policies referenced here, is the entire agreement about the Software. Purchase-order terms you issue do not apply.

17.5 **Changes.** We may update this Agreement for future versions of the Software. A new version applies from the date you install or accept it; it does not change the terms of a license during a term you have already paid for unless you agree.

17.6 **Severability and waiver.** If a provision is unenforceable, it is modified to the minimum extent needed and the rest remains in effect. Not enforcing a provision is not a waiver.

17.7 **Force majeure.** Neither party is liable for delay or failure caused by events beyond its reasonable control, other than payment obligations.

17.8 **Notices.** Notices to us: David Shoval (MotionQL), Uri Zvi Grinberg St. 31, Holon, Israel, with a copy to legal@motionql.com. Notices to you: the email address in your Order or account.

17.9 **Language.** This Agreement is written in English. If it is translated, the English version prevails, to the extent permitted by law.

---

Contact: David Shoval, trading as MotionQL · Uri Zvi Grinberg St. 31, Holon, Israel · support@motionql.com · https://motionql.com

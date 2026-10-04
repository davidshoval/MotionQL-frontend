AI in MotionQL is **optional** and **off by default**. You bring your own model: Google Gemini, Anthropic Claude, or any OpenAI-compatible endpoint, including a local model server such as Ollama. Requests go straight from your computer to your provider, never through MotionQL's servers.

## Turn AI on

AI needs two things:

1. **A provider** in **Settings → AI**:
   - **Google Gemini:** paste a Gemini API key and choose a model. See [Get a free Gemini API key](#get-a-free-gemini-api-key) below.
   - **Anthropic Claude:** paste a Claude API key and pick a model.
   - **OpenAI-compatible / local:** enter a base URL (for example `https://api.openai.com/v1`, an Azure OpenAI deployment, a gateway, or `http://localhost:11434/v1` for Ollama), a model and an API key. Local endpoints on `localhost` can run without a key.

   Click **Test connection** to check it. It sends a fixed "ping" prompt only, with no schema or data. Keys are encrypted with your OS keychain and can't be read back by the app.
2. **Allow AI** on the connection's **Safety** tab. See [Read-only and safety settings](/docs/connection-safety).

## Get a free Gemini API key

Google offers a free tier of the Gemini API, which is the quickest way to try MotionQL's AI features.

1. Go to **Google AI Studio** at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. **Sign in** with your Google account and accept the terms if asked.
3. Click **Create API key**. If AI Studio asks, choose or create a Google Cloud project for the key.
4. **Copy** the key.
5. In MotionQL, open **Settings → AI**, choose **Google Gemini**, paste the key into **Gemini API key** and click **Save**. Pick a model, then click **Test connection**.
6. Turn on **Allow AI** for the connections you want to use it with.

Treat the key like a password. If it leaks, delete it in AI Studio and create a new one.

**Before you rely on the free tier, know its limits:**

- **Rate limits.** The free tier limits requests per minute, input tokens per minute and requests per day. Limits differ by model and apply per Google Cloud project, not per key, and the daily quota resets at midnight Pacific time. When you hit a limit, requests fail until it resets. Google publishes the current numbers on its [rate limits page](https://ai.google.dev/gemini-api/docs/rate-limits); they change from time to time, so check there rather than relying on a number here.
- **How Google may use your prompts.** Under the [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms), Google uses content sent to **unpaid** services (including the free quota) and the responses to provide, improve and develop its products, and human reviewers may read it. Google asks you not to send sensitive, confidential or personal information to unpaid services. On the paid tier, Google doesn't use your prompts or responses to improve its products.

MotionQL keeps what it sends small (see below): field names, types and query shapes, not your documents. Your company may still have rules about which AI services you can use; follow them.

## What you can do

- **Ask Your Database:** ask questions in plain English (counts, lookups, summaries). Answers run as validated, read-only queries on your connection.
- **Write queries for you:** describe what you want and get a **find**, an **aggregation pipeline** or **SQL**.
- **Explain a plan** and get **index advice**; **fix an error**; **debug a pipeline** stage by stage.
- **Summarize a comparison**, **suggest masking rules**, answer **schema questions** ("which fields look like personal data?") and **suggest relationships** in SQL Migration.

Suggestions are validated before you see them (a query must parse, and server-side JavaScript is refused when it isn't allowed), but **review them before running**.

## What the AI sees

Sent to your provider:

- your request;
- database, collection and field names, field types, index definitions and the shape of explain plans;
- when relevant, the query, pipeline or error you're working on, with credentials removed. For pipeline debugging and query explanations, literal values are replaced by their types;
- for masking and schema questions, only if you tick the option: **labels** of value patterns found in a sample (for example "email" or "phone"), not the values.

Never sent: document values (unless you allow literal values for the connection), passwords, connection strings and API keys. Every AI request is recorded in the local audit log (the task, model and number of fields, not the content). **Offline mode** in Settings → AI turns every AI request off on this computer.

## AI Assistant Chat

Open **AI Assistant Chat** from the command palette, or right-click a database or collection. Ask a question and the assistant looks things up with MotionQL's own tools before answering, and you see each step: "schema of orders (24 fields)", "12 of 340 documents".

- **Tools:** list databases and collections, collection schema, indexes, explain a find, count, and read-only finds and aggregations (at most 50 documents, no `$out`, `$merge` or server-side JavaScript).
- **Changes are proposals.** When the assistant wants to insert, update or delete, MotionQL counts what the change would touch and shows a card with the filter, the update and the count. **Nothing changes until you click Apply.** Large updates and deletes also ask you to type the collection name. Read-only connections refuse proposals.
- Query results reach the model with values replaced by their types (`"<string>"`) unless literal values are allowed for the connection. You still see the real results.
- Conversations are kept per connection and database, encrypted on your computer.

## Use MotionQL from AI coding tools (MCP)

MotionQL can act as an **MCP server**, so AI coding tools on your computer, such as Claude Code, Cursor and VS Code Copilot, can use the connections you have open in MotionQL. It's **off by default**.

1. Open **Settings → MCP server** and turn on **Let AI coding tools use MotionQL**. It listens on `http://127.0.0.1:27118/mcp`, on this computer only. Change the port if it's taken.
2. Under **Connect a client**, pick your tool and copy the configuration. It contains a private token; regenerate it if it leaks.
3. Connect the database in MotionQL. Only connections with **Allow AI** on are visible to the tool.

The tools are the same as the chat's, plus `list_connections`. Values are masked unless literal values are allowed for the connection.

**Writes** are a second switch, **Allow MCP clients to propose writes**, also off by default. Each write a tool asks for appears in MotionQL with its dry-run count and runs only if you approve it within two minutes. Every call is listed under **Recent calls** and in the audit log.

The MCP server stops while AI offline mode is on. Your organization can turn it, or its writes, off.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Add a Gemini API key in Settings > AI first." | Add a key, or switch to another provider |
| "That does not look like a Gemini API key …" | Paste the key again without spaces or quotes |
| "AI assistance is turned off for this connection." | Turn on **Allow AI** in the connection's Safety tab |
| Errors from an OpenAI-compatible server | Check the base URL (usually ending in `/v1`) and model name. Switch **Structured output** from `json-schema` to `json-object` or `none` for servers that don't support JSON schemas |
| MCP: "Port … is already in use" | Pick another port and copy the client configuration again |
| MCP client gets 401 | The token changed. Copy the configuration again |

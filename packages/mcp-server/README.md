# @contextcapsule/mcp-server

[![npm version](https://img.shields.io/npm/v/@contextcapsule/mcp-server)](https://www.npmjs.com/package/@contextcapsule/mcp-server)
[![license](https://img.shields.io/npm/l/@contextcapsule/mcp-server)](https://github.com/Johnny-Z13/context-capsule/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/@contextcapsule/mcp-server)](https://nodejs.org)

Optional hosted transport for [Context Capsule](https://www.contextcapsule.ai) coding handoffs. Create and fetch short-lived, public-by-URL capsules carrying status, decisions, verification limits, and next actions between coding agents.

For normal repository-local handoffs, prefer the open-source [Context Capsule Agent Skill](https://github.com/Johnny-Z13/context-capsule/tree/main/.agents/skills/contextcapsule-handoff). It checks repository freshness and needs no account, API key, or upload.

> Hosted capsules can be read by anyone with their URL. Ask before uploading, and never include secrets, credentials, private source, or customer data.

## Tools

### `create_capsule`
Create a hosted context capsule only when the user explicitly wants a short-lived share URL.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `summary` | string | Yes | What happened — max 500 chars |
| `decisions` | string[] | No | Key decisions made (max 20 items) |
| `next_steps` | string[] | No | What should happen next (max 20 items) |
| `payload` | object | No | Structured JSON data (max 32KB) |
| `refs` | object | No | Workflow references (workflow_id, agent_id, etc.) |
| `expires_in` | number | No | TTL in seconds (60–604800, default 24 hours) |
| `idempotency_key` | string | No | Prevents duplicate capsules on retry |
| `audience` | "human" | No | Enrich view page with social cards |

**Requires:** `CONTEXTCAPSULE_API_KEY` environment variable.

### `fetch_capsule`
Fetch a capsule to resume work from where another agent left off.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `capsule_id` | string | Yes | The capsule ID (starts with `cap_`) |

**No API key required.**

### `signup`
Get a free API key (500 capsules/month).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | string | Yes | Your email address |

**No API key required.**

## Usage Example

```
You: "Create a hosted capsule for the migration handoff and share the URL"

Agent calls create_capsule:
  summary: "Migration implemented; staging is not verified"
  decisions: ["Keep the legacy endpoint for three consumers"]
  next_steps: ["Run the staging smoke test", "Ask before release"]
  payload: { verification: [{ command: "npm test", result: "71 passed", source: "observed" }] }
  refs: { receipt_ids: [] }

→ Returns capsule_id and capsule_url

You: "Fetch capsule cap_abc123 and continue the migration work"

Agent calls fetch_capsule:
  capsule_id: "cap_abc123"

→ Returns full context: summary, decisions, next_steps, payload, refs
→ Agent inspects the handoff, then checks current repository state before continuing
```

## Setup

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "contextcapsule": {
      "command": "npx",
      "args": ["-y", "@contextcapsule/mcp-server"],
      "env": {
        "CONTEXTCAPSULE_API_KEY": "ak_your_key_here"
      }
    }
  }
}
```

### Cursor / Windsurf

Add to MCP settings:

```json
{
  "mcpServers": {
    "contextcapsule": {
      "command": "npx",
      "args": ["-y", "@contextcapsule/mcp-server"],
      "env": {
        "CONTEXTCAPSULE_API_KEY": "ak_your_key_here"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add contextcapsule -- npx -y @contextcapsule/mcp-server
```

Then set your API key in your environment or `.env` file.

## Configuration

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTEXTCAPSULE_API_KEY` | For creating capsules | Your API key (starts with `ak_`) |
| `CONTEXTCAPSULE_BASE_URL` | No | API base URL (default: `https://www.contextcapsule.ai`) |

## Get an API Key

Use the `signup` tool from any MCP client, or:

```bash
curl -X POST https://www.contextcapsule.ai/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "source": "api"}'
```

## Links

- [Live Site](https://www.contextcapsule.ai)
- [API Docs](https://www.contextcapsule.ai/docs)
- [ProofSlip](https://www.proofslip.ai) (sister product — receipts + verification)
- [GitHub](https://github.com/Johnny-Z13/context-capsule)

## License

[MIT](https://github.com/Johnny-Z13/context-capsule/blob/main/LICENSE)

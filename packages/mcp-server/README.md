# @contextcapsule/mcp-server

MCP server for [Context Capsule](https://www.contextcapsule.ai) — portable execution context for AI agent workflows. Create and fetch structured context capsules that carry decisions, next steps, and working memory between agents and sessions.

## Tools

| Tool | Auth | Description |
|------|------|-------------|
| `create_capsule` | API key | Create a context capsule (summary, decisions, next steps) |
| `fetch_capsule` | None | Fetch a capsule by ID to resume work |
| `signup` | None | Get a free API key (500 capsules/month) |

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

### Cursor

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

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTEXTCAPSULE_API_KEY` | For creating capsules | Your Context Capsule API key (starts with `ak_`) |
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

# Context Capsule

Portable handoff packets for agent workflows.

## Project Overview

Context Capsule is a sister product to [ProofSlip](https://proofslip.ai). Where ProofSlip proves actions happened (receipts), Context Capsule carries the knowledge needed to continue work — structured, compressed, action-ready context that agents can hand off, resume from, and share.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Hono v4 (matches ProofSlip)
- **ORM:** Drizzle ORM with Neon PostgreSQL
- **Language:** TypeScript (strict mode)
- **Deployment:** Vercel serverless
- **Testing:** Vitest
- **MCP:** @modelcontextprotocol/sdk for MCP server package

## Development

```bash
npm run dev          # Local dev server
npm test             # Run tests
npm run db:generate  # Generate migrations
npm run db:migrate   # Apply migrations
```

## Architecture Principles

- Ephemeral by default (capsules expire)
- Idempotency built into the protocol
- Content negotiation (JSON for agents, HTML for humans)
- Discovery endpoints (/llms.txt, OpenAPI, MCP manifest)
- Middleware composition: security → auth → rate limit → business logic
- Same API patterns as ProofSlip for ecosystem consistency

## Project Status

Early design phase — see docs/ for specifications.

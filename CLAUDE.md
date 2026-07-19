# Context Capsule

Hand off a coding task between AI agents without starting over.

## Live

- **Production:** https://www.contextcapsule.ai
- **Domain:** contextcapsule.ai
- **Sister product:** [ProofSlip](https://proofslip.ai) — same ecosystem, shared design language
- **ProofSlip repo:** D:\Projects\proof-slip (keep READMEs and CLAUDE.md cross-referenced)

## Project Overview

Context Capsule is a sister product to ProofSlip. Together they form two primitives for reliable agent workflows:

- **ContextCapsule** (navigational) — "Here's the situation, what matters, and what should happen next."
- **ProofSlip** (evidential) — "Here's what actually happened, and you can verify it."

ContextCapsule is a local-first Agent Skill for coding handoffs. It captures bounded repository state, decisions, constraints, observed or reported verification, blockers, and one next action. The hosted capsule API is optional transport for an explicitly shared, short-lived public-by-URL handoff.

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
npm run db:seed      # Seed API key
npm run db:query     # Query database utilities
```

## Product Direction

The primary contract is `.agents/skills/contextcapsule-handoff` and its local `coding-handoff/v1` format. The existing flat hosted API remains backward compatible and maps a handoff into `summary`, `decisions`, `next_steps`, `payload`, and `refs` only when sharing is explicitly requested.

See `docs/current-direction.md` for the active product contract. Older schema and umbrella-brand documents under `docs/plans/` are retained as history, not current direction.

## Architecture Principles

- Local by default; hosted capsules expire after 24 hours by default (7 days maximum)
- Check repository identity and freshness before trusting a handoff
- Never include source contents or secrets in automatically captured repository state
- Ask before writing handoff files, changing ignore rules, or uploading
- Idempotency built into the protocol
- Content negotiation (JSON for agents, HTML for humans)
- Discovery endpoints (/llms.txt, OpenAPI, MCP manifest)
- Middleware composition: security → auth → rate limit → business logic
- Same API patterns as ProofSlip for ecosystem consistency

## ProofSlip Alignment

These projects share brand, stack, and patterns. Keep them consistent:

- **Brand:** Dark theme (#0a0a0a bg), green accent (#16a34a), Departure Mono font
- **Stack:** Hono v4, Drizzle ORM, Neon PostgreSQL, Vercel serverless, Vitest
- **Middleware order:** CORS → security headers → request ID → body limit → logger
- **Auth:** Bearer token `ak_` prefix, SHA-256 hash, prefix-based lookup
- **Rate limiting:** In-memory fixed window, per-key and per-IP
- **Views:** Template literal HTML (no JSX), inline styles, no client-side JS
- **Discovery:** llms.txt, llms-full.txt, openapi.json, mcp.json, agent.json
- **IDs:** Prefixed nanoid (`cap_`, `ak_`, `key_`)
- **Errors:** `{ error: "code", message: "description", request_id: "req_..." }`
- **Tests:** Vitest, unit tests in tests/lib/, route tests in tests/routes/

## Project Status

Live in production. Core API (create, fetch, auth, cleanup) implemented. Zero users currently — pre-adoption phase. See docs/ for specifications.

**Current focus:** validate the coding-handoff skill in real Codex and Claude Code workflows, keep the hosted API stable, and connect to ProofSlip only through optional evidence references. No umbrella brand is planned.

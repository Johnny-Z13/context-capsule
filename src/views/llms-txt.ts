export function renderLlmsTxt(): string {
  return `# Context Capsule

> Hand off a coding task between AI agents without starting over.

Context Capsule is primarily an open-source, local-first Agent Skill. It captures bounded repository state, decisions, constraints, verification, blockers, and one next action. A receiving agent checks freshness before trusting repo-specific details.

## Install the skill

npx skills add Johnny-Z13/context-capsule --skill contextcapsule-handoff

Skill source: https://github.com/Johnny-Z13/context-capsule/tree/main/.agents/skills/contextcapsule-handoff

Use the skill when a user asks to:

- hand work from Codex to Claude Code, Cursor, or another coding agent
- stop a coding session and resume it later without rediscovery
- create or inspect a structured coding handoff
- check whether an existing handoff is compatible, stale, mismatched, or unverifiable

The local workflow requires no account, API key, or upload. Ask before writing .contextcapsule/, changing ignore rules, or uploading.

## Handoff contract

- schema_version: coding-handoff/v1
- objective: the intended outcome
- status_summary: complete, partial, unverified, and out-of-scope work
- repository: remote, branch, HEAD, working-tree state, fingerprint, changed filenames
- decisions and constraints: choices the next agent must preserve
- verification: command, result, timestamp, and source (observed or reported)
- blockers: authority, credentials, people, or external state still required
- next_action: one bounded step
- references: optional ProofSlip IDs, issues, and pull requests
- default expiry: 24 hours

Do not include source-file contents or secrets in automatically captured repository state. A secret-pattern check is a guardrail, not a guarantee.

## ProofSlip connection

Context Capsule is navigational: what is the situation and what should happen next?
ProofSlip is evidential: what did a release environment attest, and can it be checked?

A capsule may reference ProofSlip IDs. A reference does not turn reported context into verified evidence. ProofSlip: https://www.proofslip.ai

## Optional hosted sharing API

Use the API only when the user explicitly wants a short-lived URL. Hosted capsules are public to anyone with the URL. Never upload secrets, credentials, private source, or customer data.

1. Signup: POST https://www.contextcapsule.ai/v1/auth/signup
2. Create: POST https://www.contextcapsule.ai/v1/capsules with Bearer ak_...
3. Fetch JSON: GET https://www.contextcapsule.ai/v1/capsules/{capsule_id}?format=json

Create responses use capsule_id and capsule_url. Hosted capsules expire after 86400 seconds by default and 604800 seconds maximum.

## Discovery

- Website: https://www.contextcapsule.ai
- Source: https://github.com/Johnny-Z13/context-capsule
- Hosted API docs: https://www.contextcapsule.ai/docs
- Full machine reference: https://www.contextcapsule.ai/llms-full.txt
- OpenAPI: https://www.contextcapsule.ai/.well-known/openapi.json
- Optional MCP: npx -y @contextcapsule/mcp-server
`
}

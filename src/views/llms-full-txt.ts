export function renderLlmsFullTxt(): string {
  return `# Context Capsule — full agent reference

> Switch coding agents without losing the thread.

## Product boundary

Context Capsule is a structured coding handoff, not a transcript, general memory system, autonomous orchestration layer, or claim-verification service.

Primary product: local Agent Skill and coding-handoff/v1 format.
Optional transport: hosted public-by-URL capsule API and MCP server.
Evidence partner: ProofSlip release proofs, referenced only when independent evidence exists.

## Install

npx skills add Johnny-Z13/context-capsule --skill contextcapsule-handoff

The skill works with Codex, Claude Code, Cursor, and other skills-compatible coding agents. Review the readable skill source before installation:
https://github.com/Johnny-Z13/context-capsule/tree/main/.agents/skills/contextcapsule-handoff

## Local commands

The bundled Node helper has no package dependencies.

Capture read-only repository metadata:

node .agents/skills/contextcapsule-handoff/scripts/contextcapsule.mjs capture --repo /path/to/repo

Create a handoff after preparing a semantic input JSON file and receiving write consent:

node .agents/skills/contextcapsule-handoff/scripts/contextcapsule.mjs create \\
  --repo /path/to/repo \\
  --input /path/to/handoff-input.json

Default output:
- .contextcapsule/latest.json
- .contextcapsule/latest.md
- previous.json and previous.md when replacing an existing handoff

Resume only after classifying freshness:

node .agents/skills/contextcapsule-handoff/scripts/contextcapsule.mjs resume \\
  --repo /path/to/repo \\
  --capsule /path/to/repo/.contextcapsule/latest.json

Classifications:
- compatible: repository identity and recorded fingerprint still match
- stale: same repository, but branch, HEAD, working tree, files, or expiry changed
- mismatched: repository identity differs
- unverifiable: current repository state could not be inspected

Safe behavior:
- compatible: continue, but still respect blockers and human gates
- stale: retain objective, decisions, and constraints; re-check changed files, verification, blockers, and next action
- mismatched: do not apply repository-specific claims
- unverifiable: state the limitation and inspect manually before acting

## coding-handoff/v1 semantic input

{
  "objective": "Finish the refresh-token migration safely",
  "status_summary": "Implementation complete; staging and production are not verified",
  "decisions": ["Keep the legacy endpoint for three consumers"],
  "constraints": ["Do not publish without human approval"],
  "verification": [
    {
      "command": "npm test -- --run",
      "result": "71 passed",
      "observed_at": "2026-07-19T12:04:00.000Z",
      "source": "observed"
    }
  ],
  "blockers": ["Staging credentials require a human owner"],
  "next_action": "Run the staging smoke test",
  "references": {
    "proofslip_ids": [],
    "issues": [],
    "pull_requests": []
  },
  "expires_in_seconds": 86400
}

observed means the authoring agent actually saw the command result. reported means another source supplied the claim. Neither is independent provider proof.

Automatic repository capture records remote identity without embedded credentials, root name, branch, HEAD SHA, clean or dirty state, a fingerprint, and bounded changed filenames. It does not read or copy source-file contents. .contextcapsule/ artifacts are excluded from freshness fingerprints so a capsule does not stale itself.

The helper rejects common credential patterns and credential-like keys before writing. This is defense in depth, not a complete secret scanner. Review handoff content before sharing.

## Hosted API boundary

Use hosted sharing only after explicit consent. Anyone with a capsule URL can fetch it. There is no per-view authorization.

Base URL: https://www.contextcapsule.ai
Create authentication: Authorization: Bearer ak_your_key
Fetch authentication: none
Default TTL: 86400 seconds (24 hours)
Allowed TTL: 60 to 604800 seconds
Create rate limit: 60/minute per API key
Fetch rate limit: 120/minute per IP
Signup rate limit: 5/minute per IP

### Signup

POST /v1/auth/signup
Content-Type: application/json

{"email":"you@example.com"}

201 response:

{"api_key":"ak_...","tier":"free","message":"Save this key now. It cannot be retrieved later."}

### Create a hosted capsule

POST /v1/capsules
Authorization: Bearer ak_your_key
Content-Type: application/json

{
  "summary": "Refresh-token migration implemented; staging is not verified",
  "decisions": ["Keep the legacy endpoint for three consumers"],
  "next_steps": ["Run the staging smoke test", "Ask before release"],
  "payload": {
    "schema_version": "coding-handoff/v1",
    "verification": [{"command":"npm test","result":"71 passed","source":"observed"}],
    "blockers": ["Staging credentials require a human owner"]
  },
  "refs": {"receipt_ids": []},
  "expires_in": 86400,
  "idempotency_key": "refresh-handoff-81d9c1a",
  "audience": "human"
}

201 response:

{
  "capsule_id": "cap_...",
  "summary": "Refresh-token migration implemented; staging is not verified",
  "decisions": ["Keep the legacy endpoint for three consumers"],
  "next_steps": ["Run the staging smoke test", "Ask before release"],
  "capsule_url": "https://www.contextcapsule.ai/capsule/cap_...",
  "created_at": "2026-07-19T12:05:00.000Z",
  "expires_at": "2026-07-20T12:05:00.000Z",
  "idempotency_key": "refresh-handoff-81d9c1a",
  "audience": "human"
}

### Fetch

GET /v1/capsules/{capsule_id}?format=json
GET /capsule/{capsule_id}?format=json

JSON response fields:
- capsule_id
- summary
- decisions
- next_steps
- payload
- refs
- created_at
- expires_at
- audience when present

Without format=json or an Accept: application/json header, fetch routes return the human-readable HTML view.

### Errors

Errors use:

{"error":"code","message":"description","request_id":"req_..."}

Relevant codes: validation_error, unauthorized, capsule_not_found, idempotency_conflict, email_exists, quota_exceeded, rate_limited, internal_error.

## ProofSlip references

Use references.proofslip_ids locally or refs.receipt_ids in the hosted legacy schema. ProofSlip answers what a provider attested about a release. Context Capsule answers what the next agent needs to know and do.

Do not label a handoff claim verified merely because it includes a ProofSlip ID. Fetch and inspect the referenced proof, separate provider evidence from submitted context, and report limitations.

ProofSlip: https://www.proofslip.ai

## Source and discovery

- Website: https://www.contextcapsule.ai
- GitHub: https://github.com/Johnny-Z13/context-capsule
- Skill: https://github.com/Johnny-Z13/context-capsule/tree/main/.agents/skills/contextcapsule-handoff
- API docs: https://www.contextcapsule.ai/docs
- OpenAPI: https://www.contextcapsule.ai/.well-known/openapi.json
- MCP manifest: https://www.contextcapsule.ai/.well-known/mcp.json
- Agent manifest: https://www.contextcapsule.ai/.well-known/agent.json
- MCP package: @contextcapsule/mcp-server
`
}

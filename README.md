# Context Capsule

**Switch coding agents without losing the thread.**

Context Capsule is an open-source, local-first Agent Skill for handing a live coding task from Codex to Claude Code, Cursor, another agent, or your future self. It records the minimum useful state: repository identity, decisions, constraints, verification, blockers, and one concrete next action.

The receiving agent checks whether the handoff is still compatible before trusting it.

[Website](https://www.contextcapsule.ai) · [Skill source](.agents/skills/contextcapsule-handoff/SKILL.md) · [Current direction](docs/current-direction.md) · [Example handoff](https://www.contextcapsule.ai/example) · [Optional hosted API](https://www.contextcapsule.ai/docs) · [ProofSlip](https://www.proofslip.ai)

## Install the Agent Skill

```bash
npx skills add Johnny-Z13/context-capsule --skill contextcapsule-handoff
```

The skill uses an open `SKILL.md` plus a dependency-free Node helper. It is intended for Codex, Claude Code, Cursor, and other tools that support the [Agent Skills format](https://agentskills.io).

Example prompts:

```text
Create a Context Capsule before I switch this task from Codex to Claude Code.

Resume from .contextcapsule/latest.json, but check whether it is stale first.
```

No account, API key, database, or upload is required for the local workflow.

## What It Captures

The `coding-handoff/v1` format contains:

| Lane | What it answers |
| --- | --- |
| Objective | What outcome are we trying to reach? |
| Current status | What is complete, partial, unverified, or out of scope? |
| Repository | Which remote, branch, HEAD, and working-tree fingerprint does this describe? |
| Decisions | What choices must the next agent preserve? |
| Constraints | What must it not do or assume? |
| Verification | What command and result were observed or merely reported, and when? |
| Blockers | What still needs authority, credentials, another person, or external state? |
| Next action | What single bounded step should happen next? |
| References | Which ProofSlip proofs, issues, or pull requests are relevant? |

It is a handoff, not a transcript, general memory store, autonomous orchestrator, or source of truth for claims.

## Local Workflow

The skill normally drives these commands for you. They are documented here so the behavior stays inspectable.

### 1. Capture repository state

```bash
node .agents/skills/contextcapsule-handoff/scripts/contextcapsule.mjs \
  capture --repo /path/to/repository
```

Capture is read-only. It records sanitized repository metadata and bounded changed filenames. It does not read or copy source-file contents.

### 2. Create the handoff

Prepare a semantic input file following [the format reference](.agents/skills/contextcapsule-handoff/references/coding-handoff-v1.md), then:

```bash
node .agents/skills/contextcapsule-handoff/scripts/contextcapsule.mjs \
  create \
  --repo /path/to/repository \
  --input /path/to/handoff-input.json
```

Default output:

```text
.contextcapsule/
├── latest.json
├── latest.md
├── previous.json   # when an older capsule existed
└── previous.md
```

The helper must be run only after the user approves the write location. It does not edit `.gitignore` automatically.

### 3. Resume safely

```bash
node .agents/skills/contextcapsule-handoff/scripts/contextcapsule.mjs \
  resume \
  --repo /path/to/repository \
  --capsule /path/to/repository/.contextcapsule/latest.json
```

The result is one of:

- `compatible` — repository identity and recorded state still match.
- `stale` — same repository, but the branch, HEAD, working tree, files, or expiry changed.
- `mismatched` — the handoff describes another repository.
- `unverifiable` — current repository state could not be inspected.

A stale capsule can still preserve its objective, decisions, and constraints. Re-check changed files, verification, blockers, and next action before continuing.

## Privacy and Trust Boundary

- Local is the default. The normal workflow does not contact Context Capsule servers.
- The agent asks before writing `.contextcapsule/`, changing ignore rules, or uploading.
- Automatic capture records filenames and Git metadata, not file contents.
- Common credential patterns are rejected before a capsule is written.
- Secret detection is a guardrail, not a guarantee. Review the handoff before sharing it.
- Hosted capsules are public to anyone with their URL and need explicit consent.
- A capsule reports context. It does not independently prove that a command, deployment, or release happened.

The default local and hosted expiry is 24 hours. The maximum hosted expiry is 7 days.

## Context Capsule + ProofSlip

The products stay separate and connect through an optional reference:

- **Context Capsule is navigational:** “What is the situation, what matters, and what should happen next?”
- **ProofSlip is evidential:** “What did the release environment attest, and can the next agent check it?”

Put ProofSlip IDs in `references.proofslip_ids` only when a handoff claim has relevant independent evidence. The next agent still needs to fetch and inspect the proof; an ID alone does not make a claim verified.

## Optional Hosted Sharing

The existing Hono/Postgres API remains available when you explicitly need a short-lived handoff URL for another machine or person. It is optional transport, not the default authoring experience.

### Get an API key

```bash
curl -X POST https://www.contextcapsule.ai/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
```

API keys use the `ak_` prefix.

### Create a hosted capsule

```bash
curl -X POST https://www.contextcapsule.ai/v1/capsules \
  -H "Authorization: Bearer ak_your_key" \
  -H "Content-Type: application/json" \
  -d '{
    "summary":"Refresh-token migration implemented; staging is not verified",
    "decisions":["Keep the legacy endpoint for three consumers"],
    "next_steps":["Run the staging smoke test","Ask before release"],
    "payload":{"schema_version":"coding-handoff/v1"},
    "refs":{"receipt_ids":[]},
    "expires_in":86400,
    "idempotency_key":"refresh-handoff-81d9c1a",
    "audience":"human"
  }'
```

Response fields include `capsule_id`, `capsule_url`, `summary`, `decisions`, `next_steps`, `created_at`, `expires_at`, and `idempotency_key`.

### Fetch

```bash
curl "https://www.contextcapsule.ai/v1/capsules/cap_...?format=json"
```

Fetches require no authentication. Anyone with the ID or URL can read the capsule until it expires.

Full hosted contract: [API docs](https://www.contextcapsule.ai/docs) · [OpenAPI](https://www.contextcapsule.ai/.well-known/openapi.json) · [llms-full.txt](https://www.contextcapsule.ai/llms-full.txt)

## Optional MCP Transport

```bash
npx -y @contextcapsule/mcp-server
```

The MCP server exposes `create_capsule`, `fetch_capsule`, and `signup` against the hosted API. Creating requires `CONTEXTCAPSULE_API_KEY`; fetching is public. Prefer the Agent Skill for local coding handoffs because it can inspect repository freshness and does not require an upload.

## Self-Hosting

Requirements: Node.js 18+ and PostgreSQL.

```bash
git clone https://github.com/Johnny-Z13/context-capsule.git
cd context-capsule
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed -- you@example.com
npm run dev
```

Environment variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BASE_URL` | Yes | Public base URL for capsule links |
| `CRON_SECRET` | Production | Protects expiry cleanup |
| `RESEND_API_KEY` | Web signup | Emails API keys for `source: web` |
| `DEV_SECRET` | Optional | Protects the local developer console |
| `NODEJS_HELPERS` | Vercel | Set to `0` for the deployment runtime |

## Development

```bash
npm run dev
npm test -- --run --configLoader runner
npx tsc --noEmit
```

Focused skill test:

```bash
npx vitest run tests/skills/contextcapsule-handoff.test.ts --configLoader runner
```

The HTTP API is intentionally backward compatible with the original flat `summary`, `decisions`, `next_steps`, `payload`, and `refs` schema while the local skill provides the richer authoring and freshness contract.

## License

[MIT](LICENSE)

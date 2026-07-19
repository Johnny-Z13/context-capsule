# Context Capsule Current Direction

Status: local implementation and validation complete; publication pending, 2026-07-19

## Product contract

Context Capsule hands a live coding task from one AI coding agent to another without forcing the receiver to rediscover the work.

The primary product is the open-source `.agents/skills/contextcapsule-handoff` Agent Skill and its local `coding-handoff/v1` format. A useful first result needs no account, API key, database, or upload.

The handoff must make these things legible:

- objective and current status;
- repository identity, branch, HEAD, working-tree state, fingerprint, and bounded changed filenames;
- decisions and constraints;
- verification with command, result, timestamp, and `observed` or `reported` source;
- blockers and one exact next action;
- optional ProofSlip, issue, and pull-request references.

The receiving agent classifies the capsule as compatible, stale, mismatched, or unverifiable before relying on repository-specific details.

## Trust and privacy boundary

- Capture is local and records Git metadata and filenames, not source-file contents.
- The agent asks before writing `.contextcapsule/`, changing ignore rules, or uploading.
- Common credential patterns are rejected, but the scanner is not a complete guarantee.
- Hosted capsules are readable by anyone with their URL.
- Hosted sharing is optional and always requires explicit consent.
- A capsule reports context; it does not independently prove a deployment or release.

## Hosted compatibility

The live flat API remains backward compatible. When hosted sharing is explicitly requested, map the local handoff into `summary`, `decisions`, `next_steps`, `payload`, and `refs`. The API returns `capsule_id` and `capsule_url`; API keys use the `ak_` prefix; expiry defaults to 24 hours and is capped at 7 days.

## ProofSlip connection

Context Capsule is navigational: what is the situation and what should happen next?

ProofSlip is evidential: what did the release environment attest, and can the next agent check it?

Use `references.proofslip_ids` locally or the backward-compatible `refs.receipt_ids` hosted field. A reference is not itself verification.

## Historical documents

Documents under `docs/plans/` preserve the original generic context API, schema V2, chaining, and umbrella-brand thinking. They are useful history but do not override this contract. There is no current umbrella-brand plan, and generic memory/state/intent infrastructure is not the active product direction.

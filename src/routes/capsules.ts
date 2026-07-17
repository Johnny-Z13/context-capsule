import { Hono } from 'hono'
import type { Context } from 'hono'
import { getDb } from '../db/client.js'
import { capsules, apiKeys } from '../db/schema.js'
import { eq, and, sql } from 'drizzle-orm'
import { generateCapsuleId } from '../lib/ids.js'
import { validateCreateCapsule, isValidationError, CreateCapsuleInput } from '../lib/validate.js'
import { errorResponse } from '../lib/errors.js'
import { apiKeyAuth } from '../middleware/api-key-auth.js'
import { rateLimitByApiKey } from '../middleware/rate-limit.js'

const capsulesRouter = new Hono()

const TIER_LIMITS: Record<string, number> = {
  free: 500,
}

type CapsuleRow = typeof capsules.$inferSelect

function replayResponse(c: Context, capsule: CapsuleRow, input: CreateCapsuleInput) {
  if (!sameContent(capsule, input)) {
    return errorResponse(c, 409, 'idempotency_conflict', 'A capsule with this idempotency_key already exists with different content.')
  }

  const baseUrl = process.env.BASE_URL || 'https://www.contextcapsule.ai'
  return c.json({
    capsule_id: capsule.id,
    summary: capsule.summary,
    decisions: capsule.decisions || null,
    next_steps: capsule.nextSteps || null,
    capsule_url: `${baseUrl}/capsule/${capsule.id}`,
    created_at: capsule.createdAt.toISOString(),
    expires_at: capsule.expiresAt.toISOString(),
    idempotency_key: capsule.idempotencyKey,
    ...(capsule.audience ? { audience: capsule.audience } : {}),
  }, 200)
}

function sameContent(capsule: CapsuleRow, input: CreateCapsuleInput): boolean {
  const norm = (v: unknown) => JSON.stringify(v ?? null)
  return (
    capsule.summary === input.summary &&
    (capsule.audience ?? null) === (input.audience ?? null) &&
    norm(capsule.decisions) === norm(input.decisions) &&
    norm(capsule.nextSteps) === norm(input.next_steps) &&
    norm(capsule.payload) === norm(input.payload) &&
    norm(capsule.refs) === norm(input.refs)
  )
}

capsulesRouter.use('*', apiKeyAuth)
capsulesRouter.use('*', rateLimitByApiKey)

capsulesRouter.post('/', async (c) => {
  const body = await c.req.json().catch(() => null)
  const validated = validateCreateCapsule(body)

  if (isValidationError(validated)) {
    const firstError = validated[0]
    return errorResponse(c, 400, 'validation_error', `${firstError.field}: ${firstError.message}`)
  }

  const apiKeyRecord = (c as any).get('apiKeyRecord') as {
    id: string
    tier: string
    usageCount: number | null
    usageResetAt: Date | null
  }
  const db = getDb()

  // Idempotency check
  if (validated.idempotency_key) {
    const existing = await db
      .select()
      .from(capsules)
      .where(
        and(
          eq(capsules.apiKeyId, apiKeyRecord.id),
          eq(capsules.idempotencyKey, validated.idempotency_key)
        )
      )

    if (existing.length > 0) {
      return replayResponse(c, existing[0], validated)
    }
  }

  // Monthly quota check (usage window resets every 30 days)
  let usageCount = apiKeyRecord.usageCount ?? 0
  if (!apiKeyRecord.usageResetAt || apiKeyRecord.usageResetAt < new Date()) {
    usageCount = 0
    await db.update(apiKeys)
      .set({ usageCount: 0, usageResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
      .where(eq(apiKeys.id, apiKeyRecord.id))
  }
  const quota = TIER_LIMITS[apiKeyRecord.tier] ?? TIER_LIMITS.free
  if (usageCount >= quota) {
    return errorResponse(c, 429, 'quota_exceeded', `Monthly capsule quota reached (${quota}). Quota resets every 30 days.`)
  }

  const capsuleId = generateCapsuleId()
  const expiresIn = validated.expires_in || 86400
  const expiresAt = new Date(Date.now() + expiresIn * 1000)

  try {
    await db.insert(capsules).values({
      id: capsuleId,
      apiKeyId: apiKeyRecord.id,
      summary: validated.summary,
      decisions: validated.decisions || null,
      nextSteps: validated.next_steps || null,
      payload: validated.payload || null,
      refs: validated.refs || null,
      idempotencyKey: validated.idempotency_key || null,
      audience: validated.audience || null,
      expiresAt,
    })
  } catch (err) {
    // Concurrent request with the same idempotency_key won the insert race
    if (validated.idempotency_key && String(err).includes('duplicate key')) {
      const winner = await db
        .select()
        .from(capsules)
        .where(
          and(
            eq(capsules.apiKeyId, apiKeyRecord.id),
            eq(capsules.idempotencyKey, validated.idempotency_key)
          )
        )
      if (winner.length > 0) {
        return replayResponse(c, winner[0], validated)
      }
    }
    throw err
  }

  await db.update(apiKeys)
    .set({ usageCount: sql`${apiKeys.usageCount} + 1` })
    .where(eq(apiKeys.id, apiKeyRecord.id))
    .catch(() => {})

  const baseUrl = process.env.BASE_URL || 'https://www.contextcapsule.ai'

  return c.json({
    capsule_id: capsuleId,
    summary: validated.summary,
    decisions: validated.decisions || null,
    next_steps: validated.next_steps || null,
    capsule_url: `${baseUrl}/capsule/${capsuleId}`,
    created_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
    idempotency_key: validated.idempotency_key || null,
    ...(validated.audience ? { audience: validated.audience } : {}),
  }, 201)
})

export { capsulesRouter }

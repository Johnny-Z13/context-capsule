import { describe, expect, it } from 'vitest'
import app from '../../src/index.js'

describe('coding-handoff positioning', () => {
  it('makes the local Agent Skill the primary website path', async () => {
    const response = await app.request('/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('Switch coding agents without losing the thread.')
    expect(html).toContain('npx skills add Johnny-Z13/context-capsule --skill contextcapsule-handoff')
    expect(html).toContain('No account, API key, or upload is required')
    expect(html).toContain('public to anyone with its URL')
    expect(html).not.toContain('Get API key')
    expect(html).not.toContain('you@example.com')
  })

  it('describes the API as optional public-by-URL transport', async () => {
    const response = await app.request('/docs')
    const html = await response.text()

    expect(html).toContain('Optional hosted sharing')
    expect(html).toContain('Anyone with a capsule URL can read it')
    expect(html).toContain('"capsule_id"')
    expect(html).toContain('"capsule_url"')
    expect(html).not.toContain('"short_url"')
  })

  it('keeps discovery contracts aligned with actual response fields and expiry', async () => {
    const openApiResponse = await app.request('/.well-known/openapi.json')
    const openApi = await openApiResponse.json() as any
    const createResponse = openApi.components.schemas.CreateCapsuleResponse
    const capsule = openApi.components.schemas.Capsule

    expect(createResponse.required).toContain('capsule_id')
    expect(createResponse.properties).toHaveProperty('capsule_url')
    expect(createResponse.properties).not.toHaveProperty('short_url')
    expect(capsule.required).toContain('capsule_id')
    expect(openApi.components.schemas.CreateCapsuleRequest.properties.expires_in.default).toBe(86400)

    const llmsResponse = await app.request('/llms.txt')
    const llms = await llmsResponse.text()
    expect(llms).toContain('local-first Agent Skill')
    expect(llms).toContain('ProofSlip is evidential')
    expect(llms).toContain('public to anyone with the URL')
  })
})

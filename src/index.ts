import { Hono } from 'hono'
import { capsulesRouter } from './routes/capsules.js'
import { fetchRouter } from './routes/fetch.js'
import { authRouter } from './routes/auth.js'
import { cronRouter } from './routes/cron.js'
import { renderLandingPage } from './views/landing-page.js'
import { renderDevConsole } from './views/dev-console.js'
import { renderDocsPage } from './views/docs-page.js'
import { renderLlmsTxt } from './views/llms-txt.js'
import { renderLlmsFullTxt } from './views/llms-full-txt.js'
import { getOpenApiSpec } from './views/openapi.js'
import { getMcpDiscovery } from './views/mcp-json.js'
import { getOgImagePng } from './views/og-image-png.js'
import { renderCapsulePage } from './views/capsule-page.js'
import { cors, requestId, bodyLimit, securityHeaders } from './middleware/security.js'
import { errorResponse } from './lib/errors.js'
import { requestLogger } from './middleware/logger.js'

const app = new Hono()

// Global middleware
app.use('*', cors)
app.use('*', securityHeaders)
app.use('*', requestId)
app.use('*', bodyLimit(49_152))
app.use('*', requestLogger)

// Global error handler
app.onError((err, c) => {
  const requestIdValue = (c as any).get('requestId') || null
  console.error(JSON.stringify({
    ts: new Date().toISOString(),
    error: err.message,
    request_id: requestIdValue,
    method: c.req.method,
    path: c.req.path,
  }))

  return c.json({
    error: 'internal_error',
    message: 'An unexpected error occurred. Please try again later.',
    request_id: requestIdValue,
  }, 500)
})

// Routes
app.get('/', (c) => c.html(renderLandingPage()))
app.get('/health', (c) => c.json({ status: 'ok' }))
app.route('/v1/capsules', fetchRouter)
app.route('/capsule', fetchRouter)
app.route('/v1/capsules', capsulesRouter)
app.route('/v1/auth', authRouter)
app.route('/cron', cronRouter)

// Example capsule
app.get('/example', (c) => {
  c.header('Cache-Control', 'public, max-age=86400')
  return c.html(renderCapsulePage({
    id: 'cap_example_9k2m7x4p',
    summary: 'Refresh-token migration implemented on codex/refresh-window. Production has not been checked.',
    decisions: [
      'Keep the legacy endpoint; three downstream consumers still use it',
      'Treat local test output as observed, not as proof of deployment',
    ],
    nextSteps: [
      'Run the staging smoke test',
      'Ask for human approval before release',
    ],
    payload: {
      schema_version: 'coding-handoff/v1',
      repository: { branch: 'codex/refresh-window', head_sha: '81d9c1a', working_tree: 'dirty' },
      verification: [{ command: 'npm test -- --run', result: '71 passed', source: 'observed' }],
      blocker: 'Staging credentials require a human owner',
    },
    refs: {
      agent_from: 'Codex',
      agent_to: 'Claude Code',
      receipt_ids: [],
    },
    audience: 'human',
    createdAt: '2026-04-03T12:00:00.000Z',
    expiresAt: '2026-04-04T12:00:00.000Z',
  }))
})

// Discovery endpoints
app.get('/docs', (c) => c.html(renderDocsPage()))
app.get('/llms.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=86400')
  c.header('X-Robots-Tag', 'noindex, nofollow')
  return c.body(renderLlmsTxt())
})
app.get('/llms-full.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=86400')
  c.header('X-Robots-Tag', 'noindex, nofollow')
  return c.body(renderLlmsFullTxt())
})
app.get('/.well-known/openapi.json', (c) => {
  c.header('Cache-Control', 'public, max-age=86400')
  c.header('X-Robots-Tag', 'noindex, nofollow')
  return c.json(getOpenApiSpec())
})
app.get('/.well-known/mcp.json', (c) => {
  c.header('Cache-Control', 'public, max-age=86400')
  c.header('X-Robots-Tag', 'noindex, nofollow')
  return c.json(getMcpDiscovery())
})
app.get('/.well-known/ai-plugin.json', (c) => {
  c.header('Cache-Control', 'public, max-age=86400')
  c.header('X-Robots-Tag', 'noindex, nofollow')
  return c.json({
    schema_version: 'v1',
    name_for_human: 'Context Capsule',
    name_for_model: 'context_capsule',
    description_for_human: 'Short-lived coding handoffs for switching AI agents without starting over.',
    description_for_model:
      'Use the local Context Capsule Agent Skill for coding handoffs. Use this hosted API only when a user explicitly wants a short-lived share URL. ' +
      'Hosted capsules are public to anyone with their URL and may contain summaries, decisions, next steps, structured payloads, and ProofSlip references. ' +
      'Never include secrets. Capsules expire after 24 hours by default and 7 days maximum.',
    auth: { type: 'service_http', authorization_type: 'bearer' },
    api: { type: 'openapi', url: 'https://www.contextcapsule.ai/.well-known/openapi.json' },
    logo_url: 'https://www.contextcapsule.ai/og-image.png',
    contact_email: 'hello@z13labs.com',
    legal_info_url: 'https://www.contextcapsule.ai',
  })
})
app.get('/.well-known/agent.json', (c) => {
  c.header('Cache-Control', 'public, max-age=86400')
  c.header('X-Robots-Tag', 'noindex, nofollow')
  return c.json({
    name: 'Context Capsule',
    description: 'Local-first, freshness-checked coding handoffs, with an optional hosted sharing API.',
    url: 'https://www.contextcapsule.ai',
    version: '1.0.0',
    capabilities: ['coding-handoffs', 'freshness-checks', 'capsules', 'proof-references'],
    skill: {
      repository: 'https://github.com/Johnny-Z13/context-capsule/tree/main/.agents/skills/contextcapsule-handoff',
      install: 'npx skills add Johnny-Z13/context-capsule --skill contextcapsule-handoff',
    },
    protocol: 'openapi',
    api: { type: 'openapi', url: 'https://www.contextcapsule.ai/.well-known/openapi.json' },
    auth: { type: 'bearer', signup_url: 'https://www.contextcapsule.ai/v1/auth/signup' },
    mcp: { package: '@contextcapsule/mcp-server', install: 'npx -y @contextcapsule/mcp-server' },
    llms_txt: 'https://www.contextcapsule.ai/llms.txt',
  })
})
app.get('/robots.txt', (c) => {
  return c.text(
    'User-agent: *\n' +
    'Allow: /\n' +
    'Disallow: /cron/\n' +
    'Disallow: /dev/\n' +
    'Disallow: /v1/\n\n' +
    'Sitemap: https://www.contextcapsule.ai/sitemap.xml\n\n' +
    '# AI agent discovery\n' +
    '# LLM context: /llms.txt\n' +
    '# Full LLM docs: /llms-full.txt\n' +
    '# OpenAPI spec: /.well-known/openapi.json\n' +
    '# OpenAI plugin: /.well-known/ai-plugin.json\n' +
    '# Agent protocol: /.well-known/agent.json\n' +
    '# MCP discovery: /.well-known/mcp.json\n' +
    '# API docs: /docs\n'
  )
})
app.get('/sitemap.xml', (c) => {
  c.header('Content-Type', 'application/xml')
  return c.body(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.contextcapsule.ai</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.contextcapsule.ai/docs</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.contextcapsule.ai/example</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`)
})

app.get('/og-image.png', (c) => {
  c.header('Content-Type', 'image/png')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(getOgImagePng())
})

// Google Search Console verification
app.get('/google72aa1534e21928da.html', (c) => {
  return c.text('google-site-verification: google72aa1534e21928da.html')
})

// Dev console (private, requires DEV_SECRET)
app.get('/dev/console', (c) => {
  const secret = c.req.query('key')
  if (!secret || secret !== process.env.DEV_SECRET) {
    return errorResponse(c, 404, 'not_found', 'Route not found.')
  }
  return c.html(renderDevConsole())
})

// 404 fallback
app.notFound((c) => {
  return errorResponse(c, 404, 'not_found', 'Route not found.')
})

export default app

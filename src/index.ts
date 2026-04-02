import { Hono } from 'hono'
import { capsulesRouter } from './routes/capsules.js'
import { fetchRouter } from './routes/fetch.js'
import { authRouter } from './routes/auth.js'
import { cronRouter } from './routes/cron.js'
import { renderLandingPage } from './views/landing-page.js'
import { renderDocsPage } from './views/docs-page.js'
import { renderLlmsTxt } from './views/llms-txt.js'
import { renderLlmsFullTxt } from './views/llms-full-txt.js'
import { getOpenApiSpec } from './views/openapi.js'
import { getMcpDiscovery } from './views/mcp-json.js'
import { cors, requestId, bodyLimit, securityHeaders } from './middleware/security.js'
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
app.route('/v1/capsules', capsulesRouter)
app.route('/v1/capsules', fetchRouter)
app.route('/capsule', fetchRouter)
app.route('/v1/auth', authRouter)
app.route('/cron', cronRouter)

// Discovery endpoints
app.get('/docs', (c) => c.html(renderDocsPage()))
app.get('/llms.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(renderLlmsTxt())
})
app.get('/llms-full.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(renderLlmsFullTxt())
})
app.get('/.well-known/openapi.json', (c) => {
  c.header('Cache-Control', 'public, max-age=86400')
  return c.json(getOpenApiSpec())
})
app.get('/.well-known/mcp.json', (c) => {
  c.header('Cache-Control', 'public, max-age=86400')
  return c.json(getMcpDiscovery())
})
app.get('/.well-known/agent.json', (c) => {
  c.header('Cache-Control', 'public, max-age=86400')
  return c.json({
    name: 'Context Capsule',
    description: 'Portable context for agent workflows. Structured, compressed, ephemeral handoff packets.',
    url: 'https://contextcapsule.ai',
    version: '1.0.0',
    capabilities: ['capsules', 'handoffs', 'context-compression'],
    protocol: 'openapi',
    api: { type: 'openapi', url: 'https://contextcapsule.ai/.well-known/openapi.json' },
    auth: { type: 'bearer', signup_url: 'https://contextcapsule.ai/v1/auth/signup' },
    mcp: { package: '@contextcapsule/mcp-server', install: 'npx -y @contextcapsule/mcp-server' },
    llms_txt: 'https://contextcapsule.ai/llms.txt',
  })
})
app.get('/robots.txt', (c) => {
  return c.text(
    'User-agent: *\nAllow: /\n\n' +
    'Sitemap: https://contextcapsule.ai/sitemap.xml\n\n' +
    '# AI agent discovery\n' +
    '# LLM context: /llms.txt\n' +
    '# OpenAPI spec: /.well-known/openapi.json\n' +
    '# MCP discovery: /.well-known/mcp.json\n'
  )
})
app.get('/sitemap.xml', (c) => {
  c.header('Content-Type', 'application/xml')
  return c.body(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://contextcapsule.ai</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://contextcapsule.ai/docs</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>https://contextcapsule.ai/llms.txt</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>https://contextcapsule.ai/.well-known/openapi.json</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>https://contextcapsule.ai/.well-known/mcp.json</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`)
})

// 404 fallback
app.notFound((c) => {
  return c.json({ error: 'not_found', message: 'Route not found.' }, 404)
})

export default app

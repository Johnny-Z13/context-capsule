import { createMiddleware } from 'hono/factory'
import { nanoid } from 'nanoid'
import { errorResponse } from '../lib/errors.js'

export const cors = createMiddleware(async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
  c.header('Access-Control-Expose-Headers', 'X-Request-Id, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset')
  c.header('Access-Control-Max-Age', '86400')

  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204)
  }

  await next()
})

export const requestId = createMiddleware(async (c, next) => {
  const id = c.req.header('x-request-id') || `req_${nanoid(16)}`
  c.set('requestId', id)
  c.header('X-Request-Id', id)
  await next()
})

export function bodyLimit(maxBytes: number) {
  return createMiddleware(async (c, next) => {
    const contentLength = c.req.header('content-length')
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      return errorResponse(c, 413, 'payload_too_large', `Request body must be ${Math.floor(maxBytes / 1024)}KB or smaller.`)
    }
    await next()
  })
}

export const securityHeaders = createMiddleware(async (c, next) => {
  await next()
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
})

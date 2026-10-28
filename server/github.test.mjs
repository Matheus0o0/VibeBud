import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { createGithubHandler } from './github.mjs'

const config = { APP_ORIGIN: 'http://localhost:5173', GITHUB_CLIENT_ID: 'client', GITHUB_CLIENT_SECRET: 'server-secret', GITHUB_APP_SLUG: 'vibebud-test' }
const repository = { id: 42, full_name: 'person/private-app', private: true, html_url: 'https://github.com/person/private-app', default_branch: 'main', description: 'Private project' }
const response = (data, status = 200, headers = {}) => new Response(status === 204 ? null : JSON.stringify(data), { status, headers })

async function call(handler, path, { method = 'GET', headers = {} } = {}) {
  const req = { url: path, method, headers: { host: 'localhost:5173', ...headers } }
  const res = { headers: {}, status: 200, setHeader(k, v) { this.headers[k.toLowerCase()] = v }, writeHead(status, headers = {}) { this.status = status; for (const [k, v] of Object.entries(headers)) this.setHeader(k, v) }, end(body = '') { this.body = body } }
  await handler(req, res)
  return { ...res, data: res.body?.startsWith('{') ? JSON.parse(res.body) : null }
}

async function login(handler) {
  const begin = await call(handler, '/api/github/connect')
  const redirect = new URL(begin.headers.location)
  const state = redirect.searchParams.get('state')
  const callback = await call(handler, `/api/github/callback?code=test&state=${state}`, { headers: { cookie: `vibebud_gh_flow=${state}` } })
  assert.equal(callback.status, 302)
  assert.equal(callback.headers.location, '/github?connection=success')
  const sessionCookie = callback.headers['set-cookie'].find((c) => c.startsWith('vibebud_gh='))
  return { cookie: sessionCookie.split(';')[0], begin, redirect, callback }
}

function mockGitHub(overrides = {}) {
  const calls = []
  const fetcher = async (url, options = {}) => {
    calls.push({ url, options })
    const path = new URL(url).pathname
    if (overrides[path]) return overrides[path](url, options)
    if (path === '/login/oauth/access_token') return response({ access_token: 'private-user-token', expires_in: 28800, refresh_token: 'private-refresh-token' })
    if (path === '/user') return response({ id: 7, login: 'person', name: 'Person' })
    if (path === '/user/installations') return response({ installations: [{ id: 1 }] })
    if (path === '/user/installations/1/repositories') return response({ repositories: [repository] })
    if (path === '/repos/person/private-app') return response(repository)
    if (path.endsWith('/commits')) return response([{ sha: 'abc123', html_url: 'https://github.com/person/private-app/commit/abc123', commit: { message: 'Implement login\nInternal detail', author: { name: 'Person', date: '2026-10-28T10:00:00Z' } } }])
    if (path.endsWith('/pulls')) return response([{ id: 1, number: 3, title: 'Login flow', html_url: 'https://github.com/person/private-app/pull/3', state: 'closed', merged_at: '2026-10-28', user: { login: 'person' }, updated_at: '2026-10-28T10:00:00Z' }])
    if (path.endsWith('/issues')) return response([{ id: 2, number: 4, title: 'An issue', state: 'open', user: { login: 'person' } }, { id: 1, pull_request: {}, title: 'A PR' }])
    if (path === '/applications/client/token') return response(null, 204)
    throw new Error(`Unexpected request: ${url}`)
  }
  return { fetcher, calls }
}

test('unconfigured status is honest and never exposes credentials', async () => {
  const handler = createGithubHandler()
  const result = await call(handler, '/api/github/status')
  assert.deepEqual(result.data, { configured: false, connected: false, user: null, installUrl: null })
  assert.equal(result.headers['cache-control'], 'no-store')
  assert.equal((await call(handler, '/api/github/connect')).status, 503)
})

test('private endpoints reject unauthenticated requests', async () => {
  const handler = createGithubHandler(config)
  assert.equal((await call(handler, '/api/github/repositories')).status, 401)
  assert.equal((await call(handler, '/api/github/repositories/42/activity')).status, 401)
})

test('OAuth uses state, PKCE and HttpOnly cookie; secrets never enter browser responses', async () => {
  const { fetcher, calls } = mockGitHub()
  const handler = createGithubHandler(config, fetcher)
  const { redirect, callback, cookie } = await login(handler)
  const exchange = calls.find((c) => c.url.includes('access_token'))
  assert.equal(redirect.searchParams.get('code_challenge_method'), 'S256')
  assert.equal(redirect.searchParams.get('code_challenge'), createHash('sha256').update(exchange.options.body.get('code_verifier')).digest('base64url'))
  assert.equal(redirect.searchParams.has('scope'), false)
  assert.equal(exchange.options.body.get('client_secret'), 'server-secret')
  assert.match(callback.headers['set-cookie'].join(' '), /HttpOnly/)
  const result = await call(handler, '/api/github/status', { headers: { cookie } })
  assert.equal(result.data.user.login, 'person')
  assert.doesNotMatch(JSON.stringify([result.data, callback.headers]), /private-user-token|private-refresh-token|server-secret/)
})

test('forged state and callback replay are rejected before exchanging code', async () => {
  const { fetcher, calls } = mockGitHub()
  const handler = createGithubHandler(config, fetcher)
  const begin = await call(handler, '/api/github/connect')
  const state = new URL(begin.headers.location).searchParams.get('state')
  const forged = await call(handler, `/api/github/callback?state=${state}&code=x`, { headers: { cookie: 'vibebud_gh_flow=wrong' } })
  assert.equal(forged.headers.location, '/github?connection=invalid_state')
  const replay = await call(handler, `/api/github/callback?state=${state}&code=x`, { headers: { cookie: `vibebud_gh_flow=${state}` } })
  assert.equal(replay.headers.location, '/github?connection=invalid_state')
  assert.equal(calls.length, 0)
})

test('user cancellation returns an actionable result', async () => {
  const handler = createGithubHandler(config)
  const begin = await call(handler, '/api/github/connect')
  const state = new URL(begin.headers.location).searchParams.get('state')
  const denied = await call(handler, `/api/github/callback?state=${state}&error=access_denied`, { headers: { cookie: `vibebud_gh_flow=${state}` } })
  assert.equal(denied.headers.location, '/github?connection=denied')
})

test('repository listing is limited to installations visible to the user token', async () => {
  const { fetcher } = mockGitHub()
  const handler = createGithubHandler(config, fetcher)
  const { cookie } = await login(handler)
  const result = await call(handler, '/api/github/repositories', { headers: { cookie } })
  assert.equal(result.data.repositories[0].id, 42)
  assert.equal(result.data.repositories[0].private, true)
  assert.equal((await call(handler, '/api/github/repositories/999/activity', { headers: { cookie } })).status, 404)
})

test('activity normalizes commits, distinguishes merged PRs and excludes PRs from issues', async () => {
  const { fetcher } = mockGitHub()
  const handler = createGithubHandler(config, fetcher)
  const { cookie } = await login(handler)
  const result = await call(handler, '/api/github/repositories/42/activity', { headers: { cookie } })
  assert.equal(result.status, 200)
  assert.equal(result.data.commits[0].title, 'Implement login')
  assert.equal(result.data.pulls[0].state, 'merged')
  assert.equal(result.data.issues.length, 1)
  assert.deepEqual(result.data.warnings, [])
  assert.doesNotMatch(result.body, /private-user-token|Internal detail/)
})

test('missing issue permissions show a partial failure rather than a false empty state', async () => {
  const { fetcher } = mockGitHub({ '/repos/person/private-app/issues': () => response({}, 403) })
  const handler = createGithubHandler(config, fetcher)
  const { cookie } = await login(handler)
  const result = await call(handler, '/api/github/repositories/42/activity', { headers: { cookie } })
  assert.equal(result.status, 200)
  assert.equal(result.data.commits.length, 1)
  assert.equal(result.data.warnings[0].feed, 'issues')
})

test('empty repository is supported and upstream rate limits are explicit', async () => {
  const { fetcher } = mockGitHub({ '/repos/person/private-app/commits': () => response({}, 409), '/repos/person/private-app/pulls': () => response({}, 429) })
  const handler = createGithubHandler(config, fetcher)
  const { cookie } = await login(handler)
  const result = await call(handler, '/api/github/repositories/42/activity', { headers: { cookie } })
  assert.deepEqual(result.data.commits, [])
  assert.equal(result.data.warnings[0].feed, 'pulls')
  assert.match(result.data.warnings[0].message, /Limite/)
})

test('revoked authorization invalidates the local session', async () => {
  const { fetcher } = mockGitHub({ '/user/installations': () => response({}, 401) })
  const handler = createGithubHandler(config, fetcher)
  const { cookie } = await login(handler)
  assert.equal((await call(handler, '/api/github/repositories', { headers: { cookie } })).status, 401)
  assert.equal((await call(handler, '/api/github/status', { headers: { cookie } })).data.connected, false)
})

test('disconnect requires same-origin POST, revokes token and clears session', async () => {
  const { fetcher, calls } = mockGitHub()
  const handler = createGithubHandler(config, fetcher)
  const { cookie } = await login(handler)
  assert.equal((await call(handler, '/api/github/disconnect', { method: 'POST', headers: { cookie, origin: 'https://evil.example' } })).status, 403)
  const result = await call(handler, '/api/github/disconnect', { method: 'POST', headers: { cookie, origin: config.APP_ORIGIN } })
  assert.equal(result.status, 200)
  assert.equal(calls.at(-1).options.method, 'DELETE')
  assert.match(result.headers['set-cookie'], /Max-Age=0/)
  assert.equal((await call(handler, '/api/github/status', { headers: { cookie } })).data.connected, false)
})

test('production requires HTTPS and adds secure cookies', async () => {
  assert.throws(() => createGithubHandler({ ...config, NODE_ENV: 'production' }), /HTTPS/)
  const handler = createGithubHandler({ ...config, NODE_ENV: 'production', APP_ORIGIN: 'https://vibebud.example' })
  const result = await call(handler, '/api/github/connect', { headers: { host: 'vibebud.example' } })
  assert.match(result.headers['set-cookie'], /Secure/)
  assert.equal((await call(handler, '/api/github/connect', { headers: { host: 'evil.example' } })).status, 400)
})

test('repository picker follows pagination without dropping authorized repositories', async () => {
  const { fetcher } = mockGitHub({ '/user/installations/1/repositories': (url) => {
    const page = new URL(url).searchParams.get('page')
    return response({ repositories: page === '1' ? Array.from({ length: 100 }, (_, i) => ({ ...repository, id: i + 100, full_name: `person/repo-${i}` })) : [repository] })
  } })
  const handler = createGithubHandler(config, fetcher)
  const { cookie } = await login(handler)
  const result = await call(handler, '/api/github/repositories', { headers: { cookie } })
  assert.equal(result.data.repositories.length, 101)
  assert.ok(result.data.repositories.some((r) => r.id === 42))
})

test('expired OAuth flow and expired session cannot be reused', async (t) => {
  t.mock.timers.enable({ apis: ['Date'], now: 1700000000000 })
  const { fetcher } = mockGitHub({ '/login/oauth/access_token': () => response({ access_token: 'private-user-token', expires_in: 1 }) })
  const handler = createGithubHandler(config, fetcher)
  const begin = await call(handler, '/api/github/connect')
  const state = new URL(begin.headers.location).searchParams.get('state')
  t.mock.timers.tick(600001)
  const callback = await call(handler, `/api/github/callback?code=test&state=${state}`, { headers: { cookie: `vibebud_gh_flow=${state}` } })
  assert.equal(callback.headers.location, '/github?connection=invalid_state')
  const { cookie } = await login(handler)
  t.mock.timers.tick(1001)
  assert.equal((await call(handler, '/api/github/status', { headers: { cookie } })).data.connected, false)
  assert.equal((await call(handler, '/api/github/repositories', { headers: { cookie } })).status, 401)
})

test('failed token revocation is reported and may be retried', async () => {
  const { fetcher } = mockGitHub({ '/applications/client/token': () => response({}, 500) })
  const handler = createGithubHandler(config, fetcher)
  const { cookie } = await login(handler)
  const result = await call(handler, '/api/github/disconnect', { method: 'POST', headers: { cookie, origin: config.APP_ORIGIN } })
  assert.equal(result.status, 502)
  assert.equal((await call(handler, '/api/github/status', { headers: { cookie } })).data.connected, true)
})

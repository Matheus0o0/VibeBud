import { randomBytes, createHash, timingSafeEqual } from 'node:crypto'

const random = () => randomBytes(32).toString('base64url')
class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status }
}
const repoView = (r) => ({ id: r.id, fullName: r.full_name, private: r.private, url: r.html_url, defaultBranch: r.default_branch, description: r.description })
const safeEqual = (a, b) => typeof a === 'string' && typeof b === 'string' && a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b))

export function createGithubHandler(config = {}, fetcher = fetch) {
  const origin = new URL(config.APP_ORIGIN || 'http://localhost:5173').origin
  if (config.NODE_ENV === 'production' && !origin.startsWith('https://')) throw new Error('APP_ORIGIN deve usar HTTPS em produção.')
  const configured = Boolean(config.GITHUB_CLIENT_ID && config.GITHUB_CLIENT_SECRET && /^[a-z0-9-]+$/.test(config.GITHUB_APP_SLUG || ''))
  const installUrl = configured ? `https://github.com/apps/${config.GITHUB_APP_SLUG}/installations/new` : null
  const secure = origin.startsWith('https://') ? '; Secure' : ''
  const callback = `${origin}/api/github/callback`
  const sessions = new Map()
  const flows = new Map()
  const json = (res, status, data) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(data)) }
  const redirect = (res, location) => { res.writeHead(302, { Location: location }); res.end() }
  const cookie = (name, value, seconds) => `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${secure}`
  const clearSession = (res, id) => { sessions.delete(id); res.setHeader('Set-Cookie', cookie('vibebud_gh', '', 0)) }

  async function request(path, token, options = {}) {
    const response = await fetcher(`https://api.github.com${path}`, {
      ...options, signal: AbortSignal.timeout(15000),
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2026-03-10', 'User-Agent': 'VibeBud', ...options.headers },
    })
    if (!response.ok) {
      if (response.status === 401) throw new ApiError(401, 'Sua conexão expirou ou foi revogada. Conecte o GitHub novamente.')
      if (response.status === 429 || response.headers.get('x-ratelimit-remaining') === '0') throw new ApiError(429, 'Limite do GitHub atingido. Aguarde alguns minutos e tente novamente.')
      if (response.status === 403) throw new ApiError(403, 'O GitHub não permitiu esse acesso. Confira as permissões de leitura e a aprovação da organização.')
      if (response.status === 404) throw new ApiError(404, 'Repositório indisponível. Confira o acesso da GitHub App.')
      if (response.status === 409) throw new ApiError(409, 'Este repositório ainda não possui commits.')
      throw new ApiError(502, 'O GitHub não conseguiu responder. Tente novamente.')
    }
    return response.json()
  }

  async function pages(path, key, token) {
    const values = []
    // Never silently return an incomplete repository picker.
    for (let page = 1; page <= 100; page++) {
      const data = await request(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`, token)
      const items = data[key]
      if (!Array.isArray(items)) throw new ApiError(502, 'Resposta inesperada do GitHub.')
      values.push(...items)
      if (items.length < 100) return values
    }
    throw new ApiError(422, 'Há muitos repositórios nesta instalação. Selecione menos repositórios nas permissões da App.')
  }

  async function repositories(session, force = false) {
    if (!force && session.repositories && Date.now() - session.repoFetchedAt < 60000) return session.repositories
    const installations = await pages('/user/installations', 'installations', session.token)
    const result = []
    for (const installation of installations) {
      if (installation.suspended_at) continue
      result.push(...await pages(`/user/installations/${installation.id}/repositories`, 'repositories', session.token))
    }
    session.repositories = [...new Map(result.map((repo) => [repo.id, repo])).values()]
    session.repoFetchedAt = Date.now()
    return session.repositories
  }

  return async function githubHandler(req, res, next = () => json(res, 404, { message: 'Rota não encontrada.' })) {
    const url = new URL(req.url || '/', origin)
    if (!url.pathname.startsWith('/api/github/')) return next()
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'no-referrer')
    // Opportunistic cleanup keeps expired credentials and flow verifiers out of memory.
    for (const [key, value] of sessions) if (value.expiresAt <= Date.now()) sessions.delete(key)
    for (const [key, value] of flows) if (value.expiresAt <= Date.now()) flows.delete(key)
    const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map((part) => part.trim().split('=')))
    const sid = cookies.vibebud_gh
    const session = sessions.get(sid)
    try {
      if (!['GET', 'POST'].includes(req.method)) throw new ApiError(405, 'Método não permitido.')
      if (req.method === 'POST' && req.headers.origin !== origin) throw new ApiError(403, 'Origem da solicitação inválida.')
      if (url.pathname === '/api/github/status' && req.method === 'GET') {
        return json(res, 200, { configured, connected: Boolean(session), user: session?.user ?? null, installUrl })
      }
      if (!configured) throw new ApiError(503, 'A conexão GitHub ainda precisa ser configurada pelo responsável pelo VibeBud.')
      if (url.pathname === '/api/github/connect' && req.method === 'GET') {
        // A fixed origin avoids host-header based callback manipulation.
        if (url.origin !== origin || req.headers.host !== new URL(origin).host) throw new ApiError(400, `Abra o VibeBud pelo endereço configurado: ${origin}`)
        const state = random()
        const verifier = random()
        flows.delete(cookies.vibebud_gh_flow)
        if (flows.size >= 1000) throw new ApiError(429, 'Muitas tentativas de conexão. Tente novamente em alguns minutos.')
        flows.set(state, { verifier, expiresAt: Date.now() + 600000 })
        res.setHeader('Set-Cookie', cookie('vibebud_gh_flow', state, 600))
        const params = new URLSearchParams({ client_id: config.GITHUB_CLIENT_ID, redirect_uri: callback, state, code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256' })
        return redirect(res, `https://github.com/login/oauth/authorize?${params}`)
      }
      if (url.pathname === '/api/github/callback' && req.method === 'GET') {
        const state = url.searchParams.get('state')
        const flow = flows.get(state)
        flows.delete(state)
        res.setHeader('Set-Cookie', cookie('vibebud_gh_flow', '', 0))
        if (!flow || !safeEqual(state, cookies.vibebud_gh_flow)) return redirect(res, '/github?connection=invalid_state')
        if (url.searchParams.has('error')) return redirect(res, '/github?connection=denied')
        const code = url.searchParams.get('code')
        if (!code || code.length > 512) return redirect(res, '/github?connection=failed')
        try {
          const response = await fetcher('https://github.com/login/oauth/access_token', {
            method: 'POST', signal: AbortSignal.timeout(15000), headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ client_id: config.GITHUB_CLIENT_ID, client_secret: config.GITHUB_CLIENT_SECRET, code, redirect_uri: callback, code_verifier: flow.verifier }),
          })
          const data = await response.json()
          if (!response.ok || !data.access_token || data.error) throw new Error('Token exchange failed')
          const user = await request('/user', data.access_token)
          const id = random()
          const lifetime = Math.min(Number(data.expires_in) || 28800, 28800)
          sessions.delete(sid)
          sessions.set(id, { token: data.access_token, expiresAt: Date.now() + lifetime * 1000, user: { id: user.id, login: user.login, name: user.name } })
          res.setHeader('Set-Cookie', [cookie('vibebud_gh_flow', '', 0), cookie('vibebud_gh', id, lifetime)])
          return redirect(res, '/github?connection=success')
        } catch { return redirect(res, '/github?connection=failed') }
      }
      if (!session) throw new ApiError(401, 'Conecte sua conta GitHub para continuar.')
      if (url.pathname === '/api/github/disconnect' && req.method === 'POST') {
        // Revokes the issued token, not the installation or repository access for other users.
        const response = await fetcher(`https://api.github.com/applications/${encodeURIComponent(config.GITHUB_CLIENT_ID)}/token`, {
          method: 'DELETE', signal: AbortSignal.timeout(15000),
          headers: { Accept: 'application/vnd.github+json', Authorization: `Basic ${Buffer.from(`${config.GITHUB_CLIENT_ID}:${config.GITHUB_CLIENT_SECRET}`).toString('base64')}`, 'Content-Type': 'application/json', 'User-Agent': 'VibeBud' },
          body: JSON.stringify({ access_token: session.token }),
        })
        if (![204, 404].includes(response.status)) throw new ApiError(502, 'Não foi possível revogar o token no GitHub. Tente desconectar novamente.')
        clearSession(res, sid)
        return json(res, 200, { connected: false })
      }
      if (url.pathname === '/api/github/repositories' && req.method === 'GET') {
        const repos = await repositories(session, url.searchParams.get('refresh') === '1')
        return json(res, 200, { repositories: repos.map(repoView).sort((a, b) => a.fullName.localeCompare(b.fullName)) })
      }
      const match = url.pathname.match(/^\/api\/github\/repositories\/(\d+)\/activity$/)
      if (match && req.method === 'GET') {
        const repos = await repositories(session)
        const selected = repos.find((r) => r.id === Number(match[1]))
        if (!selected) throw new ApiError(404, 'Este repositório não está disponível para sua conexão. Revise o acesso da App.')
        const path = `/repos/${selected.full_name.split('/').map(encodeURIComponent).join('/')}`
        const repo = await request(path, session.token)
        // Partial failures remain explicit; an unavailable feed never masquerades as empty.
        const feeds = await Promise.allSettled([
          request(`${path}/commits?per_page=10`, session.token).catch((e) => { if (e.status === 409) return []; throw e }),
          request(`${path}/pulls?state=all&sort=updated&direction=desc&per_page=10`, session.token),
          request(`${path}/issues?state=all&sort=updated&direction=desc&per_page=20`, session.token),
        ])
        const warnings = []
        const value = (i, name) => {
          if (feeds[i].status === 'fulfilled') return feeds[i].value
          if (feeds[i].reason.status === 401) throw feeds[i].reason
          warnings.push({ feed: name, message: feeds[i].reason.message || 'Não foi possível carregar esta atividade.' })
          return []
        }
        const commits = value(0, 'commits').map((c) => ({ id: c.sha, title: c.commit.message.split('\n')[0], url: c.html_url, author: c.author?.login || c.commit.author?.name || 'Autor não informado', date: c.commit.committer?.date || c.commit.author?.date }))
        const pulls = value(1, 'pulls').map((p) => ({ id: p.id, number: p.number, title: p.title, url: p.html_url, author: p.user?.login, date: p.updated_at, state: p.merged_at ? 'merged' : p.state }))
        const issues = value(2, 'issues').filter((i) => !i.pull_request).map((i) => ({ id: i.id, number: i.number, title: i.title, url: i.html_url, author: i.user?.login, date: i.updated_at, state: i.state }))
        return json(res, 200, { repository: repoView(repo), commits, pulls, issues, warnings, fetchedAt: new Date().toISOString() })
      }
      throw new ApiError(404, 'Rota não encontrada.')
    } catch (error) {
      if (error.status === 401) clearSession(res, sid)
      const status = error.status || 502
      return json(res, status, { message: error.status ? error.message : 'Não foi possível falar com o GitHub. Verifique a conexão e tente novamente.' })
    }
  }
}

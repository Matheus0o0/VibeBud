import { createServer } from 'node:http'
import { createGithubHandler } from './github.mjs'

// Deploy behind HTTPS with /api/github/* routed here and dist served by the frontend host.
const handler = createGithubHandler(process.env)
createServer((req, res) => { void handler(req, res) }).listen(Number(process.env.PORT) || 3001, '127.0.0.1', () => {
  console.log('VibeBud GitHub API pronta.')
})

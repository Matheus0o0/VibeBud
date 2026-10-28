import type { IncomingMessage, ServerResponse } from 'node:http'
export function createGithubHandler(config?: Record<string, string | undefined>, fetcher?: typeof fetch): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void>

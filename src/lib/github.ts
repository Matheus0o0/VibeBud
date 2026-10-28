export type GitHubUser = { id: number; login: string; name: string | null }
export type GitHubStatus = { configured: boolean; connected: boolean; user: GitHubUser | null; installUrl: string | null }
export type GitHubRepository = { id: number; fullName: string; private: boolean; url: string; defaultBranch: string; description: string | null }
export type GitHubEvent = { id: string | number; number?: number; title: string; url: string; author: string; date?: string; state?: string }
export type GitHubActivity = { repository: GitHubRepository; commits: GitHubEvent[]; pulls: GitHubEvent[]; issues: GitHubEvent[]; warnings: { feed: string; message: string }[]; fetchedAt: string }

export class GitHubError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

export async function githubRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/github/${path}`, { ...options, credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json', ...options.headers } })
  const data = await response.json().catch(() => null)
  if (!response.ok || !data) throw new GitHubError(response.status, data?.message || 'A integração não respondeu. Verifique se o servidor do VibeBud está ativo.')
  return data as T
}

export function githubUrl(value: string) {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'github.com' ? url.href : undefined } catch { return undefined }
}

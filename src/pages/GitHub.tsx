import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GitFork as Github, ArrowUpRight, RefreshCw, LockKeyhole, GitCommitHorizontal, GitPullRequest, CircleDot, ShieldCheck, Unplug, Link2 } from 'lucide-react'
import PageShell from '../components/PageShell'
import PageHeader from '../components/PageHeader'
import Card from '../components/Card'
import Button from '../components/Button'
import { TextField } from '../components/TextField'
import { githubRequest, GitHubError, githubUrl } from '../lib/github'
import type { GitHubStatus, GitHubRepository, GitHubActivity, GitHubEvent } from '../lib/github'
import { useStore, selectCurrentProject } from '../lib/store'

const callbackMessages: Record<string, string> = {
  success: 'Conta conectada. Agora selecione o repositório que deseja acompanhar.',
  denied: 'A autorização foi cancelada. Você pode tentar novamente quando quiser.',
  invalid_state: 'A tentativa de conexão expirou ou não pôde ser validada. Inicie uma nova conexão.',
  failed: 'Não foi possível concluir a conexão com o GitHub. Tente novamente.',
}
const dateLabel = (value?: string) => value ? new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Data não informada'

export default function GitHubPage() {
  const [params, setParams] = useSearchParams()
  const [notice, setNotice] = useState(() => callbackMessages[params.get('connection') || ''] || '')
  const projects = useStore((s) => s.projects)
  const project = useStore(selectCurrentProject)
  const updateProject = useStore((s) => s.updateProject)
  const setCurrentProject = useStore((s) => s.setCurrentProject)
  const [status, setStatus] = useState<GitHubStatus | null>(null)
  const [repos, setRepos] = useState<GitHubRepository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [search, setSearch] = useState('')
  const [repositoryId, setRepositoryId] = useState('')
  const [activity, setActivity] = useState<GitHubActivity | null>(null)
  const [activityError, setActivityError] = useState('')
  const [activityLoading, setActivityLoading] = useState(false)
  const [activityRefresh, setActivityRefresh] = useState(0)
  const [disconnecting, setDisconnecting] = useState(false)
  const binding = project?.github
  const ownBinding = Boolean(status?.user && binding?.connectedUserId === status.user.id)

  useEffect(() => {
    if (params.has('connection')) {
      const next = new URLSearchParams(params)
      next.delete('connection')
      setParams(next, { replace: true })
    }
  }, [params, setParams])

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError('')
      try {
        const next = await githubRequest<GitHubStatus>('status', { signal: controller.signal })
        if (controller.signal.aborted) return
        setStatus(next)
        if (next.connected) {
          const data = await githubRequest<{ repositories: GitHubRepository[] }>(`repositories?refresh=${refresh ? '1' : '0'}`, { signal: controller.signal })
          if (!controller.signal.aborted) setRepos(data.repositories)
        } else setRepos([])
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : 'Não foi possível carregar a conexão.')
          if (e instanceof GitHubError && e.status === 401) { setStatus((s) => s && ({ ...s, connected: false, user: null })); setRepos([]) }
        }
      } finally { if (!controller.signal.aborted) setLoading(false) }
    }
    void load()
    return () => controller.abort()
  }, [refresh])

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setActivity(null)
      setActivityError('')
      if (!status?.connected || !binding || !ownBinding) { setActivityLoading(false); return }
      setActivityLoading(true)
      try {
        const data = await githubRequest<GitHubActivity>(`repositories/${binding.repositoryId}/activity`, { signal: controller.signal })
        if (!controller.signal.aborted) setActivity(data)
      } catch (e) {
        if (!controller.signal.aborted) {
          setActivityError(e instanceof Error ? e.message : 'Não foi possível carregar as atividades.')
          if (e instanceof GitHubError && e.status === 401) { setStatus((s) => s && ({ ...s, connected: false, user: null })); setRepos([]) }
        }
      } finally { if (!controller.signal.aborted) setActivityLoading(false) }
    }
    void load()
    return () => controller.abort()
  }, [status?.connected, binding, ownBinding, activityRefresh])

  useEffect(() => {
    if (!status?.connected || !ownBinding) return
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') setActivityRefresh((n) => n + 1) }, 120000)
    return () => window.clearInterval(timer)
  }, [status?.connected, ownBinding])

  const disconnect = async () => {
    setDisconnecting(true)
    setError('')
    try {
      await githubRequest('disconnect', { method: 'POST' })
      setStatus((s) => s && ({ ...s, connected: false, user: null }))
      setRepos([])
      setActivity(null)
      setNotice('Conta desconectada. O planejamento e as sessões do seu projeto foram preservados.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível desconectar.') }
    finally { setDisconnecting(false) }
  }

  const linkRepository = () => {
    const repo = repos.find((r) => r.id === Number(repositoryId))
    if (!repo || !project || !status?.user) return
    updateProject(project.id, { github: { repositoryId: repo.id, fullName: repo.fullName, private: repo.private, connectedUserId: status.user.id } })
    setNotice(`Repositório ${repo.fullName} vinculado a ${project.name}.`)
    setActivityRefresh((n) => n + 1)
  }

  return (
    <PageShell>
      <PageHeader title="Seu projeto no GitHub" description="Acompanhe o que mudou e retome de onde parou." />
      {notice && <div role="status" className="mb-5 p-4 rounded-lg border border-info/25 bg-info/5 text-sm text-muted flex justify-between gap-3">{notice}<button onClick={() => setNotice('')} className="text-xs underline shrink-0">Fechar</button></div>}
      {error && <div role="alert" className="mb-5 p-4 rounded-lg border border-danger/30 text-sm text-danger">{error} <button className="underline ml-2" onClick={() => setRefresh((n) => n + 1)}>Tentar novamente</button></div>}
      <Card className="p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex gap-4 min-w-0">
            <span className="w-11 h-11 grid place-items-center rounded-xl bg-elevated border border-border shrink-0"><Github size={23} aria-hidden="true" /></span>
            <div><h2 className="text-base font-semibold">{status?.connected ? `Conectado como @${status.user?.login}` : 'Conecte sua conta GitHub'}</h2><p className="text-sm text-dim mt-1 max-w-xl">Repositórios públicos e privados, com acesso de leitura apenas aos que você autorizar.</p></div>
          </div>
          {loading ? <span role="status" className="text-sm text-dim">Verificando conexão…</span> : status?.connected ? (
            <Button variant="secondary" onClick={disconnect} loading={disconnecting}><Unplug size={15} /> Desconectar</Button>
          ) : status?.configured ? <a href="/api/github/connect" className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand text-bg px-4 text-sm font-medium hover:bg-brand-hover"><Github size={16} /> Conectar GitHub</a> : <span className="text-xs text-warning border border-warning/25 bg-warning/5 rounded-full px-3 py-1.5">Configuração pendente</span>}
        </div>
        <p className="flex items-start gap-2 text-xs text-dim mt-5 pt-4 border-t border-border"><ShieldCheck size={15} className="shrink-0 text-success" /> Sua autorização fica protegida no servidor. Commits não concluem tarefas nem alteram sua sequência automaticamente.</p>
        {status && !status.configured && <p className="text-sm text-muted mt-4">A integração ainda precisa ser ativada pelo responsável pelo VibeBud. Assim que estiver disponível, você poderá conectar sua conta aqui.</p>}
      </Card>

      {status?.connected && <>
        <Card className="p-6 mb-6">
          <h2 className="text-base font-semibold mb-4">Vincular ao seu projeto</h2>
          {!project ? <p className="text-sm text-dim">Crie um projeto para vincular um repositório. <Link to="/new" className="text-brand underline">Criar projeto</Link></p> : <>
            <label className="block text-xs text-muted mb-2" htmlFor="github-project">Projeto no VibeBud</label>
            <select id="github-project" className="w-full bg-elevated border border-border rounded-lg h-11 px-3 text-sm mb-5" value={project.id} onChange={(e) => { setCurrentProject(e.target.value); setRepositoryId('') }}>
              {projects.filter((p) => !p.archived || p.id === project.id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {binding && <div className="flex flex-wrap justify-between items-center gap-3 mb-5 p-3 border border-border bg-surface rounded-lg"><div className="min-w-0"><p className="text-sm break-all"><Link2 size={14} className="inline mr-2 text-brand" />{binding.fullName}</p><p className="text-xs text-dim mt-1">{ownBinding ? 'Repositório vinculado' : 'Vinculado a outra conta. Selecione um repositório para esta conexão.'}</p></div><Button variant="ghost" onClick={() => { updateProject(project.id, { github: undefined }); setNotice('Vínculo removido. Seus dados no GitHub foram preservados.') }}>Remover vínculo</Button></div>}
            <TextField label="Buscar repositório autorizado" placeholder="Ex.: minha-conta/meu-projeto" value={search} onChange={(e) => setSearch(e.target.value)} />
            <label htmlFor="github-repository" className="block text-xs text-muted mt-4 mb-2">Repositório no GitHub</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <select id="github-repository" className="min-w-0 flex-1 w-full bg-elevated border border-border rounded-lg h-11 px-3 text-sm" value={repositoryId} onChange={(e) => setRepositoryId(e.target.value)} disabled={loading}>
                <option value="">Selecione um repositório</option>
                {repos.filter((r) => r.fullName.toLowerCase().includes(search.toLowerCase()) || String(r.id) === repositoryId).map((r) => <option key={r.id} value={r.id}>{r.fullName} {r.private ? '· Privado' : '· Público'}</option>)}
              </select>
              <Button onClick={linkRepository} disabled={!repositoryId || loading}>Vincular repositório</Button>
            </div>
            {!loading && repos.length === 0 && <p className="text-sm text-muted mt-4">Nenhum repositório autorizado. Instale a App na sua conta ou organização e escolha os repositórios.</p>}
            {search && !repos.some((r) => r.fullName.toLowerCase().includes(search.toLowerCase())) && repos.length > 0 && <p className="text-xs text-dim mt-3">Nenhum repositório corresponde à busca.</p>}
          </>}
          <div className="flex flex-wrap items-center gap-4 mt-5 text-xs">
            {status.installUrl && <a href={status.installUrl} target="_blank" rel="noopener noreferrer" className="text-brand inline-flex items-center gap-1">Autorizar repositórios no GitHub <ArrowUpRight size={13} /></a>}
            <button disabled={loading} onClick={() => setRefresh((n) => n + 1)} className="text-muted hover:text-fg disabled:opacity-50 inline-flex items-center gap-1"><RefreshCw size={13} /> Atualizar lista</button>
          </div>
        </Card>

        {binding && ownBinding && <section aria-label="Atividade do repositório" aria-busy={activityLoading}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4"><div><h2 className="text-base font-semibold">Desenvolvimento recente</h2><p className="text-xs text-dim mt-1">Atualização a cada 2 minutos enquanto esta tela estiver visível.</p></div><Button variant="secondary" disabled={activityLoading} onClick={() => setActivityRefresh((n) => n + 1)}><RefreshCw size={14} className={activityLoading ? 'animate-spin' : ''} /> Atualizar</Button></div>
          {activityLoading && <p role="status" className="text-sm text-dim py-8">Consultando atividades no GitHub…</p>}
          {activityError && <p role="alert" className="border border-danger/30 rounded-lg p-4 text-sm text-danger mb-4">{activityError}</p>}
          {activity && <>
            <div className="flex flex-wrap gap-3 text-xs text-muted mb-4"><a href={githubUrl(activity.repository.url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-brand break-all"><Github size={14} />{activity.repository.fullName}<ArrowUpRight size={12} /></a>{activity.repository.private && <span className="inline-flex items-center gap-1"><LockKeyhole size={12} /> Privado</span>}<span>Branch: {activity.repository.defaultBranch}</span></div>
            <div className="grid xl:grid-cols-3 gap-4">
              <ActivityFeed title="Últimos commits" icon={<GitCommitHorizontal size={17} />} items={activity.commits} empty="Nenhum commit na branch padrão." error={activity.warnings.find((w) => w.feed === 'commits')?.message} />
              <ActivityFeed title="Pull requests recentes" icon={<GitPullRequest size={17} />} items={activity.pulls} empty="Nenhum pull request encontrado." error={activity.warnings.find((w) => w.feed === 'pulls')?.message} />
              <ActivityFeed title="Issues recentes" icon={<CircleDot size={17} />} items={activity.issues} empty="Nenhuma issue nesta consulta." error={activity.warnings.find((w) => w.feed === 'issues')?.message} />
            </div>
            <p className="text-xs text-dim mt-4">Consultado em {dateLabel(activity.fetchedAt)}. Até 10 commits da branch padrão, 10 pull requests e issues entre os 20 itens mais recentes. Atividades podem incluir outros colaboradores.</p>
          </>}
        </section>}
      </>}
    </PageShell>
  )
}

function ActivityFeed({ title, icon, items, empty, error }: { title: string; icon: ReactNode; items: GitHubEvent[]; empty: string; error?: string }) {
  const states: Record<string, string> = { open: 'Aberto', closed: 'Fechado', merged: 'Integrado' }
  return <Card className="p-5 min-w-0"><h3 className="flex items-center gap-2 text-sm font-semibold mb-4"><span className="text-brand">{icon}</span>{title}</h3>{error ? <p role="alert" className="text-xs text-warning">{error}</p> : items.length ? <ul className="divide-y divide-border">{items.map((item) => <li key={item.id} className="py-3 first:pt-0"><a href={githubUrl(item.url)} target="_blank" rel="noopener noreferrer" className="block text-sm text-fg hover:text-brand break-words">{item.number && <span className="text-dim">#{item.number} </span>}{item.title}</a><p className="text-xs text-dim mt-1 break-words">{item.author} · {dateLabel(item.date)}</p>{item.state && <span className={`inline-block mt-2 text-[11px] rounded px-2 py-0.5 ${item.state === 'open' ? 'bg-success/10 text-success' : 'bg-elevated text-muted'}`}>{states[item.state] || item.state}</span>}</li>)}</ul> : <p className="text-sm text-dim">{empty}</p>}</Card>
}

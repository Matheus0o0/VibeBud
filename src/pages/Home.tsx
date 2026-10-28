import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, CheckCheck, FolderKanban, ChevronRight, GitFork as Github } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import PageShell from '../components/PageShell'
import ProgressBar from '../components/ProgressBar'
import BuddyScene from '../components/BuddyScene'
import NextActionCard from '../components/NextActionCard'
import EmptyState from '../components/EmptyState'
import StreakIndicator from '../components/StreakIndicator'
import { useStore, selectCurrentProject, selectNextTask, selectProgress } from '../lib/store'
import { currentStreak, bestStreak } from '../lib/streak'

export default function Home() {
  const nav = useNavigate()
  const userName = useStore((s) => s.userName)
  const project = useStore(selectCurrentProject)
  const sessions = useStore((s) => s.sessions)
  const next = selectNextTask(project)
  const progress = selectProgress(project)
  const streak = currentStreak(sessions)
  const best = bestStreak(sessions)

  if (!project) return <EmptyState title="Seu próximo projeto começa aqui." description="Dê o primeiro passo. Crie um projeto e transforme sua ideia em pequenas ações." action={{ label: 'Criar meu projeto', onClick: () => nav('/new') }} buddyMood="encouraging" />

  const greeting = userName ? `Olá, ${userName.charAt(0).toUpperCase()}${userName.slice(1)}!` : 'Olá!'
  const allDone = progress.total > 0 && progress.pct === 100
  return (
    <PageShell>
      <header className="mb-8">
        <h1 className="text-[28px] font-semibold text-fg leading-tight tracking-tight">{greeting}</h1>
        <p className="text-sm text-dim mt-2">Que bom ter você de volta. Vamos continuar?</p>
      </header>
      <div className="home-grid">
        {next && !allDone ? <NextActionCard project={project} task={next.task} stage={next.stage} onStart={() => nav('/session')} /> : (
          <Card className="next-action p-6 lg:p-8 flex flex-col">
            <span className="text-xs text-muted font-medium">Próxima ação</span>
            <div className="mt-7 mb-3 text-brand">{allDone ? <CheckCheck size={24} /> : <FolderKanban size={24} />}</div>
            <h2 className="text-xl font-semibold">{allDone ? 'Você chegou até aqui!' : 'Toda ideia começa com um passo.'}</h2>
            <p className="text-sm text-dim mt-3">{allDone ? 'Todas as tarefas concluídas. Hora de fechar o ciclo e celebrar.' : 'Adicione sua primeira tarefa ao planejamento e vamos colocar esse projeto em movimento.'}</p>
            <Button onClick={() => nav(allDone ? '/completion' : '/planning')} className="mt-auto w-full">
              {allDone ? 'Concluir projeto' : 'Planejar meu próximo passo'} <ArrowRight size={16} />
            </Button>
          </Card>
        )}
        <div className="home-companion">
          <Link to="/buddy" className="home-buddy-art" aria-label="Conhecer meu Buddy"><BuddyScene scene="desk" mood="working" size={300} /></Link>
          <Card className="p-5">
            <h2 className="text-xs text-muted font-medium mb-5">Sequência de desenvolvimento</h2>
            <div className="grid grid-cols-2 gap-3 divide-x divide-border">
              <StreakIndicator current={streak} best={best} showBest={false} label="Atual" />
              <StreakIndicator current={best} best={best} label="Melhor sequência" showBest={false} />
            </div>
          </Card>
        </div>
      </div>
      <Card className="home-progress p-6 mt-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div><h2 className="text-sm font-medium">Progresso do projeto</h2><p className="text-xs text-dim mt-1">{project.name} · {progress.done} de {progress.total} tarefas concluídas</p></div>
          <span className="text-xl text-fg font-semibold tabular-nums">{progress.pct}%</span>
        </div>
        <ProgressBar value={progress.pct} />
        <Link to="/progress" className="inline-flex items-center gap-1 text-xs text-dim hover:text-brand mt-4">Ver meu progresso <ChevronRight size={13} /></Link>
      </Card>
      <p className="text-xs text-dim mt-6 flex items-center gap-2"><span className="status-dot" /> Um pequeno progresso já conta.</p>
      <Link to="/github" className="flex items-center gap-2 text-sm text-muted hover:text-brand mt-5"><Github size={16} />{project.github ? `Acompanhar ${project.github.fullName}` : 'Conectar meu projeto ao GitHub'}<ChevronRight size={14} /></Link>
    </PageShell>
  )
}

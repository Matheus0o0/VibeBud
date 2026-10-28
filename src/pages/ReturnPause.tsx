import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import BuddyCharacter from '../components/BuddyCharacter'
import { useStore, selectCurrentProject, selectNextTask, selectProgress } from '../lib/store'

export default function ReturnPause() {
  const nav = useNavigate()
  const project = useStore(selectCurrentProject)
  const sessions = useStore((s) => s.sessions)
  const next = selectNextTask(project)
  const progress = selectProgress(project)

  if (!project) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <BuddyCharacter mood="encouraging" size={160} />
        <h1 className="text-2xl font-semibold text-fg mt-4">Vamos começar algo?</h1>
        <p className="text-muted mt-2">Nenhum projeto ativo. Vamos criar o primeiro.</p>
        <Button onClick={() => nav('/new')} className="mt-6">Criar projeto</Button>
      </div>
    )
  }

  const lastSession = [...sessions]
    .filter((s) => s.projectId === project.id)
    .sort((a, b) => (b.endedAt ?? '').localeCompare(a.endedAt ?? ''))[0]

  return (
    <div className="min-h-dvh grid place-items-center bg-bg">
      <div className="max-w-xl w-full px-6 py-10 text-center">
        <BuddyCharacter mood="returning" size={160} />
        <h1 className="text-3xl font-semibold text-fg mt-5">Bom ter você de volta!</h1>
        <p className="text-muted mt-2">Vamos retomar de onde parou?</p>

        <Card className="p-5 mt-8 text-left">
          <div className="text-[11px] text-dim uppercase tracking-wide">Projeto</div>
          <div className="text-base font-semibold text-fg mt-1">{project.name}</div>

          {lastSession?.note && (
            <>
              <div className="text-[11px] text-dim uppercase tracking-wide mt-4">Último registro</div>
              <div className="text-sm text-muted mt-1">{lastSession.note}</div>
            </>
          )}

          {next && (
            <>
              <div className="text-[11px] text-dim uppercase tracking-wide mt-4">Próximo passo</div>
              <div className="text-sm font-medium text-fg mt-1">{next.task.title}</div>
              <div className="text-xs text-dim mt-0.5">{next.stage.title}</div>
            </>
          )}

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-dim">
            <span>Progresso</span>
            <span className="tabular-nums">{progress.done}/{progress.total} tarefas · {progress.pct}%</span>
          </div>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Button onClick={() => nav(next ? '/session' : '/planning')}>
            Continuar meu projeto <ArrowRight size={16} />
          </Button>
          <Button variant="ghost" onClick={() => nav('/planning')}>Ver resumo</Button>
        </div>
      </div>
    </div>
  )
}

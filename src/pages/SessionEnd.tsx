import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, X, Minus } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import PageShell from '../components/PageShell'
import BuddyCharacter from '../components/BuddyCharacter'
import ProgressRing from '../components/ProgressRing'
import { TextArea } from '../components/TextField'
import { useStore, selectCurrentProject, selectProgress } from '../lib/store'
import type { SessionResult } from '../lib/types'

type Done = 'sim' | 'nao' | 'parcial'

export default function SessionEnd() {
  const nav = useNavigate()
  const project = useStore(selectCurrentProject)
  const active = useStore((s) => s.active)
  const endSession = useStore((s) => s.endSession)
  const toggleTask = useStore((s) => s.toggleTask)
  const recordBlocker = useStore((s) => s.recordBlocker)
  const progress = selectProgress(project)

  const taskInfo = useMemo(() => {
    if (!project || !active?.taskId) return null
    for (const stage of project.stages) {
      const task = stage.tasks.find((t) => t.id === active.taskId)
      if (task) return { task, stage }
    }
    return null
  }, [project, active])

  const [note, setNote] = useState('')
  const [done, setDone] = useState<Done>('sim')
  const [blocker, setBlocker] = useState('')
  const [saved, setSaved] = useState(false)

  if (!project || (!active && !saved)) { nav('/home'); return null }

  const handleSave = () => {
    const resultMap: Record<Done, SessionResult> = { sim: 'completed', nao: 'progress', parcial: 'partial' }
    endSession({ note: note.trim() || undefined, result: resultMap[done] })
    if (done === 'sim' && taskInfo) toggleTask(project.id, taskInfo.stage.id, taskInfo.task.id)
    if (blocker.trim()) {
      recordBlocker({
        projectId: project.id,
        type: 'tecnico',
        description: blocker.trim(),
        nextStep: '',
      })
    }
    setSaved(true)
  }

  const minutes = active ? Math.floor(active.elapsedBeforePause / 60) : 0

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-[28px] font-semibold text-fg leading-tight">Encerramento da sessão</h1>
        <p className="text-sm text-muted mt-1">Registre o que você fez. Isso ajuda o Buddy e seu progresso.</p>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <Card className="p-6">
          <h2 className="text-base font-semibold text-fg">Como foi sua sessão?</h2>
          <p className="text-xs text-muted mt-1">Conte o que você conseguiu fazer e o resultado.</p>

          <div className="mt-5 space-y-5">
            <TextArea
              label="O que você avançou?"
              placeholder="Ex.: Implementei a validação do formulário de cadastro…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />

            <div>
              <div className="text-xs font-medium text-muted mb-2">Tarefa concluída?</div>
              <div className="grid grid-cols-3 gap-2">
                <PillChoice active={done === 'sim'} onClick={() => setDone('sim')} icon={Check} label="Sim" tone="success" />
                <PillChoice active={done === 'nao'} onClick={() => setDone('nao')} icon={X} label="Não" />
                <PillChoice active={done === 'parcial'} onClick={() => setDone('parcial')} icon={Minus} label="Parcialmente" />
              </div>
            </div>

            <TextArea
              label="Tem algum bloqueio? (opcional)"
              placeholder="Ex.: Preciso revisar a integração com a API."
              value={blocker}
              onChange={(e) => setBlocker(e.target.value)}
              rows={2}
            />

            {!saved ? (
              <div className="flex items-center gap-2">
                <Button onClick={handleSave} className="flex-1 h-11">Salvar</Button>
                <Button variant="secondary" onClick={() => nav('/home')} className="h-11">Cancelar</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={() => nav('/home')} className="flex-1 h-11">
                  Ver próxima tarefa <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,121,0,0.2), transparent 65%)' }}
          />
          <div className="relative">
            <BuddyCharacter mood="celebrating" size={168} />
            <h3 className="text-xl font-semibold text-fg mt-4">Boa! Sessão {saved ? 'salva' : 'concluída'}.</h3>
            <p className="text-sm text-muted mt-1">Você avançou mais um pouco no seu projeto.</p>

            <div className="mt-6 w-48 h-48 mx-auto">
              <ProgressRing value={progress.pct} size={192} strokeWidth={6} showGlow={true} />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-brand tabular-nums">{progress.pct}%</div>
                  <div className="text-xs text-faint">progresso do projeto</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5 text-left">
              <SummaryStat label="Tempo" value={`${minutes}m`} />
              <SummaryStat label="Tarefas" value={`${progress.done}/${progress.total}`} />
              <SummaryStat label="Sessão" value={`#${progress.done + 1}`} />
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  )
}

function PillChoice({
  active, onClick, icon: Icon, label, tone,
}: { active: boolean; onClick: () => void; icon: typeof Check; label: string; tone?: 'success' }) {
  const activeCls = tone === 'success'
    ? 'bg-success/15 border-success text-success'
    : 'bg-brand/15 border-brand text-brand'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 rounded-lg border inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
        active ? activeCls : 'bg-elevated border-border text-muted hover:border-border-hover'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  )
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-elevated/60 border border-border rounded-lg px-2.5 py-2">
      <div className="text-[10px] text-dim uppercase tracking-wide">{label}</div>
      <div className="text-sm font-semibold text-fg mt-0.5 tabular-nums">{value}</div>
    </div>
  )
}

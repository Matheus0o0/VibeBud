import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Pause, Square } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import PageShell from '../components/PageShell'
import BuddyCharacter from '../components/BuddyCharacter'
import ProgressRing from '../components/ProgressRing'
import { useStore, selectCurrentProject, selectNextTask } from '../lib/store'

const fmt = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Session() {
  const nav = useNavigate()
  const project = useStore(selectCurrentProject)
  const next = selectNextTask(project)
  const active = useStore((s) => s.active)
  const start = useStore((s) => s.startSession)
  const pause = useStore((s) => s.pauseSession)
  const resume = useStore((s) => s.resumeSession)

  const [elapsed, setElapsed] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) { setElapsed(0); return }
    const tick = () => {
      const extra = active.running
        ? Math.floor((Date.now() - new Date(active.lastResumeAt).getTime()) / 1000)
        : 0
      setElapsed(active.elapsedBeforePause + extra)
      rafRef.current = window.setTimeout(tick, 500) as unknown as number
    }
    tick()
    return () => { if (rafRef.current) clearTimeout(rafRef.current) }
  }, [active])

  if (!project) { nav('/'); return null }

  const toggleRun = () => {
    if (!active) start(project.id, next?.task.id)
    else if (active.running) pause()
    else resume()
  }

  const task = active?.taskId
    ? project.stages.flatMap((s) => s.tasks).find((t) => t.id === active.taskId)
    : next?.task
  const stage = task
    ? project.stages.find((s) => s.tasks.some((t) => t.id === task.id))
    : undefined

  // Progress ring shows minute progress (0-60 seconds)
  const minuteProgress = (elapsed % 60) / 60 * 100

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-[28px] font-semibold text-fg leading-tight">Hora de focar!</h1>
        <p className="text-sm text-muted mt-1">Sem distrações, só você e seu projeto.</p>
      </div>

      <Card className="p-6 lg:p-8 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,121,0,0.14) 0%, transparent 70%)' }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand font-medium bg-brand/10 border border-brand/30 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            Em foco
          </span>

          <h2 className="text-xl lg:text-[22px] font-semibold text-fg mt-4 leading-snug">
            {task?.title ?? 'Sessão livre'}
          </h2>
          {stage && <p className="text-xs text-dim mt-1">{project.name} · {stage.title}</p>}

          <div className="grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10 mt-8 items-center">
            <div className="flex flex-col items-center">
              <div className="relative w-[192px] h-[192px]">
                <ProgressRing value={minuteProgress} size={192} showGlow={active?.running ?? false} />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <div className="text-4xl font-semibold text-fg tabular-nums">{fmt(elapsed)}</div>
                    <div className="text-[10px] text-faint uppercase tracking-wide mt-1">
                      {active?.running ? 'em foco' : elapsed > 0 ? 'pausado' : 'pronto'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-[11px] text-dim uppercase tracking-wide">Tempo de foco</div>
            </div>

            <div className="bg-elevated/70 border border-border rounded-xl p-5 flex items-center gap-4">
              <div className="shrink-0">
                <BuddyCharacter mood="encouraging" size={88} glow={false} />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-brand font-medium">Dica do VibeBud</div>
                <div className="text-sm text-fg mt-1">Você consegue!</div>
                <div className="text-xs text-muted mt-1">
                  Esse é um passo importante para o seu projeto. Um pequeno progresso já conta.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <Button onClick={toggleRun} className="flex-1 h-12 text-base">
              {!active ? <><Play size={16} /> Iniciar sessão</> : active.running ? <><Pause size={16} /> Pausar</> : <><Play size={16} /> Retomar</>}
            </Button>
            <Button variant="secondary" onClick={() => nav('/session/end')} disabled={!active} className="h-12">
              <Square size={14} /> Encerrar
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => nav('/blockers')}
              className="text-dim hover:text-brand transition-colors inline-flex items-center gap-1"
            >
              Está travado? Registrar bloqueio →
            </button>
            {!active && (
              <span className="text-faint">
                Pomodoro é opcional. Trabalhe sem relógio se preferir.
              </span>
            )}
          </div>
        </div>
      </Card>
    </PageShell>
  )
}

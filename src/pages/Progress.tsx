import { Award, Flame, Trophy, Target } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import ActivityCalendar from '../components/ActivityCalendar'
import AchievementCard from '../components/AchievementCard'
import { useStore, selectCurrentProject } from '../lib/store'
import { currentStreak, bestStreak } from '../lib/streak'

export default function Progress() {
  const project = useStore(selectCurrentProject)
  const sessions = useStore((s) => s.sessions)
  const streak = currentStreak(sessions)
  const best = bestStreak(sessions)

  const stagesDone = project?.stages.filter((s) => s.tasks.length > 0 && s.tasks.every((t) => t.done)) ?? []
  const projectPct = (() => {
    if (!project) return 0
    const tasks = project.stages.flatMap((s) => s.tasks)
    return tasks.length === 0 ? 0 : Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100)
  })()

  const totalSessions = sessions.filter((s) => s.projectId === project?.id).length
  const achievements = [
    { id: 'first-session', label: 'Primeira sessão', icon: Target, unlocked: totalSessions >= 1 },
    { id: 'first-streak', label: '3 dias seguidos', icon: Flame, unlocked: best >= 3 },
    { id: 'first-stage', label: 'Primeira etapa', icon: Award, unlocked: stagesDone.length >= 1 },
    { id: 'first-completion', label: 'Primeiro projeto', icon: Trophy, unlocked: Boolean(project?.completedAt) },
  ]

  return (
    <PageShell>
      <PageHeader title="Seu progresso" description="Cada passo conta. Continue assim." />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Sequência atual" value={`${streak}`} suffix={streak === 1 ? 'dia' : 'dias'} highlight />
        <Stat label="Melhor sequência" value={`${best}`} suffix="dias" />
        <Stat label="Progresso do projeto" value={`${projectPct}%`} />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <ActivityCalendar sessions={sessions} projectId={project?.id} />

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-fg mb-3">Etapas concluídas</h3>
            {stagesDone.length === 0 ? (
              <p className="text-xs text-muted">Nenhuma etapa concluída ainda. Continue avançando.</p>
            ) : (
              <ul className="space-y-2">
                {stagesDone.map((s) => (
                  <li key={s.id} className="flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-success/15 border border-success/40 text-success grid place-items-center text-[10px]">✓</span>
                    <span className="text-fg">{s.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-fg mb-3">Conquistas</h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map(({ id, label, icon: Icon, unlocked }) => (
                <AchievementCard
                  key={id}
                  icon={<Icon size={20} />}
                  label={label}
                  unlocked={unlocked}
                  progress={unlocked ? 100 : undefined}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

function Stat({ label, value, suffix, highlight }: { label: string; value: string; suffix?: string; highlight?: boolean }) {
  return (
    <Card className="p-5">
      <div className="text-xs text-dim uppercase tracking-wide">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-2">
        <span className={`text-3xl font-semibold tabular-nums ${highlight ? 'text-brand' : 'text-fg'}`}>{value}</span>
        {suffix && <span className="text-xs text-faint">{suffix}</span>}
      </div>
    </Card>
  )
}

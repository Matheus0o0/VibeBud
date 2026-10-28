import PageHeader from '../components/PageHeader'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import BuddyCharacter from '../components/BuddyCharacter'
import ProgressRing from '../components/ProgressRing'
import { Eye, Focus, Sparkles, Trophy } from 'lucide-react'
import { useStore, selectCurrentProject } from '../lib/store'
import { bestStreak } from '../lib/streak'
import type { BuddyMood } from '../lib/types'

// ponytail: XP curve is a simple quadratic. Replace with real rules when buddy progression is designed.
const xpPerSession = 50
const xpPerTaskDone = 30
const xpForLevel = (lvl: number) => 200 * lvl * lvl

const moods: { value: BuddyMood; label: string; description: string }[] = [
  { value: 'neutral', label: 'Neutro', description: 'Observando você' },
  { value: 'working', label: 'Trabalhando', description: 'Focado na tarefa' },
  { value: 'encouraging', label: 'Incentivando', description: 'Te animando' },
  { value: 'thinking', label: 'Pensativo', description: 'Ajudando a refletir' },
  { value: 'celebrating', label: 'Comemorando', description: 'Celebrando vitórias' },
  { value: 'returning', label: 'Retorno', description: 'Te recebendo de volta' },
]

const unlocks = [
  { id: 'base', label: 'Olhos laranjas', icon: Eye, unlock: 'Disponível', unlocked: true },
  { id: 'focus', label: 'Pose concentrada', icon: Focus, unlock: 'Nível 2' },
  { id: 'glow', label: 'Glow intenso', icon: Sparkles, unlock: 'Sequência de 5 dias' },
  { id: 'victory', label: 'Pose de vitória', icon: Trophy, unlock: 'Concluir projeto' },
]

export default function Buddy() {
  const project = useStore(selectCurrentProject)
  const sessions = useStore((s) => s.sessions)
  const mood = useStore((s) => s.buddyMood)
  const setMood = useStore((s) => s.setBuddyMood)

  const doneTasks = project?.stages.flatMap((s) => s.tasks).filter((t) => t.done).length ?? 0
  const xp = sessions.length * xpPerSession + doneTasks * xpPerTaskDone
  let level = 1
  while (xp >= xpForLevel(level + 1)) level += 1
  const curBase = level === 1 ? 0 : xpForLevel(level)
  const nextBase = xpForLevel(level + 1)
  const pct = Math.max(0, Math.min(100, Math.round(((xp - curBase) / (nextBase - curBase)) * 100)))
  const best = bestStreak(sessions)

  const computedUnlocks = unlocks.map(u => ({
    ...u,
    unlocked: u.id === 'base' || (u.id === 'focus' && level >= 2) || (u.id === 'glow' && best >= 5) || (u.id === 'victory' && project?.completedAt)
  }))

  return (
    <PageShell>
      <PageHeader title="Seu Buddy" description="Ele está evoluindo junto com você!" />

      <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
        <Card className="p-6 flex flex-col items-center text-center">
          <BuddyCharacter mood={mood} size={220} />
          <div className="mt-4 text-xs text-dim uppercase tracking-wide">Nível</div>
          <div className="text-3xl font-semibold text-fg tabular-nums">{level}</div>
          <div className="mt-4 w-full max-w-xs">
            <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
              <ProgressRing value={pct} size={160} strokeWidth={6} showGlow={true} />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-xl font-semibold text-fg tabular-nums">{pct}%</div>
                  <div className="text-xs text-faint">para próximo nível</div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-dim tabular-nums text-center">
              {xp - curBase} / {nextBase - curBase} XP
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-fg mb-3">Expressão atual</h3>
            <div className="grid grid-cols-2 gap-2">
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  aria-pressed={mood === m.value}
                  className={`px-3 h-24 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center justify-center gap-1 text-center ${
                    mood === m.value
                      ? 'bg-brand/15 border-brand text-brand'
                      : 'bg-elevated border-border text-muted hover:border-border-hover'
                  }`}
                >
                  <span className="font-semibold">{m.label}</span>
                  <span className="text-[10px] text-faint">{m.description}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-fg mb-3">Desbloqueios</h3>
            <ul className="space-y-2">
              {computedUnlocks.map((u) => (
                <li key={u.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm ${
                  u.unlocked ? 'bg-brand/10 border-brand/30 text-fg' : 'bg-elevated border-border text-faint'
                }`}>
                  <u.icon size={20} aria-hidden="true" />
                  <span className="flex-1">{u.label}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.unlocked ? 'bg-success/20 text-success' : 'bg-dim/20 text-dim'
                  }">
                    {u.unlocked ? 'Desbloqueado' : u.unlock}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

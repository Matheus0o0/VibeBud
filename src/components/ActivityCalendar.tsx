import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Card from './Card'
import { sessionDays } from '../lib/streak'
import type { Session } from '../lib/types'

type Props = {
  sessions: Session[]
  projectId?: string
  onMonthChange?: (date: Date) => void
  initialMonth?: Date
}

const monthLabel = (d: Date) =>
  d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

export default function ActivityCalendar({ sessions, projectId, onMonthChange, initialMonth }: Props) {
  const [cursor, setCursor] = useState(() => {
    const d = initialMonth ? new Date(initialMonth) : new Date()
    d.setDate(1)
    return d
  })

  const filtered = projectId
    ? sessions.filter((s) => s.projectId === projectId)
    : sessions

  const days = sessionDays(filtered)

  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
  const padStart = first.getDay()
  const lastDay = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: padStart }, () => null as number | null)
    .concat(Array.from({ length: lastDay }, (_, i) => i + 1))

  const key = (day: number) =>
    `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const handlePrev = () => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
    setCursor(next)
    onMonthChange?.(next)
  }

  const handleNext = () => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
    setCursor(next)
    onMonthChange?.(next)
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-fg capitalize">{monthLabel(cursor)}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-lg hover:bg-hover text-dim grid place-items-center"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-lg hover:bg-hover text-dim grid place-items-center"
            aria-label="Próximo mês"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-[10px] text-faint mb-2">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />
          const active = days.has(key(day))
          return (
            <div
              key={i}
              className={`aspect-square rounded-md border grid place-items-center text-[11px] ${
                active
                  ? 'bg-brand/15 border-brand/50 text-brand font-medium'
                  : 'border-border text-faint'
              }`}
              title={active ? 'Sessão registrada' : undefined}
            >
              {day}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
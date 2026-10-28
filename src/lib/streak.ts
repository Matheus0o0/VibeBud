import type { Session } from './types'

const dayKey = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const todayKey = () => dayKey(new Date().toISOString())

const prevKey = (key: string, days = 1) => {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() - days)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

export const sessionDays = (sessions: Session[]): Set<string> => {
  const days = new Set<string>()
  for (const s of sessions) {
    if (!s.endedAt || s.durationSec < 60) continue
    days.add(dayKey(s.startedAt))
  }
  return days
}

export const currentStreak = (sessions: Session[]): number => {
  const days = sessionDays(sessions)
  const today = todayKey()
  const yesterday = prevKey(today)
  let anchor = days.has(today) ? today : days.has(yesterday) ? yesterday : null
  if (!anchor) return 0
  let count = 0
  while (days.has(anchor)) {
    count += 1
    anchor = prevKey(anchor)
  }
  return count
}

export const bestStreak = (sessions: Session[]): number => {
  const days = Array.from(sessionDays(sessions)).sort()
  if (days.length === 0) return 0
  let best = 1, run = 1
  for (let i = 1; i < days.length; i++) {
    if (prevKey(days[i]) === days[i - 1]) run += 1
    else run = 1
    if (run > best) best = run
  }
  return best
}

export const last7Days = (sessions: Session[]): { key: string; active: boolean; isToday: boolean }[] => {
  const days = sessionDays(sessions)
  const today = todayKey()
  const out: { key: string; active: boolean; isToday: boolean }[] = []
  let k = today
  for (let i = 0; i < 7; i++) {
    out.unshift({ key: k, active: days.has(k), isToday: k === today })
    k = prevKey(k)
  }
  return out
}

if (import.meta.env.DEV && typeof window !== 'undefined' && !(window as any).__streakChecked) {
  ;(window as any).__streakChecked = true
  const mk = (daysAgo: number): Session => {
    const d = new Date(); d.setDate(d.getDate() - daysAgo)
    return { id: String(daysAgo), projectId: 'p', startedAt: d.toISOString(), endedAt: d.toISOString(), durationSec: 1500 }
  }
  console.assert(currentStreak([]) === 0, 'empty streak')
  console.assert(currentStreak([mk(0), mk(1), mk(2)]) === 3, '3-day streak')
  console.assert(currentStreak([mk(1), mk(2)]) === 2, 'yesterday-anchored streak')
  console.assert(currentStreak([mk(3), mk(4)]) === 0, 'broken streak')
  console.assert(bestStreak([mk(5), mk(6), mk(7), mk(0)]) === 3, 'best streak')
}

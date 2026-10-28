import { Flame, Trophy } from 'lucide-react'

type Props = {
  current: number
  best: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showBest?: boolean
}

export default function StreakIndicator({ current, best, label = 'Sequência', size = 'md', showBest = true }: Props) {
  const sizeClasses = {
    sm: { icon: 11, label: 'text-[9px]', value: 'text-lg', suffix: 'text-[9px]', gap: 'gap-1' },
    md: { icon: 14, label: 'text-[10px]', value: 'text-2xl', suffix: 'text-[11px]', gap: 'gap-1.5' },
    lg: { icon: 18, label: 'text-[11px]', value: 'text-3xl', suffix: 'text-[12px]', gap: 'gap-2' },
  }

  const s = sizeClasses[size]

  return (
    <div className="flex flex-col items-center text-center">
      <div className={`flex items-center ${s.gap} uppercase tracking-wide ${s.label}`}>
        <Flame size={s.icon} className="text-brand" />
        <span>{label}</span>
      </div>
      <div className={`flex items-baseline ${s.gap} mt-1`}>
        <span className={`${s.value} font-semibold tabular-nums text-brand`}>{current}</span>
        <span className={`${s.suffix} text-faint`}>{current === 1 ? 'dia' : 'dias'}</span>
      </div>
      {showBest && best > 0 && (
        <div className={`flex items-center gap-1 mt-2 ${s.label}`}>
          <Trophy size={s.icon} className="text-dim" />
          <span>Melhor: {best} dia{best !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  )
}
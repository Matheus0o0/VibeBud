import type { ReactNode } from 'react'
import ProgressRing from './ProgressRing'

type Props = {
  elapsed: number
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onEnd: () => void
  showProgressRing?: boolean
  size?: number
  children?: ReactNode
}

const fmt = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function SessionTimer({
  elapsed,
  isRunning,
  onStart,
  onPause,
  onResume,
  onEnd,
  showProgressRing = true,
  size = 192,
  children
}: Props) {
  const minuteProgress = (elapsed % 60) / 60 * 100

  return (
    <div className="flex flex-col items-center">
      {showProgressRing && (
        <div className="relative w-full" style={{ maxWidth: size }}>
          <ProgressRing value={minuteProgress} size={size} showGlow={isRunning} />
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-semibold text-fg tabular-nums font-mono">{fmt(elapsed)}</div>
              <div className="text-[10px] text-faint uppercase tracking-wide mt-1">
                {isRunning ? 'em foco' : elapsed > 0 ? 'pausado' : 'pronto'}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showProgressRing && (
        <div className="text-center mb-4">
          <div className="text-4xl lg:text-5xl font-semibold text-fg tabular-nums font-mono">{fmt(elapsed)}</div>
          <div className="text-[10px] text-faint uppercase tracking-wide mt-1">
            {isRunning ? 'em foco' : elapsed > 0 ? 'pausado' : 'pronto'}
          </div>
        </div>
      )}

      <div className="mt-4 text-[11px] text-dim uppercase tracking-wide">Tempo de foco</div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={isRunning ? onPause : elapsed === 0 ? onStart : onResume}
          className="flex-1 h-12 text-base rounded-lg bg-brand text-[#0A0A0A] font-medium flex items-center justify-center gap-2 hover:bg-brand-hover transition-colors"
          disabled={false}
        >
          {isRunning ? 'Pausar' : elapsed === 0 ? 'Iniciar sessão' : 'Retomar'}
        </button>
        <button
          type="button"
          onClick={onEnd}
          disabled={elapsed === 0}
          className="h-12 px-6 rounded-lg bg-elevated border border-border text-fg font-medium flex items-center justify-center gap-2 hover:bg-hover hover:border-border-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Encerrar
        </button>
      </div>

      {children && <div className="mt-4 w-full">{children}</div>}
    </div>
  )
}
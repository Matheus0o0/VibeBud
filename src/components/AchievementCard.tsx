import type { ReactNode } from 'react'

type Props = {
  icon: ReactNode
  label: string
  description?: string
  unlocked: boolean
  progress?: number
  onClick?: () => void
}

export default function AchievementCard({ icon, label, description, unlocked, progress, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!unlocked && !onClick}
      className={`relative group flex flex-col p-5 rounded-lg border transition-all duration-200 ${
        unlocked
          ? 'bg-brand/10 border-brand/30 text-fg hover:bg-brand/15 hover:border-brand/50 cursor-pointer'
          : 'bg-elevated border-border text-faint cursor-default'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg grid place-items-center text-2xl ${unlocked ? 'bg-brand/20' : 'bg-border/50'}`}>
          {icon}
        </div>
        {progress !== undefined && !unlocked && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full border-3 border-border border-t-brand/30" style={{ '--progress': `${progress}` } as React.CSSProperties}>
            <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90 transform">
              <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="100.53"
                strokeDashoffset={`${100.53 - (progress / 100) * 100.53}`}
                className="text-brand/30 transition-all duration-500"
                style={{ strokeDasharray: '100.53', strokeDashoffset: `${100.53 - (progress / 100) * 100.53}` }}
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[10px] font-semibold text-dim">{Math.round(progress)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex-1">
        <h4 className={`font-semibold ${unlocked ? 'text-fg' : 'text-dim'}`}>{label}</h4>
        {description && <p className="text-xs text-faint mt-1 line-clamp-2">{description}</p>}
      </div>
      {!unlocked && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-dim/20 text-dim">
            Bloqueado
          </span>
        </div>
      )}
    </button>
  )
}
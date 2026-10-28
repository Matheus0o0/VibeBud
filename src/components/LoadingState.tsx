import type { ReactNode } from 'react'

type Props = {
  isLoading: boolean
  children: ReactNode
  skeleton?: ReactNode
  overlay?: boolean
}

export default function LoadingState({ isLoading, children, skeleton, overlay = false }: Props) {
  if (!isLoading) return <>{children}</>

  if (overlay) {
    return (
      <div className="relative min-h-[200px]">
        <div className="absolute inset-0 bg-card/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-center p-6">
            <div className="w-10 h-10 border-3 border-border border-t-brand rounded-full animate-spin" />
            <span className="text-sm text-muted">Carregando...</span>
          </div>
        </div>
        <div className="relative" aria-hidden>{children}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center py-12" role="status" aria-live="polite">
      <div className="w-10 h-10 border-3 border-border border-t-brand rounded-full animate-spin" />
      <span className="text-sm text-muted">Carregando...</span>
      {skeleton && <div className="w-full">{skeleton}</div>}
    </div>
  )
}

export function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-elevated border border-border rounded-lg animate-pulse ${className}`}
      style={{ background: 'linear-gradient(90deg, var(--color-elevated) 25%, var(--color-hover) 50%, var(--color-elevated) 75%)', backgroundSize: '200% 100%', ...style }}
    />
  )
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 rounded" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-[12px] p-5 ${className}`}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <SkeletonText lines={3} />
    </div>
  )
}

type Props = { value: number; className?: string }

export default function ProgressBar({ value, className = '' }: Props) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={`relative h-1.5 bg-elevated rounded-full overflow-hidden ${className}`}>
      <div
        className="absolute inset-y-0 left-0 bg-brand rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, boxShadow: pct > 0 ? '0 0 12px rgba(255,121,0,0.6)' : undefined }}
      />
    </div>
  )
}

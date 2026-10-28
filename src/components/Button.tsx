import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  loading?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-[8px] px-4 h-10 text-sm transition-all duration-150 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-[#0A0A0A] hover:bg-brand-hover shadow-[0_0_0_1px_rgba(255,121,0,0.3)] hover:shadow-[0_0_24px_-4px_rgba(255,121,0,0.5)]',
  secondary:
    'bg-elevated text-fg border border-border hover:border-border-hover hover:bg-hover',
  ghost:
    'bg-transparent text-muted hover:text-fg hover:bg-hover',
  danger:
    'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
}

export default function Button({ variant = 'primary', loading, className = '', children, disabled, ...rest }: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? <span className="inline-block w-3 h-3 border-2 border-current border-r-transparent rounded-full animate-spin" /> : children}
    </button>
  )
}

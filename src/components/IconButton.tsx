import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  'aria-label'?: string
  variant?: 'default' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function IconButton({
  children,
  'aria-label': ariaLabel,
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  ...rest
}: Props) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const variantClasses = {
    default: 'bg-elevated border border-border hover:bg-hover hover:border-border-hover text-fg',
    ghost: 'bg-transparent hover:bg-hover text-dim hover:text-fg',
    danger: 'bg-danger/15 border border-danger/30 hover:bg-danger/25 hover:border-danger/50 text-danger',
  }

  return (
    <button
      {...rest}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center rounded-lg transition-all duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
      `}
    >
      {children}
    </button>
  )
}
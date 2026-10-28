import type { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  elevated?: boolean
  interactive?: boolean
}

export default function Card({ children, className = '', elevated, interactive, ...rest }: Props) {
  const bg = elevated ? 'bg-elevated' : 'bg-card'
  const hover = interactive ? 'hover:border-border-hover transition-colors cursor-pointer' : ''
  return (
    <div {...rest} className={`${bg} border border-border rounded-[12px] ${hover} ${className}`}>
      {children}
    </div>
  )
}

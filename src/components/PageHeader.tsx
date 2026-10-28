import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: Props) {
  return (
    <header className="flex items-start justify-between gap-6 mb-6">
      <div>
        <h1 className="text-2xl lg:text-[28px] font-semibold text-fg leading-tight">{title}</h1>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  )
}

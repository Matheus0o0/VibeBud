import type { ReactNode } from 'react'
import Button from './Button'
import BuddyCharacter from './BuddyCharacter'

type Props = {
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  buddyMood?: 'neutral' | 'encouraging' | 'thinking' | 'returning'
  icon?: ReactNode
}

export default function EmptyState({
  title,
  description,
  action,
  buddyMood = 'encouraging',
  icon,
}: Props) {
  return (
    <div className="max-w-xl mx-auto text-center py-12 lg:py-20">
      <div className="mb-6">
        <BuddyCharacter mood={buddyMood} size={120} />
      </div>
      <h2 className="text-xl lg:text-2xl font-semibold text-fg">{title}</h2>
      {description && <p className="text-sm text-muted mt-2">{description}</p>}
      {icon && <div className="mt-4 text-brand">{icon}</div>}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  )
}
import { Trash2, Check } from 'lucide-react'
import type { Task } from '../lib/types'

type Props = {
  task: Task
  onToggle: () => void
  onRemove: () => void
  onEdit: (title: string) => void
  isEditing?: boolean
}

export default function TaskItem({ task, onToggle, onRemove, onEdit, isEditing = false }: Props) {
  return (
    <div className="flex items-center gap-2 group">
      <button
        type="button"
        onClick={onToggle}
        className={`w-4 h-4 rounded border grid place-items-center shrink-0 transition-colors ${
          task.done ? 'bg-brand border-brand text-[#0A0A0A]' : 'border-border-hover hover:border-brand/60'
        }`}
        aria-label={task.done ? 'Desmarcar' : 'Marcar como concluída'}
      >
        {task.done && <Check size={10} strokeWidth={3} />}
      </button>
      <input
        defaultValue={task.title}
        onBlur={(e) => {
          if (e.target.value !== task.title && e.target.value.trim()) onEdit(e.target.value.trim())
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
        }}
        className={`flex-1 bg-transparent text-sm outline-none ${task.done ? 'line-through text-dim' : 'text-fg'}`}
        disabled={isEditing}
      />
      <button
        type="button"
        onClick={onRemove}
        className="text-faint hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Remover tarefa"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
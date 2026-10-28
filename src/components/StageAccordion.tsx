import { ChevronRight, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '../lib/store'
import TaskItem from './TaskItem'
import type { Stage, Project } from '../lib/types'

type Props = {
  stage: Stage
  index: number
  project: Project
  isCurrent?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function StageAccordion({
  stage,
  index,
  project,
  isCurrent = false,
  defaultOpen = false,
  onOpenChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [addingTask, setAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(stage.title)

  const removeStage = useStore((s) => s.removeStage)
  const updateStage = useStore((s) => s.updateStage)
  const addTask = useStore((s) => s.addTask)
  const toggleTask = useStore((s) => s.toggleTask)
  const updateTask = useStore((s) => s.updateTask)
  const removeTask = useStore((s) => s.removeTask)

  const sp = { done: stage.tasks.filter((t) => t.done).length, total: stage.tasks.length }
  const complete = sp.total > 0 && sp.done === sp.total

  const handleTitleBlur = () => {
    if (editingTitle && titleInput.trim() && titleInput !== stage.title) {
      updateStage(project.id, stage.id, { title: titleInput.trim() })
    }
    setEditingTitle(false)
  }

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(project.id, stage.id, newTaskTitle.trim())
      setNewTaskTitle('')
      setAddingTask(false)
    }
  }

  const handleRemoveStage = () => {
    removeStage(project.id, stage.id)
    onOpenChange?.(false)
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const next = !isOpen
          setIsOpen(next)
          onOpenChange?.(next)
        }}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-hover/40 transition-colors group"
      >
        <StageBadge n={index + 1} complete={complete} current={isCurrent} />
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur()
                if (e.key === 'Escape') { setTitleInput(stage.title); setEditingTitle(false) }
              }}
              autoFocus
              className="w-full bg-transparent text-sm font-medium text-fg outline-none"
            />
          ) : (
            <span
              onClick={() => setEditingTitle(true)}
              className="w-full block text-sm font-medium text-fg truncate cursor-text hover:text-brand transition-colors"
            >
              {stage.title}
            </span>
          )}
        </div>
        <div className="text-xs text-dim tabular-nums shrink-0">
          {sp.total === 0 ? '0 tarefas' : `${sp.done}/${sp.total} tarefas`}
        </div>
        <ChevronRight
          size={16}
          className={`text-faint transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-4 pl-[72px] bg-surface/40 space-y-1.5">
          {stage.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => toggleTask(project.id, stage.id, task.id)}
              onEdit={(title) => updateTask(project.id, stage.id, task.id, { title })}
              onRemove={() => removeTask(project.id, stage.id, task.id)}
            />
          ))}
          {addingTask ? (
            <div className="flex items-center gap-2 pt-1">
              <Plus size={13} className="text-faint" />
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask()
                  if (e.key === 'Escape') setAddingTask(false)
                }}
                onBlur={handleAddTask}
                autoFocus
                placeholder="Nova tarefa (Enter pra adicionar)"
                className="flex-1 bg-transparent text-sm text-fg placeholder:text-faint outline-none"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingTask(true)}
              className="flex items-center gap-2 text-sm text-faint hover:text-brand pt-2"
            >
              <Plus size={13} /> Adicionar tarefa
            </button>
          )}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleRemoveStage}
              className="text-[11px] text-faint hover:text-danger inline-flex items-center gap-1"
            >
              <Trash2 size={11} /> Remover etapa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function StageBadge({ n, complete, current }: { n: number; complete?: boolean; current?: boolean }) {
  const base = 'w-9 h-9 rounded-full grid place-items-center text-sm font-semibold shrink-0 border transition-colors'
  if (complete) return <div className={`${base} bg-success/15 border-success/40 text-success`}>{n}</div>
  if (current) return <div className={`${base} bg-brand border-brand text-[#0A0A0A] shadow-[0_0_12px_rgba(255,121,0,0.4)]`}>{n}</div>
  return <div className={`${base} bg-elevated border-border text-dim`}>{n}</div>
}
import { ChevronRight, Clock, Flag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'
import ProgressBar from './ProgressBar'
import type { Project } from '../lib/types'

type Props = {
  project: Project
  onClick?: () => void
}

export default function ProjectCard({ project, onClick }: Props) {
  const nav = useNavigate()
  const tasks = project.stages.flatMap((s) => s.tasks)
  const done = tasks.filter((t) => t.done).length
  const total = tasks.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  const handleClick = () => {
    if (onClick) onClick()
    else nav('/planning')
  }

  return (
    <Card
      onClick={handleClick}
      className="relative p-5 transition-all duration-200 hover:border-brand/30 hover:bg-elevated/50 cursor-pointer group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-xl bg-brand/15 border border-brand/30 grid place-items-center shrink-0">
          <div className="w-5 h-5 rounded bg-brand" />
        </div>
        {project.deadline && (
          <div className="flex items-center gap-1 text-[10px] text-faint shrink-0">
            <Flag size={10} />
            <span>{new Date(project.deadline).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      <h3 className="text-base font-semibold text-fg mt-4 truncate">{project.name}</h3>
      {project.description && (
        <p className="text-sm text-muted mt-1 line-clamp-2">{project.description}</p>
      )}

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-dim">{done} de {total} tarefas</span>
          <span className="text-brand font-medium tabular-nums">{pct}%</span>
        </div>
        <ProgressBar value={pct} className="h-1.5" />

        <div className="flex items-center gap-2 text-xs text-faint">
          <Clock size={10} />
          <span>{project.stages.length} etapa{project.stages.length !== 1 ? 's' : ''}</span>
          {project.goal && (
            <>
              <span className="w-px h-3 bg-border"></span>
              <span className="truncate max-w-[150px]">{project.goal}</span>
            </>
          )}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-4 right-4 bg-brand text-[#0A0A0A] px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 shadow-lg">
          Continuar <ChevronRight size={14} />
        </div>
      </div>
    </Card>
  )
}
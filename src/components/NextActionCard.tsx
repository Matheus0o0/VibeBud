import { ArrowRight, Clock, ArrowUpRight } from 'lucide-react'
import Button from './Button'
import type { Task, Stage, Project } from '../lib/types'

type Props = { project: Project; task: Task; stage: Stage; onStart: () => void }

export default function NextActionCard({ project, task, stage, onStart }: Props) {
  return (
    <section className="next-action bg-card border border-border rounded-xl p-6 lg:p-8 flex flex-col">
      <div className="flex justify-between items-center text-muted"><span className="text-xs font-medium">Próxima ação</span><ArrowUpRight size={15} aria-hidden="true" /></div>
      <div className="text-xs text-dim mt-7">{project.name}</div>
      <h2 className="text-xl lg:text-[23px] font-semibold text-fg mt-2 leading-snug tracking-tight">{task.title}</h2>
      <p className="text-sm text-dim mt-3">{task.description || `Etapa: ${stage.title}`}</p>
      {task.estimateMin && <div className="mt-5 flex items-center gap-2 text-xs text-dim"><Clock size={14} className="text-brand" aria-hidden="true" /> Estimativa: {task.estimateMin} min</div>}
      <div className="mt-auto pt-7"><Button onClick={onStart} className="w-full">Começar agora <ArrowRight size={16} /></Button></div>
    </section>
  )
}

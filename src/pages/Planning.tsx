import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, GitFork as Github, ArrowUpRight } from 'lucide-react'
import Button from '../components/Button'
import PageShell from '../components/PageShell'
import { useStore, selectCurrentProject } from '../lib/store'
import StageAccordion from '../components/StageAccordion'
import EmptyState from '../components/EmptyState'
import ProjectCard from '../components/ProjectCard'

export default function Planning() {
  const nav = useNavigate()
  const project = useStore(selectCurrentProject)
  const addStage = useStore((s) => s.addStage)

  const [addingStage, setAddingStage] = useState(false)

  if (!project) {
    return (
      <EmptyState
        title="Nenhum projeto ativo"
        description="Crie um projeto para começar a planejar."
        action={{ label: 'Criar projeto', onClick: () => nav('/new') }}
        buddyMood="encouraging"
      />
    )
  }

  const totalTasks = project.stages.reduce((a, s) => a + s.tasks.length, 0)
  const doneTasks = project.stages.reduce((a, s) => a + s.tasks.filter((t) => t.done).length, 0)

  // Determine current stage (first incomplete)
  const currentStageIndex = project.stages.findIndex((s) => s.tasks.length > 0 && !s.tasks.every((t) => t.done))
  const currentStageId = currentStageIndex >= 0 ? project.stages[currentStageIndex].id : undefined

  return (
    <PageShell
      actions={
        <>
          <button
            type="button"
            onClick={() => setAddingStage(true)}
            className="w-9 h-9 rounded-lg bg-elevated border border-border grid place-items-center text-dim hover:text-brand hover:border-border-hover transition-colors"
            aria-label="Adicionar etapa"
          >
            <Plus size={16} />
          </button>
          <Button onClick={() => nav('/home')}>Continuar</Button>
        </>
      }
    >
      <div className="mb-6">
        <ProjectCard project={project} />
        <Link to="/github" className="mt-3 flex flex-wrap items-center gap-2 text-xs text-dim hover:text-brand"><Github size={14} />{project.github ? project.github.fullName : 'Vincular repositório do GitHub'}<ArrowUpRight size={13} /></Link>
      </div>

      <div className="bg-card border border-border rounded-[12px] overflow-hidden divide-y divide-border">
        {project.stages.map((stage, i) => (
          <StageAccordion
            key={stage.id}
            stage={stage}
            index={i}
            project={project}
            isCurrent={stage.id === currentStageId}
            defaultOpen={stage.id === currentStageId}
          />
        ))}

        {addingStage && (
          <div className="px-5 py-4 bg-surface/40 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full grid place-items-center text-sm font-semibold shrink-0 border bg-elevated border-border text-dim">
              {project.stages.length + 1}
            </div>
            <input
              autoFocus
              placeholder="Nome da etapa (Enter pra salvar)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v) addStage(project.id, v)
                  setAddingStage(false)
                } else if (e.key === 'Escape') {
                  setAddingStage(false)
                }
              }}
              onBlur={(e) => {
                const v = e.target.value.trim()
                if (v) addStage(project.id, v)
                setAddingStage(false)
              }}
              className="flex-1 bg-transparent text-sm font-medium text-fg placeholder:text-faint outline-none"
            />
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-dim">
        Total: {doneTasks}/{totalTasks} tarefas · {project.stages.length} etapas
      </div>
    </PageShell>
  )
}

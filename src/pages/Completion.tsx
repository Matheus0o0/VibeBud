import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, Rocket, ExternalLink } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import BuddyCharacter from '../components/BuddyCharacter'
import { TextField } from '../components/TextField'
import { useStore, selectCurrentProject, selectProgress } from '../lib/store'

export default function Completion() {
  const nav = useNavigate()
  const project = useStore(selectCurrentProject)
  const complete = useStore((s) => s.completeProject)
  const archive = useStore((s) => s.archiveProject)
  const progress = selectProgress(project)
  const [url, setUrl] = useState(project?.publishedUrl ?? '')

  if (!project) {
    nav('/')
    return null
  }

  const done = Boolean(project.completedAt)

  const stagesDone = project.stages.filter((s) => s.tasks.length > 0 && s.tasks.every((t) => t.done)).length

  return (
    <div className="min-h-dvh grid place-items-center bg-bg relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,121,0,0.22) 0%, transparent 60%)' }}
      />
      <div className="relative max-w-xl w-full px-6 py-10 text-center">
        <BuddyCharacter mood="completed" size={220} />
        <h1 className="text-3xl lg:text-4xl font-semibold text-fg mt-6 leading-tight">Você tirou a ideia do papel!</h1>
        <p className="text-muted mt-3 max-w-lg mx-auto">Parabéns por concluir seu projeto. Agora ele está pronto para o próximo passo.</p>

        <Card className="p-6 mt-10 text-left">
          <div className="text-[11px] text-dim uppercase tracking-wide">Projeto</div>
          <div className="text-base font-semibold text-fg mt-1">{project.name}</div>
          <div className="grid grid-cols-3 gap-4 mt-5 text-xs">
            <div className="text-center p-3 bg-elevated/50 rounded-lg border border-border">
              <div className="text-dim">Tarefas</div>
              <div className="text-fg font-medium tabular-nums mt-0.5 text-lg">{progress.done}/{progress.total}</div>
            </div>
            <div className="text-center p-3 bg-elevated/50 rounded-lg border border-border">
              <div className="text-dim">Etapas</div>
              <div className="text-fg font-medium tabular-nums mt-0.5 text-lg">{stagesDone}/{project.stages.length}</div>
            </div>
            <div className="text-center p-3 bg-elevated/50 rounded-lg border border-border">
              <div className="text-dim">Concluído em</div>
              <div className="text-fg font-medium mt-0.5 text-lg">
                {project.completedAt ? new Date(project.completedAt).toLocaleDateString('pt-BR') : '—'}
              </div>
            </div>
          </div>

          {!done && (
            <div className="mt-6">
              <TextField
                label="Link do projeto publicado (opcional)"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                type="url"
              />
            </div>
          )}
        </Card>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {!done ? (
            <Button onClick={() => complete(project.id, url.trim() || undefined)} className="w-full sm:w-auto h-12 text-base">
              <Rocket size={16} /> Marcar como concluído
            </Button>
          ) : (
            <>
              {project.publishedUrl && (
                <a href={project.publishedUrl} target="_blank" rel="noreferrer">
                  <Button variant="secondary" className="w-full sm:w-auto h-11"><ExternalLink size={14} /> Ver projeto</Button>
                </a>
              )}
              <Button variant="secondary" onClick={() => { archive(project.id); nav('/new') }} className="w-full sm:w-auto h-11">
                <Archive size={14} /> Arquivar
              </Button>
              <Button onClick={() => nav('/new')} className="w-full sm:w-auto h-11">Começar novo projeto</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

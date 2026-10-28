import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lightbulb, Check } from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'
import PageShell from '../components/PageShell'
import { TextField, TextArea } from '../components/TextField'
import { useStore, selectCurrentProject } from '../lib/store'

const tips = [
  'Verifique logs e erros com atenção.',
  'Consulte a documentação oficial.',
  'Use o modo de depuração ou prints.',
  'Divida a tarefa em partes menores.',
  'Escreva a dúvida como se fosse pedir ajuda a alguém.',
]

const blockerTypes = [
  { value: 'tecnico' as const, label: 'Técnico', icon: '⚙️' },
  { value: 'documentacao' as const, label: 'Documentação', icon: '📚' },
  { value: 'duvida' as const, label: 'Dúvida', icon: '❓' },
  { value: 'distracao' as const, label: 'Distração', icon: '📱' },
  { value: 'outro' as const, label: 'Outro', icon: '📦' },
]

export default function Blockers() {
  const nav = useNavigate()
  const project = useStore(selectCurrentProject)
  const recordBlocker = useStore((s) => s.recordBlocker)
  const resolveBlocker = useStore((s) => s.resolveBlocker)
  const blockers = useStore((s) => s.blockers.filter((b) => b.projectId === project?.id))

  const [type, setType] = useState<'tecnico' | 'documentacao' | 'duvida' | 'distracao' | 'outro'>('tecnico')
  const [description, setDescription] = useState('')
  const [tried, setTried] = useState('')
  const [nextStep, setNextStep] = useState('')
  const [err, setErr] = useState<Record<string, string>>({})

  if (!project) { nav('/'); return null }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!description.trim()) next.description = 'Descreva o bloqueio.'
    if (!nextStep.trim()) next.nextStep = 'Defina a próxima ação possível, mesmo pequena.'
    setErr(next)
    if (Object.keys(next).length) return

    recordBlocker({
      projectId: project.id,
      type,
      description: description.trim(),
      tried: tried.trim() || undefined,
      nextStep: nextStep.trim(),
    })
    setDescription(''); setTried(''); setNextStep('')
  }

  const open = blockers.filter((b) => !b.resolvedAt)

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl lg:text-[28px] font-semibold text-fg leading-tight">O que está te impedindo?</h1>
        <p className="text-sm text-muted mt-1">Seja específico. Isso ajuda a encontrar o próximo passo.</p>
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <div className="text-xs font-medium text-muted mb-2">Tipo de bloqueio</div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {blockerTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border text-xs font-medium transition-colors ${
                      type === t.value
                        ? 'bg-brand/15 border-brand text-brand'
                        : 'bg-elevated border-border text-muted hover:border-border-hover'
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <TextField
              label="Qual o bloqueio?"
              placeholder="Ex.: Erro na requisição da API."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={err.description}
              autoFocus
            />

            <TextField
              label="O que você já tentou?"
              placeholder="Ex.: Verifiquei o token e as permissões."
              value={tried}
              onChange={(e) => setTried(e.target.value)}
            />

            <TextArea
              label="Qual será sua próxima ação?"
              placeholder="Ex.: Verificar a resposta da API e identificar o código de erro."
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              error={err.nextStep}
              rows={3}
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button variant="ghost" type="button" onClick={() => nav('/home')}>Cancelar</Button>
              <Button type="submit">Salvar e continuar</Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-warning" />
              <h3 className="text-sm font-semibold text-fg">Dicas rápidas</h3>
            </div>
            <ul className="space-y-2.5">
              {tips.map((t) => (
                <li key={t} className="flex gap-2 text-xs text-muted">
                  <span className="text-brand mt-0.5">·</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          {open.length > 0 && (
            <Card className="p-5">
              <div className="text-xs text-dim uppercase tracking-wide mb-3">Bloqueios abertos ({open.length})</div>
              <ul className="space-y-3">
                {open.map((b) => (
                  <li key={b.id} className="border-l-2 border-warning/60 pl-3">
                    <div className="text-sm text-fg">{b.description}</div>
                    {b.nextStep && <div className="text-xs text-muted mt-1">→ {b.nextStep}</div>}
                    <button
                      type="button"
                      onClick={() => resolveBlocker(b.id)}
                      className="text-[11px] text-brand hover:text-brand-hover mt-1.5 inline-flex items-center gap-1"
                    >
                      <Check size={10} /> Resolvido
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  )
}

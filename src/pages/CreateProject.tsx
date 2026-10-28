import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '../components/Button'
import PageShell from '../components/PageShell'
import { TextField, TextArea } from '../components/TextField'
import { useStore } from '../lib/store'
import { suggestCriteriaText } from '../lib/suggestCriteria'

export default function CreateProject() {
  const nav = useNavigate()
  const createProject = useStore((s) => s.createProject)
  const setUserName = useStore((s) => s.setUserName)
  const userName = useStore((s) => s.userName)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')
  const [deadline, setDeadline] = useState('')
  const [criteria, setCriteria] = useState(suggestCriteriaText('', ''))
  const [criteriaDirty, setCriteriaDirty] = useState(false)
  const [displayName, setDisplayName] = useState(userName)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const lastSuggestion = useRef(suggestCriteriaText('', ''))

  useEffect(() => {
    const id = setTimeout(() => {
      const next = suggestCriteriaText(description, goal)
      if (!criteriaDirty || criteria.trim() === '' || criteria === lastSuggestion.current) {
        setCriteria(next)
        setCriteriaDirty(false)
      }
      lastSuggestion.current = next
    }, 350)
    return () => clearTimeout(id)
  }, [description, goal])

  const submit = async () => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Dê um nome ao projeto.'
    if (!goal.trim()) next.goal = 'Descreva o resultado esperado.'
    if (!criteria.trim()) next.criteria = 'Descreva ao menos um critério.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSaving(true)
    try {
      if (displayName.trim()) setUserName(displayName.trim())
      createProject({
        name: name.trim(),
        description: description.trim(),
        goal: goal.trim(),
        criteria: criteria.trim(),
        deadline: deadline || undefined,
      })
      nav('/planning')
    } finally {
      setSaving(false)
    }
  }

  const hasInput = Boolean(description.trim() || goal.trim())

  return (
    <PageShell
      actions={
        <>
          <Link to="/"><Button variant="ghost">Cancelar</Button></Link>
          <Button onClick={submit} loading={saving}>
            Próximo <ArrowRight size={16} />
          </Button>
        </>
      }
    >
      <div className="mb-8">
        <h1 className="text-2xl lg:text-[28px] font-semibold text-fg leading-tight">
          Vamos criar seu projeto!
        </h1>
        <p className="text-sm text-muted mt-1 max-w-xl">
          Defina o que você quer construir e qual será o resultado para considerar a primeira versão pronta.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); submit() }} className="grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-5">
          {!userName && (
            <TextField
              label="Seu nome"
              placeholder="Como podemos te chamar?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}

          <TextField
            label="Nome do projeto"
            placeholder="Ex.: Meu app de tarefas"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoFocus
          />

          <TextArea
            label="O que você quer construir?"
            placeholder="Ex.: Uma aplicação web para lista de tarefas."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          <TextArea
            label="Qual o objetivo?"
            placeholder="Ex.: Ajudar pessoas a organizar suas tarefas do dia."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            error={errors.goal}
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted">Critérios de conclusão</span>
              {!criteriaDirty && hasInput ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-brand bg-brand/10 border border-brand/30 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                  <Sparkles size={10} /> Sugerido
                </span>
              ) : criteriaDirty && hasInput ? (
                <button
                  type="button"
                  onClick={() => { setCriteria(suggestCriteriaText(description, goal)); setCriteriaDirty(false) }}
                  className="text-[11px] text-dim hover:text-brand inline-flex items-center gap-1"
                >
                  <Sparkles size={10} /> Regenerar
                </button>
              ) : null}
            </div>
            <TextArea
              label=""
              value={criteria}
              onChange={(e) => { setCriteria(e.target.value); setCriteriaDirty(true) }}
              placeholder="Ex.: Aplicação publicada, com cadastro, login e funcionalidades principais funcionando."
              rows={8}
              error={errors.criteria}
            />
            {errors.criteria ? (
              <span className="block text-xs text-danger mt-1">{errors.criteria}</span>
            ) : !criteriaDirty && hasInput ? (
              <p className="text-[11px] text-faint mt-1.5">
                Gerado da sua descrição e objetivo. Edite à vontade — suas mudanças ficam preservadas.
              </p>
            ) : null}
          </div>

          <TextField
            label="Prazo (opcional)"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            hint="Selecione uma data"
          />
        </div>
      </form>
    </PageShell>
  )
}

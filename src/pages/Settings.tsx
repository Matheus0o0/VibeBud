import { AlertTriangle, Trash2, GitFork as Github, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import Button from '../components/Button'
import { TextField } from '../components/TextField'
import Toggle from '../components/Toggle'
import Modal from '../components/Modal'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'

export default function Settings() {
  const prefs = useStore((s) => s.preferences)
  const update = useStore((s) => s.updatePreferences)
  const userName = useStore((s) => s.userName)
  const setUserName = useStore((s) => s.setUserName)
  const reset = useStore((s) => s.reset)
  const projects = useStore((s) => s.projects)
  const { addToast } = useToast()

  const [showResetModal, setShowResetModal] = useState(false)

  const exportData = () => {
    const data = useStore.getState()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `vibebud-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    addToast({ type: 'success', title: 'Exportado', message: 'Dados salvos no seu dispositivo.' })
  }

  const handleReset = () => {
    reset()
    setShowResetModal(false)
    addToast({ type: 'success', title: 'Dados apagados', message: 'Todos os dados locais foram removidos.' })
  }

  return (
    <PageShell width="narrow">
      <PageHeader title="Configurações" description="Personalize sua experiência e defina suas preferências." />

      <div className="space-y-5">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-fg flex items-center gap-2"><Github size={17} /> Integração com GitHub</h3>
          <p className="text-sm text-dim mt-2 mb-4">Conecte sua conta e acompanhe commits, pull requests e issues dos repositórios autorizados.</p>
          <Link to="/github" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">Gerenciar conexão <ArrowRight size={14} /></Link>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-fg mb-4">Perfil</h3>
          <TextField
            label="Nome"
            placeholder="Como podemos te chamar?"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-fg mb-4">Lembretes</h3>
          <div className="space-y-4">
            <Toggle
              label="Receber lembretes"
              description="Salve sua preferência de lembrete. O envio de notificações estará disponível em breve."
              checked={prefs.remindersEnabled}
              onChange={(e) => update({ remindersEnabled: e.target.checked })}
            />

            {prefs.remindersEnabled && (
              <TextField
                label="Horário"
                type="time"
                value={prefs.reminderTime}
                onChange={(e) => update({ reminderTime: e.target.value })}
              />
            )}
          </div>
          {prefs.remindersEnabled && (
            <p className="text-[11px] text-faint mt-3 flex items-start gap-1.5">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              Os lembretes ainda não são enviados. Seu horário ficará salvo para quando estiverem disponíveis.
            </p>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-fg mb-4">Preferências visuais</h3>
          <Toggle
            label="Reduzir animações"
            description="Diminui os efeitos de movimento para uma experiência mais tranquila."
            checked={prefs.reduceMotion}
            onChange={(e) => update({ reduceMotion: e.target.checked })}
          />
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-fg mb-4">Dados</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportData}>Exportar JSON</Button>
            <Button variant="danger" onClick={() => setShowResetModal(true)}>
              <Trash2 size={14} /> Apagar tudo
            </Button>
          </div>
          <p className="text-[11px] text-faint mt-3">
            Seus dados são salvos neste navegador. Exporte uma cópia para manter um backup dos seus projetos.
          </p>
        </Card>
      </div>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Apagar todos os dados?"
        description={`Esta ação remove ${projects.length} projeto(s), todas as sessões e bloqueios permanentemente. Não é possível desfazer.`}
      >
        <div className="flex items-center gap-3 p-3 bg-danger/10 border border-danger/30 rounded-lg mb-4">
          <Trash2 size={20} className="text-danger" />
          <div>
            <p className="text-sm font-medium text-fg">Esta ação é irreversível.</p>
            <p className="text-xs text-muted mt-0.5">Seus projetos, sessões, bloqueios e preferências serão perdidos para sempre.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowResetModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleReset}>Apagar tudo</Button>
        </div>
      </Modal>
    </PageShell>
  )
}

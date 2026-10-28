import { BarChart3, Check, Circle, Clock3, FolderKanban, GitFork, Home, ListTodo, Settings, Target, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

const demoNav = [
  { label: 'Início', icon: Home }, { label: 'Meus projetos', icon: FolderKanban },
  { label: 'Próximas ações', icon: ListTodo }, { label: 'Foco', icon: Target },
  { label: 'Progresso', icon: BarChart3 }, { label: 'Integrações', icon: GitFork }, { label: 'Configurações', icon: Settings },
]

export default function LandingPreview() {
  return (
    <figure className="lp-preview" aria-label="Exemplo ilustrativo do painel VibeBud">
      <div className="lp-preview-window">
        <aside className="lp-preview-sidebar" aria-hidden="true">
          <div className="lp-preview-wordmark"><span className="lp-mini-mark" /> VibeBud</div>
          <div className="lp-preview-nav">{demoNav.map(({ label, icon: Icon }, i) => <div key={label} className={i === 0 ? 'selected' : ''}><Icon size={15} />{label}</div>)}</div>
          <span className="lp-preview-sidebar-note">Seu espaço para construir.</span>
        </aside>
        <div className="lp-preview-content">
          <div className="lp-preview-context"><span>Projeto de exemplo</span><span className="lp-demo-status"><span /> Em andamento</span></div>
          <h3>Meu app de receitas</h3>
          <div className="lp-preview-tabs" aria-hidden="true"><span>Visão geral</span><span>Tarefas</span><span>Progresso</span></div>
          <div className="lp-preview-workspace">
            <div className="lp-preview-task"><span className="lp-preview-label"><Target size={14} /> Próxima ação</span><h4>Implementar formulário de cadastro</h4><p>Criar os campos e validar as informações antes de continuar.</p><Link to="/app" className="lp-preview-action">Começar meu projeto <Play size={12} fill="currentColor" /></Link></div>
            <img className="lp-preview-buddy" src="/assets/buddy.png" alt="" width="1254" height="1254" loading="lazy" />
            <div className="lp-preview-progress"><span>Progresso do projeto</span><strong>3 de 8 tarefas</strong><div className="lp-demo-track"><span /></div><small><i /> 3 concluídas</small><small><i /> 5 próximos passos</small></div>
          </div>
          <div className="lp-preview-tasks"><div className="lp-preview-task-heading"><span>Tarefas do projeto</span><Clock3 size={13} /></div>{['Definir o escopo da primeira versão', 'Criar a estrutura inicial', 'Implementar formulário de cadastro'].map((title, i) => <div key={title} className="lp-preview-task-row">{i < 2 ? <Check size={15} className="lp-task-done" /> : <Circle size={15} />}<span>{title}</span><small>{i < 2 ? 'Concluída' : 'Próximo passo'}</small></div>)}</div>
        </div>
      </div>
      <figcaption>Prévia ilustrativa · organize o seu projeto do seu jeito.</figcaption>
    </figure>
  )
}

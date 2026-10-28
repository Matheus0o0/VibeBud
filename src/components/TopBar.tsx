import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useStore, selectCurrentProject } from '../lib/store'
import Brand from './Brand'

const labels: Record<string, string> = { '/home': 'Início', '/planning': 'Projetos', '/progress': 'Progresso', '/buddy': 'Seu Buddy', '/settings': 'Configurações', '/blockers': 'Registrar bloqueio' }

export default function TopBar() {
  const userName = useStore((s) => s.userName)
  const project = useStore(selectCurrentProject)
  const { pathname } = useLocation()
  return (
    <div className="top-bar flex items-center justify-between gap-3">
      <div className="md:hidden"><Brand /></div>
      <div className="hidden md:flex items-center gap-2 text-xs text-dim">
        <span>Seu espaço</span><ChevronRight size={12} aria-hidden="true" />
        <span className="text-muted">{labels[pathname] ?? project?.name ?? 'VibeBud'}</span>
      </div>
      <Link to="/settings" aria-label="Abrir meu perfil" className="w-9 h-9 rounded-full bg-elevated border border-border hover:border-brand/50 grid place-items-center text-xs text-muted font-medium transition-colors">
        {(userName || 'B').charAt(0).toUpperCase()}
      </Link>
    </div>
  )
}

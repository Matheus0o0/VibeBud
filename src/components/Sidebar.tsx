import { NavLink } from 'react-router-dom'
import { Home, FolderKanban, BarChart3, Settings as SettingsIcon, Bot, ChevronUp, GitFork as Github } from 'lucide-react'
import Brand from './Brand'
import { useStore } from '../lib/store'

const items = [
  { to: '/home', label: 'Início', icon: Home },
  { to: '/planning', label: 'Projetos', icon: FolderKanban },
  { to: '/progress', label: 'Progresso', icon: BarChart3 },
  { to: '/github', label: 'GitHub', icon: Github },
  { to: '/buddy', label: 'Seu Buddy', icon: Bot },
  { to: '/settings', label: 'Configurações', icon: SettingsIcon },
]

export default function Sidebar() {
  const userName = useStore((s) => s.userName)
  return (
    <aside className="app-sidebar hidden md:flex flex-col shrink-0 border-r border-border bg-surface">
      <div className="sidebar-brand"><Brand /></div>

      <nav className="flex-1 px-3 flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/home'}
            className={({ isActive }) =>
              `sidebar-link relative flex items-center gap-3 px-3 h-11 rounded-[7px] text-[13px] transition-colors ${
                isActive
                  ? 'is-active bg-elevated text-fg'
                  : 'text-dim hover:text-fg hover:bg-hover/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} strokeWidth={isActive ? 2.25 : 2} className={isActive ? 'text-brand' : ''} />
                <span className={`sidebar-label ${isActive ? 'font-medium' : ''}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <NavLink to="/settings" className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-hover transition-colors" aria-label="Editar perfil">
          <div className="w-8 h-8 rounded-full bg-brand/15 border border-brand/40 grid place-items-center text-xs text-brand font-medium">
            {(userName || 'B').charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-label min-w-0 flex-1">
            <div className="text-[13px] font-medium text-fg truncate leading-tight">{userName || 'Convidado'}</div>
            <div className="text-[11px] text-dim leading-tight mt-1">Seu espaço de foco</div>
          </div>
          <ChevronUp size={14} className="sidebar-label text-dim" />
        </NavLink>
      </div>
    </aside>
  )
}

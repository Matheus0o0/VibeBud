import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, FolderKanban, BarChart3, Settings as SettingsIcon, Bot } from 'lucide-react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const mobileItems = [
  { to: '/home', label: 'Início', icon: Home },
  { to: '/planning', label: 'Projeto', icon: FolderKanban },
  { to: '/progress', label: 'Progresso', icon: BarChart3 },
  { to: '/buddy', label: 'Buddy', icon: Bot },
  { to: '/settings', label: 'Config.', icon: SettingsIcon },
]

export default function AppLayout() {
  const { pathname } = useLocation()
  const isFocus = pathname.startsWith('/session') || pathname === '/return' || pathname === '/completion'
  const hideTopBar = isFocus || pathname === '/new'
  return (
    <div className="flex h-dvh bg-bg overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div className="app-content flex-1 min-h-0 flex flex-col overflow-y-auto">
          {!hideTopBar && <TopBar />}
          <div className="flex-1 min-h-0 flex flex-col">
            <Outlet />
          </div>
        </div>
        <nav aria-label="Navegação principal" className="mobile-nav md:hidden shrink-0 border-t border-border bg-surface/95 backdrop-blur grid grid-cols-5">
          {mobileItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-2 text-[10px] ${isActive ? 'text-brand' : 'text-dim'}`
            }>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  )
}

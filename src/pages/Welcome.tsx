import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Button from '../components/Button'
import BuddyScene from '../components/BuddyScene'
import Sidebar from '../components/Sidebar'
import Brand from '../components/Brand'
import { useStore, selectCurrentProject } from '../lib/store'

export default function Welcome() {
  const nav = useNavigate()
  const current = useStore(selectCurrentProject)
  return (
    <div className="welcome-layout flex min-h-dvh bg-bg">
      <Sidebar />
      <div className="welcome-main flex-1 min-w-0 relative overflow-hidden">
        <header className="md:hidden p-6"><Brand /></header>
        <main className="welcome-hero">
          <div className="welcome-copy">
            <span className="eyebrow"><span className="status-dot" /> Uma ideia. Um próximo passo.</span>
            <h1>Vamos tirar<br />esse projeto<br /><span className="text-brand">do papel.</span></h1>
            <p>Um passo de cada vez. Seu próximo<br className="hidden sm:block" /> projeto merece chegar ao fim.</p>
            <Button onClick={() => nav('/new')} className="welcome-cta">Começar meu projeto <ArrowRight size={17} /></Button>
            {current && <Link to="/home" className="block mt-5 text-sm text-muted hover:text-brand">Continuar “{current.name}” →</Link>}
          </div>
          <div className="welcome-art"><BuddyScene scene="desk" mood="working" size={520} /></div>
        </main>
        <footer className="welcome-footer"><span className="status-dot" /> Seu próximo passo, mais perto.</footer>
      </div>
    </div>
  )
}

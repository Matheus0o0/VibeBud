import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './lib/store'
import AppLayout from './components/AppLayout'
import Welcome from './pages/Welcome'
import Landing from './pages/Landing'
import CreateProject from './pages/CreateProject'
import Planning from './pages/Planning'
import Home from './pages/Home'
import Session from './pages/Session'
import SessionEnd from './pages/SessionEnd'
import Blockers from './pages/Blockers'
import Progress from './pages/Progress'
import BuddyPage from './pages/Buddy'
import ReturnPause from './pages/ReturnPause'
import Completion from './pages/Completion'
import Settings from './pages/Settings'
import GitHubPage from './pages/GitHub'
import { ToastProvider } from './components/Toast'

const AWAY_DAYS = 2

export default function App() {
  const hydrate = useStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [hydrate])
  const reduceMotion = useStore((s) => s.preferences.reduceMotion)
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion)
    return () => document.documentElement.classList.remove('reduce-motion')
  }, [reduceMotion])
  const hasProject = useStore((s) => s.projects.length > 0)
  const sessions = useStore((s) => s.sessions)

  const landing = (() => {
    if (!hasProject) return <Welcome />
    const last = sessions.map((s) => s.endedAt || s.startedAt).sort().at(-1)
    if (!last) return <Navigate to="/home" replace />
    const daysSince = (Date.now() - new Date(last).getTime()) / 86400000
    return daysSince >= AWAY_DAYS ? <Navigate to="/return" replace /> : <Navigate to="/home" replace />
  })()

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={landing} />
        <Route path="/welcome" element={<Welcome />} />
        <Route element={<AppLayout />}>
          <Route path="/new" element={<CreateProject />} />
          <Route path="/home" element={<Home />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/session" element={<Session />} />
          <Route path="/session/end" element={<SessionEnd />} />
          <Route path="/blockers" element={<Blockers />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/buddy" element={<BuddyPage />} />
          <Route path="/return" element={<ReturnPause />} />
          <Route path="/completion" element={<Completion />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/github" element={<GitHubPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}

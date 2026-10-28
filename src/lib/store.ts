import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Stage, Task, Session, Blocker, Preferences, BuddyMood, SessionResult } from './types'

const uid = () => (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`)

type ActiveSession = {
  projectId: string
  taskId?: string
  startedAt: string
  elapsedBeforePause: number
  running: boolean
  lastResumeAt: string
}

type State = {
  userName: string
  projects: Project[]
  currentProjectId?: string
  sessions: Session[]
  blockers: Blocker[]
  preferences: Preferences
  buddyMood: BuddyMood
  active?: ActiveSession
  hydrated: boolean
}

type Actions = {
  hydrate: () => void
  setUserName: (name: string) => void
  createProject: (input: {
    name: string; description: string; goal: string; criteria: string; deadline?: string
  }) => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  setCurrentProject: (id: string) => void
  addStage: (projectId: string, title: string) => Stage
  updateStage: (projectId: string, stageId: string, patch: Partial<Stage>) => void
  removeStage: (projectId: string, stageId: string) => void
  addTask: (projectId: string, stageId: string, title: string) => Task
  updateTask: (projectId: string, stageId: string, taskId: string, patch: Partial<Task>) => void
  toggleTask: (projectId: string, stageId: string, taskId: string) => void
  removeTask: (projectId: string, stageId: string, taskId: string) => void
  startSession: (projectId: string, taskId?: string) => void
  pauseSession: () => void
  resumeSession: () => void
  endSession: (opts: { note?: string; result?: SessionResult; taskId?: string }) => Session | null
  recordBlocker: (b: Omit<Blocker, 'id' | 'createdAt'>) => Blocker
  resolveBlocker: (id: string) => void
  setBuddyMood: (m: BuddyMood) => void
  updatePreferences: (p: Partial<Preferences>) => void
  completeProject: (id: string, publishedUrl?: string) => void
  archiveProject: (id: string) => void
  reset: () => void
}

const defaultPrefs: Preferences = { remindersEnabled: false, reminderTime: '09:00', reduceMotion: false }

const nowIso = () => new Date().toISOString()

const seedStages = (projectId: string): Stage[] => ([
  { id: uid(), projectId, order: 0, title: 'Definir o escopo da primeira versão', tasks: [] },
  { id: uid(), projectId, order: 1, title: 'Criar a estrutura inicial da aplicação', tasks: [] },
  { id: uid(), projectId, order: 2, title: 'Implementar a funcionalidade principal', tasks: [] },
  { id: uid(), projectId, order: 3, title: 'Integrar os serviços necessários', tasks: [] },
  { id: uid(), projectId, order: 4, title: 'Verificar os fluxos essenciais', tasks: [] },
  { id: uid(), projectId, order: 5, title: 'Publicar a aplicação', tasks: [] },
])

export const useStore = create<State & Actions>()(persist((set, get) => ({
  userName: '',
  projects: [],
  currentProjectId: undefined,
  sessions: [],
  blockers: [],
  preferences: defaultPrefs,
  buddyMood: 'neutral',
  active: undefined,
  hydrated: false,

  hydrate: () => set({ hydrated: true }),

  setUserName: (name) => set({ userName: name }),

  createProject: ({ name, description, goal, criteria, deadline }) => {
    const id = uid()
    const project: Project = {
      id, name, description, goal, criteria, deadline,
      stages: seedStages(id),
      createdAt: nowIso(), archived: false,
    }
    set((s) => ({ projects: [...s.projects, project], currentProjectId: id }))
    return project
  },

  updateProject: (id, patch) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, ...patch } : p)
  })),

  setCurrentProject: (id) => set({ currentProjectId: id }),

  addStage: (projectId, title) => {
    const stage: Stage = { id: uid(), projectId, order: 0, title, tasks: [] }
    set((s) => ({
      projects: s.projects.map((p) => {
        if (p.id !== projectId) return p
        const order = p.stages.length
        return { ...p, stages: [...p.stages, { ...stage, order }] }
      })
    }))
    return stage
  },

  updateStage: (projectId, stageId, patch) => set((s) => ({
    projects: s.projects.map((p) => p.id === projectId ? {
      ...p, stages: p.stages.map((st) => st.id === stageId ? { ...st, ...patch } : st)
    } : p)
  })),

  removeStage: (projectId, stageId) => set((s) => ({
    projects: s.projects.map((p) => p.id === projectId ? {
      ...p, stages: p.stages.filter((st) => st.id !== stageId)
    } : p)
  })),

  addTask: (projectId, stageId, title) => {
    const task: Task = { id: uid(), stageId, title, done: false, createdAt: nowIso() }
    set((s) => ({
      projects: s.projects.map((p) => p.id === projectId ? {
        ...p, stages: p.stages.map((st) => st.id === stageId ? { ...st, tasks: [...st.tasks, task] } : st)
      } : p)
    }))
    return task
  },

  updateTask: (projectId, stageId, taskId, patch) => set((s) => ({
    projects: s.projects.map((p) => p.id === projectId ? {
      ...p, stages: p.stages.map((st) => st.id === stageId ? {
        ...st, tasks: st.tasks.map((t) => t.id === taskId ? { ...t, ...patch } : t)
      } : st)
    } : p)
  })),

  toggleTask: (projectId, stageId, taskId) => {
    const now = nowIso()
    set((s) => ({
      projects: s.projects.map((p) => p.id === projectId ? {
        ...p, stages: p.stages.map((st) => st.id === stageId ? {
          ...st, tasks: st.tasks.map((t) => t.id === taskId ? {
            ...t, done: !t.done, completedAt: !t.done ? now : undefined
          } : t)
        } : st)
      } : p)
    }))
  },

  removeTask: (projectId, stageId, taskId) => set((s) => ({
    projects: s.projects.map((p) => p.id === projectId ? {
      ...p, stages: p.stages.map((st) => st.id === stageId ? {
        ...st, tasks: st.tasks.filter((t) => t.id !== taskId)
      } : st)
    } : p)
  })),

  startSession: (projectId, taskId) => set({
    active: { projectId, taskId, startedAt: nowIso(), elapsedBeforePause: 0, running: true, lastResumeAt: nowIso() },
    buddyMood: 'working',
  }),

  pauseSession: () => set((s) => {
    if (!s.active || !s.active.running) return {}
    const delta = Math.floor((Date.now() - new Date(s.active.lastResumeAt).getTime()) / 1000)
    return { active: { ...s.active, running: false, elapsedBeforePause: s.active.elapsedBeforePause + delta } }
  }),

  resumeSession: () => set((s) => {
    if (!s.active || s.active.running) return {}
    return { active: { ...s.active, running: true, lastResumeAt: nowIso() } }
  }),

  endSession: ({ note, result, taskId }) => {
    const { active } = get()
    if (!active) return null
    const extra = active.running
      ? Math.floor((Date.now() - new Date(active.lastResumeAt).getTime()) / 1000)
      : 0
    const durationSec = active.elapsedBeforePause + extra
    const session: Session = {
      id: uid(),
      projectId: active.projectId,
      taskId: taskId ?? active.taskId,
      startedAt: active.startedAt,
      endedAt: nowIso(),
      durationSec,
      note,
      result,
    }
    set((s) => ({
      sessions: [...s.sessions, session],
      active: undefined,
      buddyMood: result === 'completed' ? 'celebrating' : 'encouraging',
    }))
    return session
  },

  recordBlocker: (b) => {
    const blocker: Blocker = { ...b, id: uid(), createdAt: nowIso() }
    set((s) => ({ blockers: [...s.blockers, blocker], buddyMood: 'thinking' }))
    return blocker
  },

  resolveBlocker: (id) => set((s) => ({
    blockers: s.blockers.map((b) => b.id === id ? { ...b, resolvedAt: nowIso() } : b)
  })),

  setBuddyMood: (m) => set({ buddyMood: m }),

  updatePreferences: (p) => set((s) => ({ preferences: { ...s.preferences, ...p } })),

  completeProject: (id, publishedUrl) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, completedAt: nowIso(), publishedUrl } : p),
    buddyMood: 'completed',
  })),

  archiveProject: (id) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, archived: true } : p)
  })),

  reset: () => set({
    projects: [], sessions: [], blockers: [], currentProjectId: undefined,
    active: undefined, buddyMood: 'neutral',
  }),
}), {
  name: 'bora-store',
  version: 1,
}))

export const selectCurrentProject = (s: State): Project | undefined =>
  s.projects.find((p) => p.id === s.currentProjectId) ?? s.projects.find((p) => !p.archived && !p.completedAt)

export const selectNextTask = (project?: Project): { task: Task; stage: Stage } | undefined => {
  if (!project) return undefined
  for (const stage of project.stages) {
    const task = stage.tasks.find((t) => !t.done)
    if (task) return { task, stage }
  }
  return undefined
}

export const selectProgress = (project?: Project): { done: number; total: number; pct: number } => {
  if (!project) return { done: 0, total: 0, pct: 0 }
  const tasks = project.stages.flatMap((s) => s.tasks)
  const total = tasks.length
  const done = tasks.filter((t) => t.done).length
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) }
}

export type ID = string

export type Task = {
  id: ID
  stageId: ID
  title: string
  description?: string
  estimateMin?: number
  done: boolean
  completedAt?: string
  createdAt: string
}

export type Stage = {
  id: ID
  projectId: ID
  title: string
  order: number
  tasks: Task[]
}

export type Project = {
  id: ID
  name: string
  description: string
  goal: string
  criteria: string
  deadline?: string
  stages: Stage[]
  createdAt: string
  completedAt?: string
  archived: boolean
  publishedUrl?: string
  github?: { repositoryId: number; fullName: string; private: boolean; connectedUserId: number }
}

export type SessionResult = 'progress' | 'partial' | 'completed' | 'blocked'

export type Session = {
  id: ID
  projectId: ID
  taskId?: ID
  startedAt: string
  endedAt?: string
  durationSec: number
  result?: SessionResult
  note?: string
}

export type Blocker = {
  id: ID
  projectId: ID
  type: 'tecnico' | 'documentacao' | 'duvida' | 'distracao' | 'outro'
  description: string
  tried?: string
  nextStep: string
  createdAt: string
  resolvedAt?: string
}

export type BuddyMood =
  | 'neutral'
  | 'working'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'returning'
  | 'evolved'
  | 'completed'

export type Preferences = {
  remindersEnabled: boolean
  reminderTime: string
  reduceMotion: boolean
}

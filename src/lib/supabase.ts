import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabase = Boolean(url && key)

// ponytail: Supabase client is scaffolded but data layer uses localStorage via zustand/persist.
// Swap to supabase calls (projects, sessions, blockers tables + RLS) once schema is applied.
export const supabase = hasSupabase ? createClient(url!, key!) : null

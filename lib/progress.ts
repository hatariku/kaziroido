// lib/progress.ts
import { supabase } from './supabase'

export async function upsertProgress(problemId: number, cleared: boolean) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('not authed')
  const { error } = await supabase
    .from('progress')
    .upsert({
      user_id: user.id,
      problem_id: problemId,
      cleared,
      last_answered_at: new Date().toISOString(),
    })
  if (error) throw error
}

export async function getProgressMap(): Promise<Record<number, boolean>> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}
  const { data, error } = await supabase
    .from('progress')
    .select('problem_id, cleared')
  if (error) throw error
  const map: Record<number, boolean> = {}
  data?.forEach(r => { map[r.problem_id] = !!r.cleared })
  return map
}

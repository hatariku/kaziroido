// lib/problems.ts
import { supabase } from './supabase'

export async function fetchFirstProblemId() {
  const { data, error } = await supabase
    .from('problems')
    .select('id')
    .order('id', { ascending: true })
    .limit(1)
  if (error) throw error
  return data?.[0]?.id ?? null
}

export async function fetchProblemById(id: number) {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function fetchNextProblemId(currentId: number) {
  const { data, error } = await supabase
    .from('problems')
    .select('id')
    .gt('id', currentId)
    .order('id', { ascending: true })
    .limit(1)
  if (error) throw error
  return data?.[0]?.id ?? null
}

export async function fetchProblemsBrief() {
  const { data, error } = await supabase
    .from('problems')
    .select('id, title')
    .order('id', { ascending: true })
  if (error) throw error
  return data ?? []
}


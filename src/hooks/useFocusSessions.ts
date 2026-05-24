import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { FocusSession } from '../types'

export function useFocusSessions() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('focus_sessions').select('*').eq('user_id', user.id)
      .order('started_at', { ascending: false }).limit(20)
    setSessions(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  const startSession = async (taskId: string | undefined, durationMinutes: number, ambientSound: string): Promise<FocusSession | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase.from('focus_sessions').insert({
      user_id: user.id, task_id: taskId ?? null,
      started_at: new Date().toISOString(),
      planned_minutes: durationMinutes, completed: false, ambient_sound: ambientSound
    }).select().single()
    if (data) setSessions(prev => [data, ...prev])
    return data
  }

  const endSession = async (id: string, completed: boolean) => {
    await supabase.from('focus_sessions')
      .update({ ended_at: new Date().toISOString(), completed }).eq('id', id)
    fetchSessions()
  }

  return { sessions, loading, startSession, endSession }
}

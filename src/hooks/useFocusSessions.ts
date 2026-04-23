import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { FocusSession } from '../types'

export function useFocusSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .limit(30)
    setSessions(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const startSession = async (taskId: string | null, durationMinutes: number, ambientSound: string) => {
    if (!user) return null
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({ user_id: user.id, task_id: taskId, duration_minutes: durationMinutes, ambient_sound: ambientSound })
      .select()
      .single()
    if (!error && data) setSessions((prev) => [data, ...prev])
    return data
  }

  const endSession = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('focus_sessions')
      .update({ ended_at: new Date().toISOString(), completed })
      .eq('id', id)
    if (!error) setSessions((prev) => prev.map((s) => s.id === id ? { ...s, ended_at: new Date().toISOString(), completed } : s))
  }

  const weeklyFocusMinutes = () => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return sessions
      .filter((s) => s.completed && new Date(s.started_at) > oneWeekAgo)
      .reduce((sum, s) => sum + s.duration_minutes, 0)
  }

  return { sessions, loading, startSession, endSession, weeklyFocusMinutes }
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Habit, HabitLog, HabitState } from '../types'

export function useHabits(date: string) {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    const [habitsRes, logsRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id).eq('active', true).order('sort_order'),
      supabase.from('habit_logs').select('*').eq('user_id', user.id).eq('date', date),
    ])
    setHabits(habitsRes.data ?? [])
    setLogs(logsRes.data ?? [])
    setLoading(false)
  }, [user, date])

  useEffect(() => { fetch() }, [fetch])

  const addHabit = async (name: string, icon: string, color: string) => {
    if (!user) return
    const sort_order = habits.length
    const { data, error } = await supabase
      .from('habits')
      .insert({ user_id: user.id, name, icon, color, sort_order })
      .select()
      .single()
    if (!error && data) setHabits((prev) => [...prev, data])
    return { error: error?.message }
  }

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id)
    if (!error) setHabits((prev) => prev.filter((h) => h.id !== id))
    return { error: error?.message }
  }

  const logHabit = async (habitId: string, state: HabitState) => {
    if (!user) return
    const existing = logs.find((l) => l.habit_id === habitId)
    if (existing) {
      const { error } = await supabase.from('habit_logs').update({ state }).eq('id', existing.id)
      if (!error) setLogs((prev) => prev.map((l) => l.id === existing.id ? { ...l, state } : l))
    } else {
      const { data, error } = await supabase
        .from('habit_logs')
        .insert({ habit_id: habitId, user_id: user.id, date, state })
        .select()
        .single()
      if (!error && data) setLogs((prev) => [...prev, data])
    }
  }

  const getLog = (habitId: string) => logs.find((l) => l.habit_id === habitId)

  return { habits, logs, loading, addHabit, deleteHabit, logHabit, getLog, refetch: fetch }
}

export function useHabitStreak(habitId: string) {
  const { user } = useAuth()
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (!user) return
    const calcStreak = async () => {
      const { data } = await supabase
        .from('habit_logs')
        .select('date, state')
        .eq('habit_id', habitId)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(60)

      if (!data) return
      let count = 0
      const today = new Date()
      for (let i = 0; i < data.length; i++) {
        const logDate = new Date(data[i].date)
        const diff = Math.round((today.getTime() - logDate.getTime()) / 86400000)
        // Allow 1 grace day gap (streak grace)
        if (diff > count + 2) break
        if (data[i].state !== 'forgive') count++
      }
      setStreak(count)
    }
    calcStreak()
  }, [habitId, user])

  return streak
}

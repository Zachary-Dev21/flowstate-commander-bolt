import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Habit, HabitLog, HabitState } from '../types'
import { formatDate } from '../lib/dateUtils'
import { subDays } from 'date-fns'

export function useHabits(date: string) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const [{ data: h }, { data: l }] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('habit_logs').select('*').eq('user_id', user.id).eq('date', date)
    ])
    setHabits(h ?? [])
    setLogs(l ?? [])
    setLoading(false)
  }, [date])

  useEffect(() => { fetchData() }, [fetchData])

  const addHabit = async (habit: Pick<Habit, 'name' | 'emoji' | 'frequency'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('habits').insert({ ...habit, user_id: user.id })
    fetchData()
  }

  const deleteHabit = async (id: string) => {
    await supabase.from('habits').delete().eq('id', id)
    fetchData()
  }

  const logHabit = async (habitId: string, state: HabitState, note?: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const existing = logs.find(l => l.habit_id === habitId)
    if (existing) {
      await supabase.from('habit_logs').update({ state, note }).eq('id', existing.id)
    } else {
      await supabase.from('habit_logs').insert({ habit_id: habitId, user_id: user.id, date, state, note })
    }
    fetchData()
  }

  return { habits, logs, loading, addHabit, deleteHabit, logHabit }
}

export function useHabitStreak(habitId: string): number {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (!habitId) return
    const calc = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: logs } = await supabase
        .from('habit_logs').select('date, state')
        .eq('habit_id', habitId).eq('user_id', user.id)
        .order('date', { ascending: false }).limit(60)
      if (!logs || logs.length === 0) { setStreak(0); return }
      const logMap = new Map(logs.map(l => [l.date, l.state as HabitState]))
      let count = 0
      let checkDate = new Date()
      let graceUsed = false
      for (let i = 0; i < 60; i++) {
        const dateStr = formatDate(checkDate)
        const state = logMap.get(dateStr)
        if (state === 'done' || state === 'partial' || state === 'adapted') {
          count++
        } else if (state === 'forgive') {
          // doesn't break streak
        } else if (!state && !graceUsed && i > 0) {
          graceUsed = true
        } else {
          break
        }
        checkDate = subDays(checkDate, 1)
      }
      setStreak(count)
    }
    calc()
  }, [habitId])

  return streak
}

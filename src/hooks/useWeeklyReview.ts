import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { WeeklyReview } from '../types'
import { getWeekDays } from '../lib/dateUtils'

export function useWeeklyReview(weekStart: string) {
  const [review, setReview] = useState<WeeklyReview | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchReview = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('weekly_reviews').select('*')
      .eq('user_id', user.id).eq('week_start', weekStart).maybeSingle()
    setReview(data)
    setLoading(false)
  }, [weekStart])

  useEffect(() => { fetchReview() }, [fetchReview])

  const save = async (updates: Pick<WeeklyReview, 'intention' | 'reflection' | 'energy_level'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (review) {
      const { data } = await supabase.from('weekly_reviews').update(updates).eq('id', review.id).select().single()
      setReview(data)
    } else {
      const { data } = await supabase.from('weekly_reviews')
        .insert({ ...updates, user_id: user.id, week_start: weekStart }).select().single()
      setReview(data)
    }
  }

  return { review, loading, save }
}

export function useWeeklyStats(weekStart: string) {
  const [tasksCompleted, setTasksCompleted] = useState(0)
  const [tasksTotal, setTasksTotal] = useState(0)
  const [focusMinutes, setFocusMinutes] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const days = getWeekDays(weekStart)
      const endDate = days[6] ? days[6].toISOString().slice(0, 10) : weekStart
      const [{ data: tasks }, { data: sessions }] = await Promise.all([
        supabase.from('tasks').select('status').eq('user_id', user.id)
          .gte('date', weekStart).lte('date', endDate).eq('is_buffer', false),
        supabase.from('focus_sessions').select('planned_minutes, completed').eq('user_id', user.id)
          .gte('started_at', weekStart).lte('started_at', endDate + 'T23:59:59')
      ])
      const all = tasks ?? []
      setTasksTotal(all.length)
      setTasksCompleted(all.filter(t => t.status === 'done').length)
      setFocusMinutes((sessions ?? []).filter(s => s.completed).reduce((sum, s) => sum + (s.planned_minutes ?? 0), 0))
    }
    fetch()
  }, [weekStart])

  return { tasksCompleted, tasksTotal, focusMinutes }
}

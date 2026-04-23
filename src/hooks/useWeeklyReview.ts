import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { WeeklyReview } from '../types'

export function useWeeklyReview(weekStart: string) {
  const { user } = useAuth()
  const [review, setReview] = useState<WeeklyReview | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('weekly_reviews')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_start', weekStart)
      .maybeSingle()
    setReview(data)
    setLoading(false)
  }, [user, weekStart])

  useEffect(() => { fetch() }, [fetch])

  const save = async (updates: Partial<WeeklyReview>) => {
    if (!user) return
    if (review) {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', review.id)
        .select()
        .single()
      if (!error && data) setReview(data)
    } else {
      const { data, error } = await supabase
        .from('weekly_reviews')
        .insert({ user_id: user.id, week_start: weekStart, ...updates })
        .select()
        .single()
      if (!error && data) setReview(data)
    }
  }

  return { review, loading, save, refetch: fetch }
}

export function useWeeklyStats(weekStart: string) {
  const { user } = useAuth()
  const [stats, setStats] = useState({ tasksCompleted: 0, tasksTotal: 0, focusMinutes: 0 })

  useEffect(() => {
    if (!user) return
    const fetchStats = async () => {
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      const weekEndStr = weekEnd.toISOString().split('T')[0]

      const [tasksRes, focusRes] = await Promise.all([
        supabase
          .from('tasks')
          .select('status')
          .eq('user_id', user.id)
          .gte('date', weekStart)
          .lt('date', weekEndStr)
          .eq('is_buffer', false),
        supabase
          .from('focus_sessions')
          .select('duration_minutes, completed')
          .eq('user_id', user.id)
          .gte('started_at', weekStart)
          .lt('started_at', weekEndStr + 'T23:59:59')
          .eq('completed', true),
      ])

      const tasks = tasksRes.data ?? []
      const completed = tasks.filter((t) => t.status === 'done').length
      const total = tasks.length
      const focusMinutes = (focusRes.data ?? []).reduce((sum, s) => sum + s.duration_minutes, 0)

      setStats({ tasksCompleted: completed, tasksTotal: total, focusMinutes })
    }
    fetchStats()
  }, [user, weekStart])

  return stats
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Task } from '../types'

export function useTasks(date: string) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .order('start_hour', { ascending: true })
    setTasks(data ?? [])
    setLoading(false)
  }, [user, date])

  useEffect(() => { fetch() }, [fetch])

  const addTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'distraction_count' | 'focus_minutes'>) => {
    if (!user) return
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, user_id: user.id })
      .select()
      .single()
    if (!error && data) setTasks((prev) => [...prev, data].sort((a, b) => a.start_hour - b.start_hour))
    return { error: error?.message }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t))
    return { error: error?.message }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks((prev) => prev.filter((t) => t.id !== id))
    return { error: error?.message }
  }

  return { tasks, loading, addTask, updateTask, deleteTask, refetch: fetch }
}

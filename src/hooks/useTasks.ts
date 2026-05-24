import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { Task } from '../types'

export function useTasks(date: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('tasks').select('*').eq('user_id', user.id).eq('date', date)
      .order('start_hour', { ascending: true })
    setTasks(data ?? [])
    setLoading(false)
  }, [date])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const addTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'distraction_count' | 'focus_minutes'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: newTask } = await supabase
      .from('tasks')
      .insert({ ...task, user_id: user.id, distraction_count: 0, focus_minutes: 0 })
      .select().single()
    if (newTask && !task.is_buffer) {
      const bufferStart = task.start_hour + (task.duration_units * 15) / 60
      await supabase.from('tasks').insert({
        user_id: user.id, title: '🌊 Buffer', date: task.date,
        start_hour: bufferStart, duration_units: 1, is_buffer: true,
        status: 'pending', distraction_count: 0, focus_minutes: 0
      })
    }
    fetchTasks()
    return newTask
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    await supabase.from('tasks').update(updates).eq('id', id)
    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  return { tasks, loading, addTask, updateTask, deleteTask, refetch: fetchTasks }
}

export function useTasksRange(startDate: string, endDate: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const { data } = await supabase
      .from('tasks').select('*').eq('user_id', user.id)
      .gte('date', startDate).lte('date', endDate)
      .order('start_hour', { ascending: true })
    setTasks(data ?? [])
    setLoading(false)
  }, [startDate, endDate])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const updateTask = async (id: string, updates: Partial<Task>) => {
    await supabase.from('tasks').update(updates).eq('id', id)
    fetchTasks()
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    fetchTasks()
  }

  return { tasks, loading, updateTask, deleteTask, refetch: fetchTasks }
}

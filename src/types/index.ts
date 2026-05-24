export interface Task {
  id: string
  user_id: string
  title: string
  date: string
  start_hour: number
  duration_units: number
  is_buffer: boolean
  status: 'pending' | 'active' | 'done' | 'skipped'
  distraction_count: number
  focus_minutes: number
  created_at?: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  emoji: string
  frequency: 'daily' | 'weekdays' | 'weekends'
  created_at?: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string
  state: HabitState
  note?: string
  created_at?: string
}

export interface FocusSession {
  id: string
  user_id: string
  task_id?: string
  started_at: string
  ended_at?: string
  planned_minutes: number
  completed: boolean
  ambient_sound?: string
}

export interface WeeklyReview {
  id: string
  user_id: string
  week_start: string
  intention: string
  reflection: string
  energy_level: number
  created_at?: string
}

export type CalendarView = 'day' | '3day' | 'week' | 'month'
export type HabitState = 'done' | 'partial' | 'adapted' | 'forgive'

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { useTasks } from '../hooks/useTasks'
import { useHabits } from '../hooks/useHabits'
import { todayStr, currentHour, isTaskCurrent } from '../lib/dateUtils'
import Timeline from '../components/Timeline'
import NowBlock from '../components/NowBlock'
import AddTaskModal from '../components/AddTaskModal'
import HabitRow from '../components/HabitRow'
import type { Task } from '../types'

export default function TodayPage() {
  const today = todayStr()
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks(today)
  const { habits, logs, logHabit } = useHabits(today)
  const [showAdd, setShowAdd] = useState(false)
  const [suggestedHour, setSuggestedHour] = useState<number>(9)
  const navigate = useNavigate()

  const currentTask = useMemo(() => {
    return tasks.find((t) => !t.is_buffer && isTaskCurrent(t.date, t.start_hour, t.duration_units) && t.status !== 'done') ?? null
  }, [tasks])

  const handleFocus = (task: Task) => {
    navigate('/focus', { state: { task } })
  }

  const handleSlotClick = (hour: number) => {
    setSuggestedHour(hour)
    setShowAdd(true)
  }

  const completedCount = tasks.filter((t) => !t.is_buffer && t.status === 'done').length
  const totalCount = tasks.filter((t) => !t.is_buffer).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(), 'EEEE, MMMM d')}</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-100">Today</h1>
          {totalCount > 0 && (
            <p className="text-xs text-slate-400 mt-0.5">
              {completedCount}/{totalCount} tasks complete
            </p>
          )}
        </div>
        <button
          onClick={() => { setSuggestedHour(Math.max(6, Math.min(21, Math.floor(currentHour())))); setShowAdd(true) }}
          className="btn-primary flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Now Block */}
      <div className="mb-6">
        <NowBlock task={currentTask} onFocus={handleFocus} />
      </div>

      {/* Habits strip */}
      {habits.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-2">Keystone Habits</p>
          <div className="flex flex-col gap-2">
            {habits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                log={logs.find((l) => l.habit_id === habit.id) ?? null}
                onLog={logHabit}
                compact
              />
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Timeline</p>
        {totalCount === 0 && (
          <p className="text-xs text-slate-500">Click any time slot to add a task</p>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 text-sm">Loading...</div>
      ) : (
        <Timeline
          tasks={tasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onFocus={handleFocus}
          onSlotClick={handleSlotClick}
        />
      )}

      {showAdd && (
        <AddTaskModal
          date={today}
          suggestedHour={suggestedHour}
          onAdd={(task) => addTask(task)}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}

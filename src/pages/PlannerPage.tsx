import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, parseISO } from 'date-fns'
import { format } from 'date-fns'
import { CalendarView, Task } from '../types'
import { formatDate, getWeekStart, getWeekDays } from '../lib/dateUtils'
import { useTasks, useTasksRange } from '../hooks/useTasks'
import DayView from '../components/views/DayView'
import MultiDayView from '../components/views/MultiDayView'
import MonthView from '../components/views/MonthView'
import NowBlock from '../components/NowBlock'
import AddTaskModal from '../components/AddTaskModal'
import BodyDoubleTimer from '../components/BodyDoubleTimer'
import { useFocusSessions } from '../hooks/useFocusSessions'
import { FocusSession } from '../types'

const VIEW_LABELS: Record<CalendarView, string> = { day: 'Day', '3day': '3 Day', week: 'Week', month: 'Month' }

export default function PlannerPage() {
  const [view, setView] = useState<CalendarView>('day')
  const [anchor, setAnchor] = useState(() => formatDate(new Date()))
  const [showAdd, setShowAdd] = useState(false)
  const [focusTask, setFocusTask] = useState<Task | null>(null)
  const [focusSession, setFocusSession] = useState<FocusSession | null>(null)

  const { startSession, endSession } = useFocusSessions()

  const getDays = (): Date[] => {
    const base = parseISO(anchor)
    if (view === 'day') return [base]
    if (view === '3day') return [base, addDays(base, 1), addDays(base, 2)]
    if (view === 'week') return getWeekDays(getWeekStart(base))
    const year = base.getFullYear(), month = base.getMonth()
    return Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => new Date(year, month, i + 1))
  }

  const days = getDays()
  const startDate = formatDate(days[0])
  const endDate = formatDate(days[days.length - 1])

  const dayData = useTasks(anchor)
  const rangeData = useTasksRange(startDate, endDate)

  const updateTask = view === 'day' ? dayData.updateTask : rangeData.updateTask
  const deleteTask = view === 'day' ? dayData.deleteTask : rangeData.deleteTask

  const navigate = (dir: 1 | -1) => {
    const base = parseISO(anchor)
    const fns: Record<CalendarView, () => Date> = {
      day: () => dir === 1 ? addDays(base, 1) : subDays(base, 1),
      '3day': () => dir === 1 ? addDays(base, 3) : subDays(base, 3),
      week: () => dir === 1 ? addWeeks(base, 1) : subWeeks(base, 1),
      month: () => dir === 1 ? addMonths(base, 1) : subMonths(base, 1)
    }
    setAnchor(formatDate(fns[view]()))
  }

  const getHeaderLabel = () => {
    const base = parseISO(anchor)
    if (view === 'day') return format(base, 'EEEE, MMMM d, yyyy')
    if (view === '3day') return `${format(days[0], 'MMM d')} – ${format(days[2], 'MMM d, yyyy')}`
    if (view === 'week') return `Week of ${format(days[0], 'MMM d, yyyy')}`
    return format(base, 'MMMM yyyy')
  }

  const handleStartFocus = async (task: Task) => {
    const session = await startSession(task.id, 25, 'rain')
    if (session) { setFocusTask(task); setFocusSession(session) }
  }

  const handleEndFocus = async (completed: boolean) => {
    if (focusSession) {
      await endSession(focusSession.id, completed)
      if (completed && focusTask) await updateTask(focusTask.id, { status: 'done' })
    }
    setFocusTask(null)
    setFocusSession(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
          <button onClick={() => setAnchor(formatDate(new Date()))} className="btn-ghost px-3 py-2 text-xs">Today</button>
          <button onClick={() => navigate(1)} className="btn-ghost p-2"><ChevronRight size={18} /></button>
        </div>
        <h2 className="text-sm font-medium text-slate-200 flex-1">{getHeaderLabel()}</h2>
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
          {(Object.keys(VIEW_LABELS) as CalendarView[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${view === v ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} />Add Task
        </button>
      </div>

      {view === 'day' && <NowBlock tasks={dayData.tasks} onFocus={handleStartFocus} />}

      <div className="card overflow-hidden">
        {view === 'day' && (
          <DayView date={anchor} tasks={dayData.tasks}
            onUpdate={dayData.updateTask} onDelete={dayData.deleteTask}
            onAdd={dayData.addTask} onFocus={handleStartFocus} />
        )}
        {(view === '3day' || view === 'week') && (
          <MultiDayView days={days} tasks={rangeData.tasks}
            onUpdate={rangeData.updateTask} onDelete={rangeData.deleteTask} />
        )}
        {view === 'month' && (
          <MonthView days={days} tasks={rangeData.tasks}
            onDayClick={date => { setAnchor(date); setView('day') }} />
        )}
      </div>

      {showAdd && (
        <AddTaskModal date={anchor} onAdd={dayData.addTask} onClose={() => setShowAdd(false)} />
      )}

      {focusTask && focusSession && (
        <BodyDoubleTimer session={focusSession} taskTitle={focusTask.title} onEnd={handleEndFocus} />
      )}
    </div>
  )
}

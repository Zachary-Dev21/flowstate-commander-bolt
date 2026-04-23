import { useState } from 'react'
import { ChevronLeft, ChevronRight, Target, BarChart3, Clock, CheckCircle2 } from 'lucide-react'
import { format, addWeeks, subWeeks, parseISO } from 'date-fns'
import { useWeeklyReview, useWeeklyStats } from '../hooks/useWeeklyReview'
import { useHabits } from '../hooks/useHabits'
import { getWeekStart, getWeekDays, todayStr } from '../lib/dateUtils'

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-slate-100 leading-tight">{value}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  )
}

function HabitWeekRow({ habitId, habitName, habitIcon, weekDays }: {
  habitId: string
  habitName: string
  habitIcon: string
  weekDays: Date[]
}) {
  const { logs } = useHabits(format(weekDays[0], 'yyyy-MM-dd'))

  const stateColor: Record<string, string> = {
    done: 'bg-emerald-500',
    partial: 'bg-amber-500',
    adapted: 'bg-teal-500',
    forgive: 'bg-slate-600',
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-6">{habitIcon}</span>
      <span className="text-xs text-slate-300 flex-1 truncate">{habitName}</span>
      <div className="flex gap-1">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const log = logs.find((l) => l.habit_id === habitId && l.date === dateStr)
          return (
            <div
              key={dateStr}
              className={`w-5 h-5 rounded-sm ${log ? stateColor[log.state] : 'bg-slate-800'}`}
              title={log ? log.state : 'no log'}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function WeeklyPage() {
  const [weekOffset, setWeekOffset] = useState(0)
  const today = todayStr()
  const baseDate = weekOffset === 0 ? new Date() : weekOffset > 0
    ? addWeeks(new Date(), weekOffset)
    : subWeeks(new Date(), Math.abs(weekOffset))
  const weekStart = getWeekStart(baseDate)
  const weekDays = getWeekDays(weekStart)

  const { review, loading, save } = useWeeklyReview(weekStart)
  const stats = useWeeklyStats(weekStart)
  const { habits } = useHabits(today)

  const [intention, setIntention] = useState(review?.intention ?? '')
  const [notes, setNotes] = useState(review?.notes ?? '')
  const [saved, setSaved] = useState(false)

  const completionPct = stats.tasksTotal > 0
    ? Math.round((stats.tasksCompleted / stats.tasksTotal) * 100)
    : 0

  const handleSave = async () => {
    await save({
      intention,
      notes,
      tasks_completed: stats.tasksCompleted,
      tasks_total: stats.tasksTotal,
      focus_minutes_total: stats.focusMinutes,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const weekLabel = weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Last Week' : format(parseISO(weekStart), 'MMM d')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header with week navigator */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Weekly Review</h1>
          <p className="text-xs text-slate-400 mt-0.5">{weekLabel} · {format(parseISO(weekStart), 'MMM d')} – {format(weekDays[6], 'MMM d')}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setWeekOffset((w) => w - 1)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            disabled={weekOffset === 0}
            className="px-2 py-1 text-xs rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-40 transition-colors"
          >
            Today
          </button>
          <button onClick={() => setWeekOffset((w) => w + 1)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={CheckCircle2}
          label="Tasks completed"
          value={`${stats.tasksCompleted}/${stats.tasksTotal}`}
          sub={`${completionPct}% completion`}
          color="bg-emerald-500/20 text-emerald-400"
        />
        <StatCard
          icon={Clock}
          label="Focus time"
          value={`${Math.floor(stats.focusMinutes / 60)}h ${stats.focusMinutes % 60}m`}
          sub="deep work"
          color="bg-teal-500/20 text-teal-400"
        />
      </div>

      {/* Completion bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Weekly completion
          </p>
          <span className="text-sm font-semibold text-slate-100">{completionPct}%</span>
        </div>
        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-700"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        {/* Day-by-day dots */}
        <div className="flex justify-between mt-3">
          {weekDays.map((day) => {
            const isToday = format(day, 'yyyy-MM-dd') === today
            return (
              <div key={day.toISOString()} className="flex flex-col items-center gap-1">
                <span className={`text-xs ${isToday ? 'text-teal-400 font-semibold' : 'text-slate-500'}`}>
                  {format(day, 'EEE')[0]}
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-teal-400' : 'bg-slate-700'}`} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Habit week grid */}
      {habits.length > 0 && (
        <div className="card p-4 mb-6">
          <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wider">Habit streak</p>
          <div className="flex flex-col gap-2.5">
            {habits.map((habit) => (
              <HabitWeekRow
                key={habit.id}
                habitId={habit.id}
                habitName={habit.name}
                habitIcon={habit.icon}
                weekDays={weekDays}
              />
            ))}
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
            {[
              { color: 'bg-emerald-500', label: 'Done' },
              { color: 'bg-amber-500', label: 'Partial' },
              { color: 'bg-teal-500', label: 'Adapted' },
              { color: 'bg-slate-600', label: 'Forgive' },
              { color: 'bg-slate-800', label: 'None' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Planning ritual */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-teal-400" />
          <h2 className="font-medium text-slate-100 text-sm">Weekly intention</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">What's the ONE thing that matters most this week?</label>
            <input
              className="input"
              value={review?.intention ?? intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="My primary focus is..."
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Reflection & notes</label>
            <textarea
              className="input resize-none"
              rows={4}
              value={review?.notes ?? notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What went well? What do I want to adjust?"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {saved ? 'Saved!' : 'Save review'}
          </button>
        </div>
      </div>
    </div>
  )
}

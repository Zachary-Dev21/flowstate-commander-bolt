import type { Habit, HabitLog, HabitState } from '../types'
import { useHabitStreak } from '../hooks/useHabits'
import { Flame } from 'lucide-react'

const STATE_OPTIONS: { state: HabitState; label: string; color: string; bg: string }[] = [
  { state: 'done', label: 'Done', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40' },
  { state: 'partial', label: 'Partial', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40' },
  { state: 'adapted', label: 'Adapted', color: 'text-teal-400', bg: 'bg-teal-500/20 border-teal-500/40' },
  { state: 'forgive', label: 'Forgive', color: 'text-slate-400', bg: 'bg-slate-700/50 border-slate-600/40' },
]

interface HabitRowProps {
  habit: Habit
  log: HabitLog | null
  onLog: (habitId: string, state: HabitState) => void
  compact?: boolean
}

function StreakBadge({ habitId }: { habitId: string }) {
  const streak = useHabitStreak(habitId)
  if (streak === 0) return null
  return (
    <div className="flex items-center gap-1 text-amber-400">
      <Flame className="w-3 h-3" />
      <span className="text-xs font-medium">{streak}</span>
    </div>
  )
}

export default function HabitRow({ habit, log, onLog, compact = false }: HabitRowProps) {
  const currentState = log?.state ?? null

  return (
    <div className={`card flex items-center gap-3 ${compact ? 'px-3 py-2.5' : 'px-4 py-3'}`}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: habit.color + '22', border: `1px solid ${habit.color}44` }}
      >
        {habit.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-100 truncate">{habit.name}</span>
          <StreakBadge habitId={habit.id} />
        </div>
        {currentState && (
          <p className="text-xs text-slate-500 mt-0.5 capitalize">{currentState}</p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {STATE_OPTIONS.map(({ state, label, color, bg }) => (
          <button
            key={state}
            onClick={() => onLog(habit.id, state)}
            className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
              currentState === state
                ? `${bg} ${color}`
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

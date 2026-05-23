import { Flame, Trash2 } from 'lucide-react'
import { Habit, HabitLog, HabitState } from '../types'
import { useHabitStreak } from '../hooks/useHabits'

const STATES: { value: HabitState; label: string; color: string }[] = [
  { value: 'done', label: 'Done', color: 'bg-green-600 text-white' },
  { value: 'partial', label: 'Partial', color: 'bg-yellow-600 text-white' },
  { value: 'adapted', label: 'Adapted', color: 'bg-blue-600 text-white' },
  { value: 'forgive', label: 'Forgive', color: 'bg-slate-600 text-white' }
]

interface Props {
  habit: Habit
  log?: HabitLog
  onLog: (habitId: string, state: HabitState) => void
  onDelete: (id: string) => void
}

export default function HabitCard({ habit, log, onLog, onDelete }: Props) {
  const streak = useHabitStreak(habit.id)
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{habit.emoji}</span>
          <div>
            <p className="font-medium text-slate-100 text-sm">{habit.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Flame size={12} className={streak > 0 ? 'text-orange-400' : 'text-slate-600'} />
              <span className={`text-xs ${streak > 0 ? 'text-orange-400' : 'text-slate-500'}`}>
                {streak} day streak
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(habit.id)} className="btn-ghost p-1.5 text-slate-500 hover:text-red-400">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {STATES.map(s => (
          <button key={s.value} onClick={() => onLog(habit.id, s.value)}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all
              ${log?.state === s.value ? s.color : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
            {s.label}
          </button>
        ))}
      </div>
      {log?.state === 'forgive' && (
        <p className="text-xs text-slate-500 mt-2 italic text-center">Be gentle with yourself today.</p>
      )}
    </div>
  )
}

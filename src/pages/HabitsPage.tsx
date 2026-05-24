import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import { addDays, subDays, parseISO } from 'date-fns'
import { format } from 'date-fns'
import { HabitState } from '../types'
import { formatDate } from '../lib/dateUtils'
import { useHabits } from '../hooks/useHabits'
import HabitCard from '../components/HabitCard'

const EMOJIS = ['✅', '💪', '🧘', '📚', '💧', '🏃', '🌿', '🎯', '⭐', '🌞', '🍎', '🧠']

export default function HabitsPage() {
  const [date, setDate] = useState(() => formatDate(new Date()))
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('✅')
  const [newFreq, setNewFreq] = useState<'daily' | 'weekdays' | 'weekends'>('daily')

  const { habits, logs, loading, addHabit, deleteHabit, logHabit } = useHabits(date)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    await addHabit({ name: newName.trim(), emoji: newEmoji, frequency: newFreq })
    setNewName('')
    setShowAdd(false)
  }

  const navigate = (dir: 1 | -1) => {
    const base = parseISO(date)
    setDate(formatDate(dir === 1 ? addDays(base, 1) : subDays(base, 1)))
  }

  const isToday = date === formatDate(new Date())

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
          <span className="text-sm font-medium text-slate-200">
            {isToday ? 'Today' : format(parseISO(date), 'MMMM d, yyyy')}
          </span>
          <button onClick={() => navigate(1)} className="btn-ghost p-2" disabled={isToday}>
            <ChevronRight size={18} />
          </button>
        </div>
        <button onClick={() => setShowAdd(s => !s)} className="btn-primary flex items-center gap-1.5">
          <Plus size={16} />New Habit
        </button>
      </div>

      {showAdd && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-100">New Habit</h3>
            <button onClick={() => setShowAdd(false)} className="btn-ghost p-1"><X size={16} /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Habit name</label>
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                className="input w-full" placeholder="e.g., Morning meditation" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Emoji</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} type="button" onClick={() => setNewEmoji(e)}
                    className={`w-9 h-9 text-xl rounded-lg transition-all
                      ${newEmoji === e ? 'bg-teal-600 ring-2 ring-teal-400' : 'bg-slate-700 hover:bg-slate-600'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Frequency</label>
              <div className="flex gap-2">
                {(['daily', 'weekdays', 'weekends'] as const).map(f => (
                  <button key={f} type="button" onClick={() => setNewFreq(f)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm capitalize transition-all
                      ${newFreq === f ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={!newName.trim()}>Add Habit</button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading...</div>
      ) : habits.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-5xl mb-4">🌱</div>
          <p className="text-sm">No habits yet. Build one small win at a time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map(habit => (
            <HabitCard key={habit.id} habit={habit}
              log={logs.find(l => l.habit_id === habit.id)}
              onLog={logHabit} onDelete={deleteHabit} />
          ))}
        </div>
      )}

      {logs.some(l => l.state === 'forgive') && (
        <div className="mt-6 card p-4 text-center">
          <p className="text-sm text-slate-400 italic">"Progress, not perfection. Every small step counts."</p>
        </div>
      )}
    </div>
  )
}

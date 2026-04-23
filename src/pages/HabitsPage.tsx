import { useState } from 'react'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import { useHabits } from '../hooks/useHabits'
import { todayStr } from '../lib/dateUtils'
import HabitRow from '../components/HabitRow'

const ICONS = ['⭐', '🏃', '📚', '💧', '🧘', '🥗', '💊', '🛌', '✍️', '🎯', '🌿', '💪']
const COLORS = ['#14b8a6', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#8b5cf6', '#ec4899', '#6366f1']

export default function HabitsPage() {
  const today = todayStr()
  const { habits, logs, loading, addHabit, deleteHabit, logHabit } = useHabits(today)
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('⭐')
  const [color, setColor] = useState('#14b8a6')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await addHabit(name.trim(), icon, color)
    setName('')
    setIcon('⭐')
    setColor('#14b8a6')
    setShowAdd(false)
    setSaving(false)
  }

  const canAdd = habits.length < 3

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Keystone Habits</h1>
          <p className="text-xs text-slate-400 mt-0.5">Up to 3 habits that move the needle</p>
        </div>
        {canAdd && (
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {/* Compassionate tracking explanation */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-200 mb-1">Non-binary tracking</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-emerald-400 font-medium">Done</span> — completed fully.{' '}
              <span className="text-amber-400 font-medium">Partial</span> — did some.{' '}
              <span className="text-teal-400 font-medium">Adapted</span> — modified it, still counts.{' '}
              <span className="text-slate-300 font-medium">Forgive</span> — grace day, streak preserved.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading...</div>
      ) : habits.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-slate-400 text-sm">No habits yet</p>
          <p className="text-slate-500 text-xs mt-1">Add up to 3 habits to start building momentum</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary mt-4 inline-flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            Add first habit
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <div key={habit.id} className="relative group">
              <HabitRow
                habit={habit}
                log={logs.find((l) => l.habit_id === habit.id) ?? null}
                onLog={logHabit}
              />
              <button
                onClick={() => deleteHabit(habit.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                title="Delete habit"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Max 3 hint */}
      {habits.length === 3 && (
        <p className="text-center text-xs text-slate-500 mt-6">
          Three keystone habits is the sweet spot. Quality over quantity.
        </p>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm card p-5 animate-slide-up">
            <h2 className="font-semibold text-slate-100 mb-4">New Habit</h2>

            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Habit name</label>
                <input
                  autoFocus
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning walk"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICONS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIcon(i)}
                      className={`text-xl py-2 rounded-lg transition-all ${icon === i ? 'bg-slate-700 ring-2 ring-teal-500' : 'hover:bg-slate-800'}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1 text-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 text-center disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { addWeeks, subWeeks, parseISO } from 'date-fns'
import { format } from 'date-fns'
import { getWeekStart, getWeekDays } from '../lib/dateUtils'
import { useWeeklyReview, useWeeklyStats } from '../hooks/useWeeklyReview'

export default function WeeklyPage() {
  const [anchor, setAnchor] = useState<string>(() => getWeekStart(new Date()))
  const [intention, setIntention] = useState('')
  const [reflection, setReflection] = useState('')
  const [energy, setEnergy] = useState(3)
  const [saved, setSaved] = useState(false)

  const { review, loading, save } = useWeeklyReview(anchor)
  const { tasksCompleted, tasksTotal, focusMinutes } = useWeeklyStats(anchor)

  const days = getWeekDays(anchor)
  const weekLabel = `${format(days[0], 'MMM d')} – ${format(days[6], 'MMM d, yyyy')}`

  const nav = (dir: 1 | -1) => {
    const base = parseISO(anchor)
    setAnchor(getWeekStart(dir === 1 ? addWeeks(base, 1) : subWeeks(base, 1)))
    setSaved(false)
  }

  const completionPct = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0

  const handleSave = async () => {
    await save({ intention, reflection, energy_level: energy })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => nav(-1)} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-100">Weekly Review</h1>
          <p className="text-sm text-slate-400">{weekLabel}</p>
        </div>
        <button onClick={() => nav(1)} className="btn-ghost p-2"><ChevronRight size={18} /></button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-teal-400">{tasksCompleted}</div>
          <div className="text-xs text-slate-400 mt-1">Tasks done</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-slate-200">{completionPct}%</div>
          <div className="text-xs text-slate-400 mt-1">Completion</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{focusMinutes}</div>
          <div className="text-xs text-slate-400 mt-1">Focus mins</div>
        </div>
      </div>

      {tasksTotal > 0 && (
        <div className="card p-4 mb-5">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Weekly progress</span>
            <span>{tasksCompleted}/{tasksTotal} tasks</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading...</div>
      ) : (
        <div className="card p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">This week's intention</label>
            <textarea
              value={review?.intention ?? intention}
              onChange={e => review ? save({ intention: e.target.value, reflection: review.reflection, energy_level: review.energy_level }) : setIntention(e.target.value)}
              className="input w-full resize-none h-20"
              placeholder="What do you want to focus on this week?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Reflection</label>
            <textarea
              value={review?.reflection ?? reflection}
              onChange={e => review ? save({ intention: review.intention, reflection: e.target.value, energy_level: review.energy_level }) : setReflection(e.target.value)}
              className="input w-full resize-none h-24"
              placeholder="What went well? What was challenging? What did you learn?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Energy level this week</label>
            <div className="flex items-center gap-3">
              {[1,2,3,4,5].map(n => (
                <button key={n}
                  onClick={() => {
                    setEnergy(n)
                    if (review) save({ intention: review.intention, reflection: review.reflection, energy_level: n })
                  }}
                  className={`flex-1 py-3 rounded-xl text-lg transition-all
                    ${(review?.energy_level ?? energy) >= n ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                  {n === 1 ? '😴' : n === 2 ? '😕' : n === 3 ? '😐' : n === 4 ? '😊' : '🔥'}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
              <span>Drained</span><span>Energized</span>
            </div>
          </div>
          {!review && (
            <button onClick={handleSave}
              className={`btn-primary w-full flex items-center justify-center gap-2 ${saved ? 'bg-green-600 hover:bg-green-500' : ''}`}>
              <Save size={16} />{saved ? 'Saved!' : 'Save Review'}
            </button>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 italic">
          "Every week is a new chance to grow. You're doing better than you think."
        </p>
      </div>
    </div>
  )
}

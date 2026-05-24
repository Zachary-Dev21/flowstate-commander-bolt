import { useState } from 'react'
import { Zap, Clock, Music } from 'lucide-react'
import { useFocusSessions } from '../hooks/useFocusSessions'
import { useTasks } from '../hooks/useTasks'
import { formatDate } from '../lib/dateUtils'
import BodyDoubleTimer from '../components/BodyDoubleTimer'
import { FocusSession } from '../types'
import { format } from 'date-fns'

const SOUNDS = [
  { id: 'rain', label: 'Rain', emoji: '🌧️' },
  { id: 'cafe', label: 'Café', emoji: '☕' },
  { id: 'forest', label: 'Forest', emoji: '🌲' },
  { id: 'white', label: 'White Noise', emoji: '🌊' },
  { id: 'none', label: 'Silence', emoji: '🔇' }
]

const DURATIONS = [
  { mins: 15, label: '15 min' }, { mins: 25, label: '25 min' },
  { mins: 45, label: '45 min' }, { mins: 60, label: '60 min' }
]

export default function FocusPage() {
  const today = formatDate(new Date())
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [selectedSound, setSelectedSound] = useState('rain')
  const [selectedDuration, setSelectedDuration] = useState(25)
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null)

  const { sessions, startSession, endSession } = useFocusSessions()
  const { tasks } = useTasks(today)
  const activeTasks = tasks.filter(t => !t.is_buffer && t.status !== 'done' && t.status !== 'skipped')

  const handleStart = async () => {
    const session = await startSession(selectedTaskId || undefined, selectedDuration, selectedSound)
    if (session) setActiveSession(session)
  }

  const handleEnd = async (completed: boolean) => {
    if (activeSession) await endSession(activeSession.id, completed)
    setActiveSession(null)
  }

  const todaySessions = sessions.filter(s => s.started_at.startsWith(today))
  const totalFocusToday = todaySessions.filter(s => s.completed).reduce((sum, s) => sum + s.planned_minutes, 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={20} className="text-teal-400" />
        <h1 className="text-xl font-bold text-slate-100">Focus Sessions</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-teal-400">{totalFocusToday}</div>
          <div className="text-xs text-slate-400 mt-1">Focus mins today</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-slate-200">{todaySessions.length}</div>
          <div className="text-xs text-slate-400 mt-1">Sessions today</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{todaySessions.filter(s => s.completed).length}</div>
          <div className="text-xs text-slate-400 mt-1">Completed</div>
        </div>
      </div>

      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-slate-100 mb-4">Start a Focus Session</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Task (optional)</label>
            <select value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)} className="input w-full">
              <option value="">Free focus</option>
              {activeTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-2"><Clock size={14} />Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map(d => (
                <button key={d.mins} onClick={() => setSelectedDuration(d.mins)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all
                    ${selectedDuration === d.mins ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-400 mb-2"><Music size={14} />Ambient sound</label>
            <div className="flex gap-2 flex-wrap">
              {SOUNDS.map(s => (
                <button key={s.id} onClick={() => setSelectedSound(s.id)}
                  className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-sm transition-all
                    ${selectedSound === s.id ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                  <span>{s.emoji}</span><span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleStart} className="btn-primary w-full flex items-center justify-center gap-2">
            <Zap size={16} />Start Focus Session
          </button>
        </div>
      </div>

      {sessions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {sessions.slice(0, 5).map(s => (
              <div key={s.id} className="card p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.completed ? 'bg-green-400' : 'bg-slate-500'}`} />
                  <div>
                    <p className="text-sm text-slate-200">{s.planned_minutes} min session</p>
                    <p className="text-xs text-slate-500">{format(new Date(s.started_at), 'MMM d, h:mm a')}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${s.completed ? 'text-green-400' : 'text-slate-500'}`}>
                  {s.completed ? 'Done' : 'Ended early'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSession && (
        <BodyDoubleTimer
          session={activeSession}
          taskTitle={activeTasks.find(t => t.id === selectedTaskId)?.title}
          onEnd={handleEnd} />
      )}
    </div>
  )
}

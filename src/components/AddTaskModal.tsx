import { useState } from 'react'
import { X } from 'lucide-react'
import { hourToTime } from '../lib/dateUtils'

interface AddTaskModalProps {
  onAdd: (task: { title: string; start_hour: number; duration_units: number; is_buffer: boolean; status: 'pending'; date: string }) => void
  onClose: () => void
  date: string
  suggestedHour?: number
}

const CONFETTI_LABELS = ['15 min', '30 min', '45 min', '1 hr', '1h 15m', '1h 30m', '1h 45m', '2 hr']

export default function AddTaskModal({ onAdd, onClose, date, suggestedHour = 9 }: AddTaskModalProps) {
  const [title, setTitle] = useState('')
  const [startHour, setStartHour] = useState(suggestedHour)
  const [durationUnits, setDurationUnits] = useState(2)
  const [addBuffer, setAddBuffer] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), start_hour: startHour, duration_units: durationUnits, is_buffer: false, status: 'pending', date })
    if (addBuffer) {
      onAdd({
        title: '',
        start_hour: startHour + durationUnits * 0.25,
        duration_units: 1,
        is_buffer: true,
        status: 'pending',
        date,
      })
    }
    onClose()
  }

  const hours = Array.from({ length: 64 }, (_, i) => 6 + i * 0.25).filter((h) => h <= 22)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm card p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-100">New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Task name</label>
            <input
              autoFocus
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to do?"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Start time</label>
            <select
              className="input"
              value={startHour}
              onChange={(e) => setStartHour(parseFloat(e.target.value))}
            >
              {hours.map((h) => (
                <option key={h} value={h}>{hourToTime(h)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">Time confetti (duration)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {CONFETTI_LABELS.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDurationUnits(i + 1)}
                  className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    durationUnits === i + 1
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              onClick={() => setAddBuffer(!addBuffer)}
              className={`w-9 h-5 rounded-full transition-colors relative ${addBuffer ? 'bg-teal-500' : 'bg-slate-700'}`}
            >
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all ${addBuffer ? 'left-[18px]' : 'left-0.75'}`} style={{ top: '3px', left: addBuffer ? '18px' : '3px' }} />
            </div>
            <span className="text-xs text-slate-300">Auto buffer after task</span>
          </label>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1 text-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 text-center">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { X } from 'lucide-react'
import { Task } from '../types'
import { hourToTime } from '../lib/dateUtils'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6)
const DURATIONS = [
  { value: 1, label: '15 min' }, { value: 2, label: '30 min' },
  { value: 3, label: '45 min' }, { value: 4, label: '1 hour' },
  { value: 6, label: '1.5 hours' }, { value: 8, label: '2 hours' }
]

interface Props {
  date: string
  defaultHour?: number
  onAdd: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'distraction_count' | 'focus_minutes'>) => void
  onClose: () => void
}

export default function AddTaskModal({ date, defaultHour = 9, onAdd, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [startHour, setStartHour] = useState(defaultHour)
  const [durationUnits, setDurationUnits] = useState(4)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), date, start_hour: startHour, duration_units: durationUnits, is_buffer: false, status: 'pending' })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-100">Add Task</h2>
          <button onClick={onClose} className="btn-ghost p-2"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Task name</label>
            <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
              className="input w-full" placeholder="What needs doing?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Start time</label>
              <select value={startHour} onChange={e => setStartHour(Number(e.target.value))} className="input w-full">
                {HOURS.map(h => <option key={h} value={h}>{hourToTime(h)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Duration</label>
              <select value={durationUnits} onChange={e => setDurationUnits(Number(e.target.value))} className="input w-full">
                {DURATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={!title.trim()}>Add Task</button>
          </div>
        </form>
      </div>
    </div>
  )
}

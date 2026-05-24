import { Zap, Clock } from 'lucide-react'
import { Task } from '../types'
import { isTaskCurrent, hourToTime } from '../lib/dateUtils'

interface Props {
  tasks: Task[]
  onFocus: (task: Task) => void
}

export default function NowBlock({ tasks, onFocus }: Props) {
  const currentTask = tasks.find(t => !t.is_buffer && isTaskCurrent(t.start_hour, t.duration_units))
  const nextTask = tasks.find(t => !t.is_buffer && t.status === 'pending' && !isTaskCurrent(t.start_hour, t.duration_units))

  if (!currentTask && !nextTask) return null
  const task = currentTask ?? nextTask!
  const isCurrent = !!currentTask

  return (
    <div className={`card p-4 mb-4 border ${isCurrent ? 'border-teal-600/50 bg-teal-900/20' : 'border-slate-700'}`}>
      <div className="flex items-center gap-2 mb-2">
        {isCurrent ? (
          <><div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-teal-400 uppercase tracking-wide">Now</span></>
        ) : (
          <><Clock size={12} className="text-slate-400" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Up Next</span></>
        )}
        <span className="text-xs text-slate-500 ml-auto">{hourToTime(task.start_hour)}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-medium text-slate-100 flex-1">{task.title}</p>
        {isCurrent && (
          <button onClick={() => onFocus(task)} className="flex items-center gap-1.5 btn-primary ml-3">
            <Zap size={14} />Focus
          </button>
        )}
      </div>
    </div>
  )
}

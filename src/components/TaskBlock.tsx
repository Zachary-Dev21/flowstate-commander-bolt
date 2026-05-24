import { Play, Check, SkipForward, Trash2, Zap } from 'lucide-react'
import { Task } from '../types'
import { formatDuration, isTaskCurrent, isTaskPast } from '../lib/dateUtils'

const SLOT_HEIGHT = 56
const STATUS_COLORS: Record<Task['status'], string> = {
  pending: 'bg-slate-700 border-slate-600',
  active: 'bg-teal-900/60 border-teal-600',
  done: 'bg-slate-800/40 border-slate-700/40',
  skipped: 'bg-slate-800/30 border-slate-700/30'
}

interface Props {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onFocus?: (task: Task) => void
}

export default function TaskBlock({ task, onUpdate, onDelete, onFocus }: Props) {
  const isCurrent = isTaskCurrent(task.start_hour, task.duration_units)
  const isPast = isTaskPast(task.start_hour, task.duration_units)
  const height = (task.duration_units / 4) * SLOT_HEIGHT
  const isActionable = task.status === 'pending' || task.status === 'active'

  if (task.is_buffer) {
    return (
      <div style={{ height: `${height}px` }}
        className="w-full border border-dashed border-slate-700/50 rounded-lg flex items-center px-3 opacity-50">
        <span className="text-xs text-slate-500">buffer</span>
      </div>
    )
  }

  return (
    <div
      style={{ height: `${height}px` }}
      className={`w-full rounded-lg border px-3 py-2 group relative transition-all duration-150
        ${STATUS_COLORS[task.status]}
        ${isCurrent ? 'ring-2 ring-teal-500/50 shadow-lg shadow-teal-500/10' : ''}
        ${isPast && task.status === 'pending' ? 'opacity-60' : ''}
      `}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className={`text-sm font-medium leading-tight truncate
            ${task.status === 'done' ? 'line-through text-slate-500' : ''}
            ${task.status === 'skipped' ? 'text-slate-500' : 'text-slate-100'}
          `}>{task.title}</p>
          {task.duration_units >= 2 && (
            <p className="text-xs text-slate-400 mt-0.5">{formatDuration(task.duration_units)}</p>
          )}
          {isCurrent && task.status === 'active' && (
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-xs text-teal-400">in progress</span>
            </div>
          )}
        </div>

        {isActionable && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
            {task.status === 'pending' && (
              <button onClick={() => onUpdate(task.id, { status: 'active' })}
                className="p-1 hover:bg-teal-600/30 rounded text-teal-400" title="Start">
                <Play size={12} />
              </button>
            )}
            {task.status === 'active' && onFocus && (
              <button onClick={() => onFocus(task)}
                className="p-1 hover:bg-teal-600/30 rounded text-teal-400" title="Focus">
                <Zap size={12} />
              </button>
            )}
            <button onClick={() => onUpdate(task.id, { status: 'done' })}
              className="p-1 hover:bg-green-600/30 rounded text-green-400" title="Done">
              <Check size={12} />
            </button>
            <button onClick={() => onUpdate(task.id, { status: 'skipped' })}
              className="p-1 hover:bg-yellow-600/30 rounded text-yellow-400" title="Skip">
              <SkipForward size={12} />
            </button>
            <button onClick={() => onDelete(task.id)}
              className="p-1 hover:bg-red-600/30 rounded text-red-400" title="Delete">
              <Trash2 size={12} />
            </button>
          </div>
        )}

        {task.status === 'done' && (
          <div className="ml-2 shrink-0"><Check size={14} className="text-green-500" /></div>
        )}
      </div>
    </div>
  )
}

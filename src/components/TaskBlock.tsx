import { useState } from 'react'
import { Check, Trash2, Zap, SkipForward } from 'lucide-react'
import type { Task } from '../types'
import { formatDuration, hourToTime, isTaskPast, isTaskCurrent } from '../lib/dateUtils'

const SLOT_HEIGHT = 56 // px per 15-min unit

interface TaskBlockProps {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onFocus: (task: Task) => void
}

export default function TaskBlock({ task, onUpdate, onDelete, onFocus }: TaskBlockProps) {
  const [hovered, setHovered] = useState(false)
  const isPast = isTaskPast(task.date, task.start_hour, task.duration_units)
  const isCurrent = isTaskCurrent(task.date, task.start_hour, task.duration_units)
  const height = task.duration_units * SLOT_HEIGHT

  if (task.is_buffer) {
    return (
      <div
        style={{ height: `${Math.max(height, 28)}px` }}
        className="w-full rounded-lg border border-dashed border-slate-700/60 bg-slate-900/30 flex items-center px-3 gap-1.5"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        <span className="text-xs text-slate-500">Buffer · {formatDuration(task.duration_units)}</span>
      </div>
    )
  }

  const statusColors = {
    pending: isCurrent
      ? 'border-teal-500/50 bg-teal-900/20 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
      : isPast
      ? 'border-slate-700/40 bg-slate-800/40 opacity-60'
      : 'border-slate-700 bg-slate-800',
    active: 'border-teal-400/60 bg-teal-900/25 shadow-[0_0_16px_rgba(20,184,166,0.2)]',
    done: 'border-emerald-700/40 bg-emerald-900/10 opacity-70',
    skipped: 'border-slate-700/30 bg-slate-900/20 opacity-40',
  }

  return (
    <div
      style={{ height: `${height}px` }}
      className={`w-full rounded-xl border px-3 py-2 flex flex-col justify-between transition-all duration-200 group task-block-enter ${statusColors[task.status]} ${isCurrent ? 'animate-pulse-soft' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-snug truncate ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {task.title}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{hourToTime(task.start_hour)} · {formatDuration(task.duration_units)}</p>
        </div>

        {(hovered || isCurrent) && task.status !== 'done' && (
          <div className="flex items-center gap-1 shrink-0 animate-fade-in">
            {isCurrent && (
              <button
                onClick={() => onFocus(task)}
                className="p-1 rounded-md bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-colors"
                title="Focus now"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onUpdate(task.id, { status: 'done' })}
              className="p-1 rounded-md hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-colors"
              title="Mark done"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onUpdate(task.id, { status: 'skipped' })}
              className="p-1 rounded-md hover:bg-slate-600/40 text-slate-500 hover:text-slate-300 transition-colors"
              title="Skip"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 rounded-md hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {task.status === 'done' && (
          <div className="shrink-0">
            <Check className="w-4 h-4 text-emerald-500" />
          </div>
        )}
      </div>

      {isCurrent && task.status === 'active' && (
        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-teal-500 rounded-full animate-pulse" style={{ width: '40%' }} />
        </div>
      )}
    </div>
  )
}

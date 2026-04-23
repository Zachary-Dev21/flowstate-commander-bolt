import { Zap } from 'lucide-react'
import type { Task } from '../types'
import { hourToTime, formatDuration } from '../lib/dateUtils'

interface NowBlockProps {
  task: Task | null
  onFocus: (task: Task) => void
}

export default function NowBlock({ task, onFocus }: NowBlockProps) {
  if (!task) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-slate-500" />
        </div>
        <div>
          <p className="text-sm text-slate-400">Nothing scheduled right now</p>
          <p className="text-xs text-slate-500 mt-0.5">Enjoy the breathing room</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-teal-900/20 border border-teal-500/30 rounded-xl p-4 flex items-center justify-between gap-3 animate-pulse-soft">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-teal-400" />
        </div>
        <div>
          <p className="text-xs text-teal-400 font-medium uppercase tracking-wider mb-0.5">Now</p>
          <p className="text-sm font-semibold text-slate-100">{task.title}</p>
          <p className="text-xs text-slate-400">{hourToTime(task.start_hour)} · {formatDuration(task.duration_units)}</p>
        </div>
      </div>
      <button
        onClick={() => onFocus(task)}
        className="shrink-0 bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
      >
        Focus
      </button>
    </div>
  )
}

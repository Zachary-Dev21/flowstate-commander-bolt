import { useMemo } from 'react'
import type { Task } from '../types'
import TaskBlock from './TaskBlock'
import { hourToTime } from '../lib/dateUtils'

const SLOT_HEIGHT = 56
const START_HOUR = 6
const END_HOUR = 22
const HOURS = Array.from({ length: (END_HOUR - START_HOUR) * 4 }, (_, i) => START_HOUR + i * 0.25)

interface TimelineProps {
  tasks: Task[]
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onFocus: (task: Task) => void
  onSlotClick: (hour: number) => void
}

export default function Timeline({ tasks, onUpdate, onDelete, onFocus, onSlotClick }: TimelineProps) {
  const tasksBySlot = useMemo(() => {
    const map = new Map<number, Task>()
    for (const task of tasks) {
      map.set(task.start_hour, task)
    }
    return map
  }, [tasks])

  const occupiedSlots = useMemo(() => {
    const set = new Set<number>()
    for (const task of tasks) {
      for (let i = 0; i < task.duration_units; i++) {
        set.add(Math.round((task.start_hour + i * 0.25) * 100) / 100)
      }
    }
    return set
  }, [tasks])

  const renderedHours = new Set<number>()

  return (
    <div className="relative">
      {HOURS.map((hour) => {
        const task = tasksBySlot.get(hour)
        const isFullHour = hour % 1 === 0
        const isHalfHour = hour % 1 === 0.5
        const isOccupied = occupiedSlots.has(Math.round(hour * 100) / 100)

        if (task) renderedHours.add(hour)

        // Skip slots that are occupied by a multi-slot task
        if (!task && isOccupied) return null

        return (
          <div
            key={hour}
            style={{ minHeight: `${SLOT_HEIGHT}px` }}
            className="flex items-start gap-3 group"
          >
            {/* Hour label */}
            <div className="w-14 shrink-0 pt-2 text-right">
              {(isFullHour || isHalfHour) ? (
                <span className={`text-xs ${isFullHour ? 'text-slate-400 font-medium' : 'text-slate-600'}`}>
                  {hourToTime(hour)}
                </span>
              ) : null}
            </div>

            {/* Grid line + content */}
            <div className="flex-1 relative">
              <div className={`absolute top-0 left-0 right-0 border-t ${isFullHour ? 'border-slate-700' : 'border-slate-800'}`} />

              {task ? (
                <div className="pt-1 pb-0.5 pr-1">
                  <TaskBlock
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onFocus={onFocus}
                  />
                </div>
              ) : (
                <button
                  onClick={() => onSlotClick(hour)}
                  style={{ height: `${SLOT_HEIGHT}px` }}
                  className="w-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-slate-600 hover:text-slate-400 hover:bg-slate-800/40 rounded-lg"
                >
                  + Add task
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

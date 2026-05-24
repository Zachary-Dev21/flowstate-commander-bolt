import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Task } from '../../types'
import { hourToTime, currentHour } from '../../lib/dateUtils'
import TaskBlock from '../TaskBlock'
import AddTaskModal from '../AddTaskModal'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6)
const SLOT_HEIGHT = 56

interface Props {
  date: string
  tasks: Task[]
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onAdd: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'distraction_count' | 'focus_minutes'>) => void
  onFocus: (task: Task) => void
}

export default function DayView({ date, tasks, onUpdate, onDelete, onAdd, onFocus }: Props) {
  const [addingAtHour, setAddingAtHour] = useState<number | null>(null)
  const now = currentHour()
  const isToday = date === new Date().toISOString().slice(0, 10)

  return (
    <>
      <div className="relative">
        {HOURS.map(hour => {
          const hourTasks = tasks.filter(t => Math.floor(t.start_hour) === hour)
          const isCurrentHour = isToday && Math.floor(now) === hour
          return (
            <div key={hour} className="flex" style={{ minHeight: `${SLOT_HEIGHT}px` }}>
              <div className="w-16 shrink-0 flex items-start justify-end pr-3 pt-1">
                <span className={`text-xs ${isCurrentHour ? 'text-teal-400 font-medium' : 'text-slate-500'}`}>
                  {hourToTime(hour)}
                </span>
              </div>
              <div className="flex-1 border-t border-slate-800 relative group">
                {isCurrentHour && (
                  <div className="absolute left-0 right-0 z-10 pointer-events-none"
                    style={{ top: `${((now % 1) * SLOT_HEIGHT)}px` }}>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-teal-400 rounded-full -ml-1 shrink-0" />
                      <div className="flex-1 border-t-2 border-teal-400/60" />
                    </div>
                  </div>
                )}
                <div className="py-0.5 px-2 space-y-0.5">
                  {hourTasks.map(task => (
                    <TaskBlock key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} onFocus={onFocus} />
                  ))}
                </div>
                <button onClick={() => setAddingAtHour(hour)}
                  className="absolute right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-slate-300">
                  <Plus size={12} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {addingAtHour !== null && (
        <AddTaskModal date={date} defaultHour={addingAtHour} onAdd={onAdd} onClose={() => setAddingAtHour(null)} />
      )}
    </>
  )
}

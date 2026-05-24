import { Task } from '../../types'
import { hourToTime, formatDate } from '../../lib/dateUtils'
import { format } from 'date-fns'
import TaskBlock from '../TaskBlock'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6)
const SLOT_HEIGHT = 48

interface Props {
  days: Date[]
  tasks: Task[]
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

export default function MultiDayView({ days, tasks, onUpdate, onDelete }: Props) {
  const todayStr = formatDate(new Date())

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: `${days.length * 160 + 64}px` }}>
        <div className="flex sticky top-0 bg-slate-900 z-10 border-b border-slate-800">
          <div className="w-16 shrink-0" />
          {days.map(day => {
            const dateStr = formatDate(day)
            const isToday = dateStr === todayStr
            return (
              <div key={dateStr} className="flex-1 text-center py-2 px-1">
                <div className={`text-xs font-medium uppercase tracking-wide ${isToday ? 'text-teal-400' : 'text-slate-400'}`}>
                  {format(day, 'EEE')}
                </div>
                <div className={`text-sm font-semibold mt-0.5 ${isToday ? 'text-teal-300' : 'text-slate-200'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            )
          })}
        </div>
        {HOURS.map(hour => (
          <div key={hour} className="flex" style={{ minHeight: `${SLOT_HEIGHT}px` }}>
            <div className="w-16 shrink-0 flex items-start justify-end pr-3 pt-1">
              <span className="text-xs text-slate-500">{hourToTime(hour)}</span>
            </div>
            {days.map(day => {
              const dateStr = formatDate(day)
              const hourTasks = tasks.filter(t => t.date === dateStr && Math.floor(t.start_hour) === hour)
              return (
                <div key={dateStr} className="flex-1 border-t border-l border-slate-800 p-0.5 space-y-0.5 overflow-hidden">
                  {hourTasks.map(task => (
                    <TaskBlock key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

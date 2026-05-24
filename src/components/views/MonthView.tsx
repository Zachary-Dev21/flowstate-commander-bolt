import { Task } from '../../types'
import { formatDate } from '../../lib/dateUtils'
import { startOfWeek, addDays, format } from 'date-fns'

interface Props {
  days: Date[]
  tasks: Task[]
  onDayClick: (date: string) => void
}

export default function MonthView({ days, tasks, onDayClick }: Props) {
  const todayStr = formatDate(new Date())
  const gridStart = startOfWeek(days[0], { weekStartsOn: 1 })
  const totalWeeks = Math.ceil((days.length + (days[0].getDay() === 0 ? 6 : days[0].getDay() - 1)) / 7)
  const gridDays = Array.from({ length: totalWeeks * 7 }, (_, i) => addDays(gridStart, i))
  const monthDates = new Set(days.map(d => formatDate(d)))

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-slate-800">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} className="py-2 text-center text-xs font-medium text-slate-400 uppercase tracking-wide">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {gridDays.map((day, i) => {
          const dateStr = formatDate(day)
          const isToday = dateStr === todayStr
          const inMonth = monthDates.has(dateStr)
          const dayTasks = tasks.filter(t => t.date === dateStr && !t.is_buffer)
          const done = dayTasks.filter(t => t.status === 'done').length
          return (
            <div key={i} onClick={() => onDayClick(dateStr)}
              className={`min-h-[96px] border-b border-r border-slate-800 p-1.5 cursor-pointer transition-colors hover:bg-slate-800/50 ${!inMonth ? 'opacity-30' : ''}`}>
              <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-1
                ${isToday ? 'bg-teal-500 text-white' : 'text-slate-300'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className={`text-xs truncate px-1 py-0.5 rounded
                    ${task.status === 'done' ? 'bg-green-900/30 text-green-400' :
                      task.status === 'active' ? 'bg-teal-900/30 text-teal-400' : 'bg-slate-700 text-slate-300'}`}>
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && <div className="text-xs text-slate-500 px-1">+{dayTasks.length - 3} more</div>}
              </div>
              {done > 0 && dayTasks.length > 0 && (
                <div className="mt-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(done / dayTasks.length) * 100}%` }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

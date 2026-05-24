import { format, startOfWeek, addDays } from 'date-fns'

export function formatDate(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

export function getWeekStart(date: Date): string {
  return formatDate(startOfWeek(date, { weekStartsOn: 1 }))
}

export function getWeekDays(weekStart: string): Date[] {
  const start = new Date(weekStart + 'T00:00:00')
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function hourToTime(hour: number): string {
  const h = Math.floor(hour)
  const m = (hour % 1) * 60
  const period = h >= 12 ? 'PM' : 'AM'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${displayH} ${period}` : `${displayH}:${String(m).padStart(2, '0')} ${period}`
}

export function formatDuration(units: number): string {
  const minutes = units * 15
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function isTaskCurrent(startHour: number, durationUnits: number): boolean {
  const now = new Date()
  const cur = now.getHours() + now.getMinutes() / 60
  const end = startHour + (durationUnits * 15) / 60
  return cur >= startHour && cur < end
}

export function isTaskPast(startHour: number, durationUnits: number): boolean {
  const now = new Date()
  const cur = now.getHours() + now.getMinutes() / 60
  const end = startHour + (durationUnits * 15) / 60
  return cur >= end
}

export const currentHour = (): number => {
  const now = new Date()
  return now.getHours() + now.getMinutes() / 60
}

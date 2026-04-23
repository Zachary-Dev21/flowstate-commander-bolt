import { format, startOfWeek, addDays, parseISO, isToday, isBefore, isAfter } from 'date-fns'

export const todayStr = () => format(new Date(), 'yyyy-MM-dd')

export const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')

export const getWeekStart = (date: Date = new Date()) =>
  format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd')

export const getWeekDays = (weekStart: string) =>
  Array.from({ length: 7 }, (_, i) => addDays(parseISO(weekStart), i))

export const hourToTime = (hour: number): string => {
  const h = Math.floor(hour)
  const m = (hour % 1) * 60
  const ampm = h < 12 ? 'AM' : 'PM'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${displayH}:${m === 0 ? '00' : m} ${ampm}`
}

export const currentHour = (): number => {
  const now = new Date()
  return now.getHours() + now.getMinutes() / 60
}

export const isTaskPast = (taskDate: string, startHour: number, durationUnits: number): boolean => {
  if (!isToday(parseISO(taskDate))) return isBefore(parseISO(taskDate), new Date())
  return currentHour() > startHour + durationUnits * 0.25
}

export const isTaskCurrent = (taskDate: string, startHour: number, durationUnits: number): boolean => {
  if (!isToday(parseISO(taskDate))) return false
  const now = currentHour()
  return now >= startHour && now < startHour + durationUnits * 0.25
}

export const formatDuration = (units: number): string => {
  const totalMinutes = units * 15
  if (totalMinutes < 60) return `${totalMinutes}m`
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export { isToday, isBefore, isAfter, parseISO, format, addDays }

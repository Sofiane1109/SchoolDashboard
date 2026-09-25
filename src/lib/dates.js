import { differenceInCalendarDays, format, parseISO } from 'date-fns'

export const toISODate = (date) => format(date, 'yyyy-MM-dd')
export const todayISO = () => toISODate(new Date())

export const formatDate = (iso, pattern = 'MMM d, yyyy') => format(parseISO(iso), pattern)

export const daysUntil = (iso) => differenceInCalendarDays(parseISO(iso), new Date())

export function relativeDue(iso) {
  const d = daysUntil(iso)
  if (d === 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  if (d === -1) return 'Yesterday'
  if (d < 0) return `${-d} days ago`
  if (d < 7) return `In ${d} days`
  return formatDate(iso, 'MMM d')
}

export const isOverdue = (assignment) => assignment.status !== 'done' && daysUntil(assignment.due_date) < 0

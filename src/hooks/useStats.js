import { useMemo } from 'react'
import { daysUntil, isOverdue } from '../lib/dates'

export function useStats(assignments, courses) {
  return useMemo(() => {
    const total = assignments.length
    const done = assignments.filter((a) => a.status === 'done').length
    const inProgress = assignments.filter((a) => a.status === 'in_progress').length
    const pending = total - done
    const overdue = assignments.filter(isOverdue).length
    const completion = total ? Math.round((done / total) * 100) : 0

    const upcoming = assignments
      .filter((a) => a.status !== 'done')
      .filter((a) => {
        const d = daysUntil(a.due_date)
        return d >= 0 && d <= 7
      })

    const perCourse = courses.map((c) => {
      const list = assignments.filter((a) => a.course_id === c.id)
      const finished = list.filter((a) => a.status === 'done').length
      return { course: c, total: list.length, done: finished, pct: list.length ? Math.round((finished / list.length) * 100) : 0 }
    })

    return { total, done, inProgress, pending, overdue, completion, upcoming, perCourse }
  }, [assignments, courses])
}

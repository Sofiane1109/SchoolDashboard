import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRIORITY_RANK } from '../lib/constants'

// Filters live in the URL (?status=todo&priority=high&course=<id>) so views are shareable.
export function useAssignmentFilters(assignments) {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? 'all'
  const priority = params.get('priority') ?? 'all'
  const course = params.get('course') ?? 'all'

  const setFilter = (key, value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value === 'all') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  }

  const reset = () => setParams({}, { replace: true })

  const filtered = useMemo(
    () =>
      assignments
        .filter((a) => status === 'all' || a.status === status)
        .filter((a) => priority === 'all' || a.priority === priority)
        .filter((a) => course === 'all' || a.course_id === course)
        .sort(
          (a, b) =>
            (a.status === 'done') - (b.status === 'done') ||
            a.due_date.localeCompare(b.due_date) ||
            PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
        ),
    [assignments, status, priority, course],
  )

  const isFiltered = status !== 'all' || priority !== 'all' || course !== 'all'

  return { filtered, status, priority, course, setFilter, reset, isFiltered }
}

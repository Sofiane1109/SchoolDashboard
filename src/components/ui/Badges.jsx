import { priorityMeta, statusMeta } from '../../lib/constants'

const base = 'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold'

export function StatusBadge({ status }) {
  const { label, icon: Icon, badge } = statusMeta(status)
  return (
    <span className={`${base} ${badge}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const { label, icon: Icon, badge } = priorityMeta(priority)
  return (
    <span className={`${base} ${badge}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}

export function CourseTag({ course }) {
  if (!course) return <span className="text-xs muted">No course</span>
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: course.color }} aria-hidden="true" />
      <span className="truncate">{course.name}</span>
    </span>
  )
}

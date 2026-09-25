import { AlertCircle, CalendarClock, Pencil, Trash2 } from 'lucide-react'
import { CourseTag, PriorityBadge } from '../ui/Badges'
import { STATUSES, statusMeta } from '../../lib/constants'
import { formatDate, isOverdue, relativeDue } from '../../lib/dates'

export default function AssignmentRow({ assignment, course, onStatusChange, onEdit, onDelete }) {
  const overdue = isOverdue(assignment)
  const done = assignment.status === 'done'
  const StatusIcon = statusMeta(assignment.status).icon

  return (
    <li className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <CourseTag course={course} />
          <PriorityBadge priority={assignment.priority} />
        </div>
        <h3 className={`mt-1.5 font-sans font-semibold ${done ? 'text-slate-500 line-through dark:text-slate-500' : ''}`}>{assignment.title}</h3>
        {assignment.description && <p className="mt-0.5 line-clamp-2 text-sm muted">{assignment.description}</p>}
        <p className={`mt-1.5 flex items-center gap-1.5 text-sm ${overdue ? 'font-semibold text-rose-700 dark:text-rose-400' : 'muted'}`}>
          {overdue ? <AlertCircle className="h-4 w-4" aria-hidden="true" /> : <CalendarClock className="h-4 w-4" aria-hidden="true" />}
          <time dateTime={assignment.due_date} title={formatDate(assignment.due_date, 'EEEE, MMMM d, yyyy')}>
            {overdue ? 'Overdue · ' : ''}
            {relativeDue(assignment.due_date)}
          </time>
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="relative flex-1 sm:flex-none">
          <StatusIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 muted" aria-hidden="true" />
          <label htmlFor={`status-${assignment.id}`} className="sr-only">
            Status of {assignment.title}
          </label>
          <select id={`status-${assignment.id}`} className="input cursor-pointer pl-9 sm:w-36" value={assignment.status} onChange={(e) => onStatusChange(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="icon-btn" onClick={onEdit} aria-label={`Edit ${assignment.title}`}>
          <Pencil className="h-5 w-5" />
        </button>
        <button type="button" className="icon-btn hover:text-rose-600 dark:hover:text-rose-400" onClick={onDelete} aria-label={`Delete ${assignment.title}`}>
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </li>
  )
}

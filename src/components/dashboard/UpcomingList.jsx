import { Link } from 'react-router-dom'
import { ArrowRight, PartyPopper } from 'lucide-react'
import { CourseTag, PriorityBadge } from '../ui/Badges'
import { daysUntil, relativeDue } from '../../lib/dates'

export default function UpcomingList({ items, courseMap }) {
  return (
    <section className="card flex flex-col p-4 sm:p-5" aria-labelledby="upcoming-title">
      <div className="flex items-center justify-between gap-2">
        <h2 id="upcoming-title" className="text-base font-semibold">
          Due in the next 7 days
        </h2>
        <Link to="/assignments" className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary-700 hover:underline dark:text-primary-300">
          All assignments <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center text-sm muted">
          <PartyPopper className="mb-2 h-6 w-6" aria-hidden="true" />
          Nothing due this week.
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {items.slice(0, 6).map((a) => {
            const urgent = daysUntil(a.due_date) <= 1
            return (
              <li key={a.id} className="flex items-center gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <CourseTag course={courseMap.get(a.course_id)} />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <time dateTime={a.due_date} className={`text-xs font-semibold ${urgent ? 'text-accent-700 dark:text-accent-400' : 'muted'}`}>
                    {relativeDue(a.due_date)}
                  </time>
                  <PriorityBadge priority={a.priority} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

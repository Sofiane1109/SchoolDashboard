import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { StatusBadge } from '../ui/Badges'

export default function TodayTasks({ tasks, onToggle }) {
  const done = tasks.filter((t) => t.status === 'done').length
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <section className="card flex flex-col p-4 sm:p-5" aria-labelledby="today-title">
      <div className="flex items-center justify-between gap-2">
        <h2 id="today-title" className="text-base font-semibold">
          Today's tasks
        </h2>
        <Link to="/todo" className="inline-flex items-center gap-1 rounded text-sm font-medium text-primary-700 hover:underline dark:text-primary-300">
          Open board <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {tasks.length > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs muted">
            <span>Progress</span>
            <span className="font-display tabular-nums font-semibold text-slate-900 dark:text-slate-100">
              {done}/{tasks.length}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Today's tasks completed">
            <div className="h-full rounded-full bg-primary-600 transition-[width] duration-300 dark:bg-primary-400" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="py-8 text-center text-sm muted">
          Nothing planned for today.{' '}
          <Link to="/todo" className="font-medium text-primary-700 hover:underline dark:text-primary-300">
            Add a task
          </Link>
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.map((t) => {
            const isDone = t.status === 'done'
            return (
              <li key={t.id} className="flex items-center gap-3 py-1">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isDone}
                  aria-label={`Mark “${t.title}” as ${isDone ? 'to do' : 'done'}`}
                  onClick={() => onToggle(t)}
                  className="-ml-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
                      isDone ? 'border-primary-600 bg-primary-600 text-white dark:border-primary-400 dark:bg-primary-400 dark:text-slate-950' : 'border-slate-400 dark:border-slate-600'
                    }`}
                  >
                    {isDone && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </button>
                <span className={`min-w-0 flex-1 truncate text-sm ${isDone ? 'text-slate-500 line-through' : ''}`}>{t.title}</span>
                <StatusBadge status={t.status} />
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

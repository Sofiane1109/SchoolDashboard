export default function CourseProgress({ rows }) {
  if (rows.length === 0) return null
  return (
    <section className="card p-4 sm:p-5" aria-labelledby="progress-title">
      <h2 id="progress-title" className="text-base font-semibold">
        Progress by course
      </h2>
      <ul className="mt-4 grid gap-x-8 gap-y-4 md:grid-cols-2">
        {rows.map(({ course, total, done, pct }) => (
          <li key={course.id}>
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2 font-medium">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: course.color }} aria-hidden="true" />
                <span className="truncate">{course.name}</span>
              </span>
              <span className="shrink-0 muted">
                <span className="font-display tabular-nums font-semibold text-slate-900 dark:text-slate-100">{pct}%</span> · {done}/{total}
              </span>
            </div>
            <div
              className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${course.name}: ${done} of ${total} assignments done`}
            >
              <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${pct}%`, backgroundColor: course.color }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

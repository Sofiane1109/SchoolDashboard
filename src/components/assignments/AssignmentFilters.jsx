import { RotateCcw } from 'lucide-react'
import { PRIORITIES, STATUSES } from '../../lib/constants'

function ChipGroup({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="w-full text-xs font-semibold uppercase tracking-wide muted sm:w-auto">{label}</span>
      {[{ value: 'all', label: 'All' }, ...options].map((o) => {
        const Icon = o.icon
        return (
          <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)} className={value === o.value ? 'chip-on' : 'chip-off'}>
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export default function AssignmentFilters({ status, priority, course, courses, setFilter, reset, isFiltered, count }) {
  return (
    <section aria-label="Filters" className="card mb-4 space-y-3 p-4">
      <ChipGroup label="Status" options={STATUSES} value={status} onChange={(v) => setFilter('status', v)} />
      <ChipGroup label="Priority" options={PRIORITIES} value={priority} onChange={(v) => setFilter('priority', v)} />
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="filter-course" className="text-xs font-semibold uppercase tracking-wide muted">
            Course
          </label>
          <select id="filter-course" className="input w-auto min-w-[180px]" value={course} onChange={(e) => setFilter('course', e.target.value)}>
            <option value="all">All courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-sm muted" aria-live="polite">
            {count} assignment{count === 1 ? '' : 's'}
          </span>
          {isFiltered && (
            <button type="button" className="btn-secondary min-h-[36px] px-3" onClick={reset}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

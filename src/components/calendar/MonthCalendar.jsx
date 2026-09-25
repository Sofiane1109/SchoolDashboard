import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from 'date-fns'
import { toISODate, todayISO } from '../../lib/dates'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function MonthCalendar({ month, selected, onSelect, byDay, courseMap }) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })
  const today = todayISO()

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold uppercase tracking-wide muted">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const iso = toISODate(day)
          const items = byDay.get(iso) ?? []
          const pending = items.filter((a) => a.status !== 'done').length
          const inMonth = isSameMonth(day, month)
          const isSelected = iso === selected
          const isToday = iso === today
          const courseColors = [...new Set(items.map((a) => courseMap.get(a.course_id)?.color).filter(Boolean))].slice(0, 3)
          const label = `${format(day, 'EEEE, MMMM d')}, ${items.length} assignment${items.length === 1 ? '' : 's'}`

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              aria-label={label}
              aria-pressed={isSelected}
              className={`relative flex min-h-[56px] cursor-pointer flex-col items-center gap-1 border-b border-r border-slate-100 p-1.5 text-sm transition-colors duration-200 focus-visible:z-10 dark:border-slate-800/70 sm:min-h-[96px] sm:items-start sm:p-2 [&:nth-child(7n)]:border-r-0 ${
                isSelected ? 'bg-primary-50 dark:bg-primary-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              } ${inMonth ? '' : 'text-slate-400 dark:text-slate-600'}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full font-display tabular-nums text-sm ${
                  isToday ? 'bg-primary-600 font-bold text-white dark:bg-primary-400 dark:text-slate-950' : isSelected ? 'font-bold text-primary-800 dark:text-primary-300' : ''
                }`}
              >
                {format(day, 'd')}
              </span>
              {items.length > 0 && (
                <>
                  <span
                    className={`rounded-md px-1.5 font-display tabular-nums text-[11px] font-semibold sm:text-xs ${
                      pending > 0 ? 'bg-accent-600 text-white dark:bg-accent-400 dark:text-slate-950' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
                    }`}
                  >
                    {items.length}
                    <span className="hidden sm:inline"> due</span>
                  </span>
                  <span className="hidden gap-1 sm:flex" aria-hidden="true">
                    {courseColors.map((c) => (
                      <span key={c} className="h-2 w-2 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

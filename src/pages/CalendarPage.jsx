import { useMemo, useState } from 'react'
import { addMonths, format, parseISO, startOfMonth } from 'date-fns'
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Spinner from '../components/ui/Spinner'
import MonthCalendar from '../components/calendar/MonthCalendar'
import AssignmentFormModal from '../components/assignments/AssignmentFormModal'
import { CourseTag, PriorityBadge, StatusBadge } from '../components/ui/Badges'
import { useCourseMap, useData } from '../hooks/useData'
import { formatDate, todayISO } from '../lib/dates'

export default function CalendarPage() {
  const { assignments, loading } = useData()
  const courseMap = useCourseMap()
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [selected, setSelected] = useState(todayISO)
  const [creating, setCreating] = useState(false)

  const byDay = useMemo(() => {
    const map = new Map()
    for (const a of assignments) map.set(a.due_date, [...(map.get(a.due_date) ?? []), a])
    return map
  }, [assignments])

  const monthKey = format(month, 'yyyy-MM')
  const monthCount = assignments.filter((a) => a.due_date.startsWith(monthKey)).length
  const dayItems = byDay.get(selected) ?? []

  const goToday = () => {
    setMonth(startOfMonth(new Date()))
    setSelected(todayISO())
  }

  const select = (iso) => {
    setSelected(iso)
    const m = startOfMonth(parseISO(iso))
    if (m.getTime() !== month.getTime()) setMonth(m)
  }

  return (
    <>
      <PageHeader title="Calendar" subtitle={`${monthCount} assignment${monthCount === 1 ? '' : 's'} this month`} />

      <div className="mb-4 flex items-center gap-1">
        <button type="button" className="icon-btn" onClick={() => setMonth((m) => addMonths(m, -1))} aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="min-w-[160px] text-center text-lg font-semibold capitalize" aria-live="polite">
          {format(month, 'MMMM yyyy')}
        </h2>
        <button type="button" className="icon-btn" onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </button>
        <button type="button" className="btn-secondary ml-2 min-h-[36px] px-3" onClick={goToday}>
          Today
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <MonthCalendar month={month} selected={selected} onSelect={select} byDay={byDay} courseMap={courseMap} />

          <aside className="card p-4" aria-label="Assignments for the selected day">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-sans font-semibold capitalize">{formatDate(selected, 'EEEE, MMMM d')}</h2>
              <button type="button" className="icon-btn -mr-2" onClick={() => setCreating(true)} aria-label="Add an assignment on this date">
                <CalendarPlus className="h-5 w-5" />
              </button>
            </div>
            {dayItems.length === 0 ? (
              <p className="py-6 text-center text-sm muted">No assignments on this day.</p>
            ) : (
              <ul className="space-y-2">
                {dayItems.map((a) => (
                  <li key={a.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                    <CourseTag course={courseMap.get(a.course_id)} />
                    <p className={`mt-1 font-medium ${a.status === 'done' ? 'text-slate-500 line-through' : ''}`}>{a.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatusBadge status={a.status} />
                      <PriorityBadge priority={a.priority} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}

      {creating && <AssignmentFormModal defaults={{ due_date: selected }} onClose={() => setCreating(false)} />}
    </>
  )
}

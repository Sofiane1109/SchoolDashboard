import { useMemo } from 'react'
import { AlertTriangle, CheckCircle2, ClipboardList, Timer } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import TodayTasks from '../components/dashboard/TodayTasks'
import UpcomingList from '../components/dashboard/UpcomingList'
import CourseProgress from '../components/dashboard/CourseProgress'
import Spinner from '../components/ui/Spinner'
import { useCourseMap, useData } from '../hooks/useData'
import { useStats } from '../hooks/useStats'
import { formatDate, todayISO } from '../lib/dates'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { assignments, courses, dailyTasks, loading, updateTask } = useData()
  const courseMap = useCourseMap()
  const stats = useStats(assignments, courses)
  const today = todayISO()

  const todayTasks = useMemo(
    () => dailyTasks.filter((t) => t.task_date === today).sort((a, b) => a.position - b.position),
    [dailyTasks, today],
  )

  const toggle = (task) => updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' }).catch(() => {})

  return (
    <>
      <header className="mb-6">
        <p className="text-sm font-medium capitalize muted">{formatDate(today, 'EEEE, MMMM d, yyyy')}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{greeting()}!</h1>
      </header>

      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard label="Pending" value={stats.pending} hint={`${stats.upcoming.length} due this week`} icon={ClipboardList} to="/assignments?status=todo" />
            <StatCard label="In progress" value={stats.inProgress} hint="assignments started" icon={Timer} tone="amber" to="/assignments?status=in_progress" />
            <StatCard label="Overdue" value={stats.overdue} hint={stats.overdue ? 'catch up soon' : 'all caught up'} icon={AlertTriangle} tone="rose" to="/assignments" />
            <StatCard label="Completion" value={`${stats.completion}%`} hint={`${stats.done}/${stats.total} assignments done`} icon={CheckCircle2} tone="emerald" to="/assignments?status=done" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TodayTasks tasks={todayTasks} onToggle={toggle} />
            <UpcomingList items={stats.upcoming} courseMap={courseMap} />
          </div>

          <CourseProgress rows={stats.perCourse} />
        </div>
      )}
    </>
  )
}

import { useMemo, useState } from 'react'
import { addDays, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Spinner from '../components/ui/Spinner'
import Board from '../components/board/Board'
import { useData } from '../hooks/useData'
import { formatDate, toISODate, todayISO } from '../lib/dates'

export default function DailyBoardPage() {
  const { dailyTasks, loading, addTask, updateTask, deleteTask } = useData()
  const [date, setDate] = useState(todayISO)
  const [title, setTitle] = useState('')

  const tasks = useMemo(
    () => dailyTasks.filter((t) => t.task_date === date).sort((a, b) => a.position - b.position),
    [dailyTasks, date],
  )

  const nextPosition = (status) => Math.max(0, ...tasks.filter((t) => t.status === status).map((t) => t.position)) + 1
  const shift = (n) => setDate((d) => toISODate(addDays(parseISO(d), n)))
  const isToday = date === todayISO()

  const submit = async (e) => {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    setTitle('')
    try {
      await addTask({ title: value, status: 'todo', task_date: date, position: nextPosition('todo') })
    } catch {
      setTitle(value)
    }
  }

  const move = (task, status) => updateTask(task.id, { status, position: nextPosition(status) }).catch(() => {})
  const remove = (task) => deleteTask(task.id).catch(() => {})

  const done = tasks.filter((t) => t.status === 'done').length

  return (
    <>
      <PageHeader title="Daily to-do" subtitle="Drag your tasks between columns as your day goes on." />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-1">
          <button type="button" className="icon-btn" onClick={() => shift(-1)} aria-label="Previous day">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="min-w-[180px] text-center font-semibold capitalize" aria-live="polite">
            {formatDate(date, 'EEEE, MMMM d')}
          </p>
          <button type="button" className="icon-btn" onClick={() => shift(1)} aria-label="Next day">
            <ChevronRight className="h-5 w-5" />
          </button>
          {!isToday && (
            <button type="button" className="btn-secondary ml-2 min-h-[36px] px-3" onClick={() => setDate(todayISO())}>
              Today
            </button>
          )}
          <span className="ml-auto text-sm muted lg:ml-4">
            <span className="font-display tabular-nums font-semibold text-slate-900 dark:text-slate-100">{done}</span>/{tasks.length} done
          </span>
        </div>

        <form onSubmit={submit} className="flex gap-2 lg:w-96">
          <label htmlFor="new-task" className="sr-only">
            New task
          </label>
          <input id="new-task" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a task…" maxLength={200} />
          <button type="submit" className="btn-cta shrink-0 px-3" disabled={!title.trim()} aria-label="Add task">
            <Plus className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </form>
      </div>

      {loading ? <Spinner /> : <Board tasks={tasks} onMove={move} onDelete={remove} />}
    </>
  )
}

import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { assignmentsApi, coursesApi, dailyTasksApi, isDemoMode } from '../services/api'

export const DataContext = createContext(null)

const byDueDate = (a, b) => a.due_date.localeCompare(b.due_date)

export function DataProvider({ children }) {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [dailyTasks, setDailyTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [c, a, t] = await Promise.all([coursesApi.list(), assignmentsApi.list(), dailyTasksApi.list()])
      setCourses(c)
      setAssignments(a)
      setDailyTasks(t)
    } catch (e) {
      setError(`Could not load data: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  // Runs a mutation; on failure shows the error and restores the previous state.
  const run = useCallback(async (fn, rollback) => {
    try {
      return await fn()
    } catch (e) {
      rollback?.()
      setError(e.message)
      throw e
    }
  }, [])

  const actions = useMemo(
    () => ({
      async addCourse(course) {
        const created = await run(() => coursesApi.create(course))
        setCourses((prev) => [...prev, created])
      },
      async deleteCourse(id) {
        const prevCourses = courses
        const prevAssignments = assignments
        setCourses((p) => p.filter((c) => c.id !== id))
        setAssignments((p) => p.filter((a) => a.course_id !== id))
        await run(
          () => coursesApi.remove(id),
          () => {
            setCourses(prevCourses)
            setAssignments(prevAssignments)
          },
        )
      },

      async addAssignment(assignment) {
        const created = await run(() => assignmentsApi.create(assignment))
        setAssignments((prev) => [...prev, created].sort(byDueDate))
      },
      async updateAssignment(id, patch) {
        const prev = assignments
        setAssignments((p) => p.map((a) => (a.id === id ? { ...a, ...patch } : a)).sort(byDueDate))
        await run(() => assignmentsApi.update(id, patch), () => setAssignments(prev))
      },
      async deleteAssignment(id) {
        const prev = assignments
        setAssignments((p) => p.filter((a) => a.id !== id))
        await run(() => assignmentsApi.remove(id), () => setAssignments(prev))
      },

      async addTask(task) {
        const created = await run(() => dailyTasksApi.create(task))
        setDailyTasks((prev) => [...prev, created])
      },
      async updateTask(id, patch) {
        const prev = dailyTasks
        setDailyTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)))
        await run(() => dailyTasksApi.update(id, patch), () => setDailyTasks(prev))
      },
      async deleteTask(id) {
        const prev = dailyTasks
        setDailyTasks((p) => p.filter((t) => t.id !== id))
        await run(() => dailyTasksApi.remove(id), () => setDailyTasks(prev))
      },
    }),
    [run, courses, assignments, dailyTasks],
  )

  const value = useMemo(
    () => ({
      courses,
      assignments,
      dailyTasks,
      loading,
      error,
      clearError: () => setError(null),
      reload,
      isDemoMode,
      ...actions,
    }),
    [courses, assignments, dailyTasks, loading, error, reload, actions],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

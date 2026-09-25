import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Plus, Trash2, User } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Spinner from '../components/ui/Spinner'
import CourseFormModal from '../components/courses/CourseFormModal'
import { useData } from '../hooks/useData'

export default function CoursesPage() {
  const { courses, assignments, deleteCourse, loading } = useData()
  const [formOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  const countFor = (id) => {
    const list = assignments.filter((a) => a.course_id === id)
    return { total: list.length, open: list.filter((a) => a.status !== 'done').length }
  }

  const newButton = (
    <button type="button" className="btn-cta" onClick={() => setFormOpen(true)}>
      <Plus className="h-4 w-4" aria-hidden="true" />
      New course
    </button>
  )

  return (
    <>
      <PageHeader title="Courses" subtitle="Organize your subjects with a color for each course." action={courses.length > 0 && newButton} />

      {loading ? (
        <Spinner />
      ) : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet" message="Add your first course to start attaching assignments to it." action={newButton} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const { total, open } = countFor(course.id)
            return (
              <li key={course.id} className="card flex overflow-hidden">
                <div className="w-2 shrink-0" style={{ backgroundColor: course.color }} aria-hidden="true" />
                <div className="flex min-w-0 flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-semibold">{course.name}</h2>
                      {course.teacher && (
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm muted">
                          <User className="h-4 w-4" aria-hidden="true" />
                          {course.teacher}
                        </p>
                      )}
                    </div>
                    <button type="button" className="icon-btn -mr-2 -mt-2 hover:text-rose-600 dark:hover:text-rose-400" onClick={() => setToDelete(course)} aria-label={`Delete course ${course.name}`}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="muted">
                      <span className="font-display tabular-nums font-semibold text-slate-900 dark:text-slate-100">{open}</span> open · {total} total
                    </span>
                    <Link to={`/assignments?course=${course.id}`} className="rounded font-medium text-primary-700 hover:underline dark:text-primary-300">
                      View assignments
                    </Link>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <CourseFormModal open={formOpen} onClose={() => setFormOpen(false)} />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteCourse(toDelete.id)}
        title="Delete this course?"
        message={toDelete && `“${toDelete.name}” and its ${countFor(toDelete.id).total} assignment(s) will be permanently deleted.`}
      />
    </>
  )
}

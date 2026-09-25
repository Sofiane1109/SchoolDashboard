import { useState } from 'react'
import { ClipboardList, Plus, SearchX } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Spinner from '../components/ui/Spinner'
import AssignmentFilters from '../components/assignments/AssignmentFilters'
import AssignmentRow from '../components/assignments/AssignmentRow'
import AssignmentFormModal from '../components/assignments/AssignmentFormModal'
import { useCourseMap, useData } from '../hooks/useData'
import { useAssignmentFilters } from '../hooks/useAssignmentFilters'

export default function AssignmentsPage() {
  const { assignments, courses, loading, updateAssignment, deleteAssignment } = useData()
  const courseMap = useCourseMap()
  const filters = useAssignmentFilters(assignments)
  const [form, setForm] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const openCreate = () =>
    setForm({ assignment: null, defaults: filters.course !== 'all' ? { course_id: filters.course } : undefined })

  const newButton = (
    <button type="button" className="btn-cta" onClick={openCreate}>
      <Plus className="h-4 w-4" aria-hidden="true" />
      New assignment
    </button>
  )

  let content
  if (loading) content = <Spinner />
  else if (assignments.length === 0)
    content = <EmptyState icon={ClipboardList} title="No assignments yet" message="Add your assignments with a due date and a priority." action={newButton} />
  else if (filters.filtered.length === 0)
    content = (
      <EmptyState
        icon={SearchX}
        title="No results"
        message="No assignments match these filters."
        action={
          <button type="button" className="btn-secondary" onClick={filters.reset}>
            Reset filters
          </button>
        }
      />
    )
  else
    content = (
      <ul className="space-y-3">
        {filters.filtered.map((a) => (
          <AssignmentRow
            key={a.id}
            assignment={a}
            course={courseMap.get(a.course_id)}
            onStatusChange={(status) => updateAssignment(a.id, { status }).catch(() => {})}
            onEdit={() => setForm({ assignment: a })}
            onDelete={() => setToDelete(a)}
          />
        ))}
      </ul>
    )

  return (
    <>
      <PageHeader title="Assignments" subtitle="Track your due dates, priorities and progress." action={newButton} />
      {assignments.length > 0 && <AssignmentFilters {...filters} courses={courses} count={filters.filtered.length} />}
      {content}

      {form && <AssignmentFormModal assignment={form.assignment} defaults={form.defaults} onClose={() => setForm(null)} />}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={() => deleteAssignment(toDelete.id)}
        title="Delete this assignment?"
        message={toDelete && `“${toDelete.title}” will be permanently deleted.`}
      />
    </>
  )
}

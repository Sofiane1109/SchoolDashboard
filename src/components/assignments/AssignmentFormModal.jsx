import { useState } from 'react'
import Modal from '../ui/Modal'
import { PRIORITIES, STATUSES } from '../../lib/constants'
import { todayISO } from '../../lib/dates'
import { useData } from '../../hooks/useData'

// Mount only while open: initial state comes from `assignment` (edit) or defaults (create).
export default function AssignmentFormModal({ assignment, defaults, onClose }) {
  const { courses, addAssignment, updateAssignment } = useData()
  const editing = Boolean(assignment)
  const [form, setForm] = useState(() => ({
    title: assignment?.title ?? '',
    description: assignment?.description ?? '',
    course_id: assignment?.course_id ?? defaults?.course_id ?? courses[0]?.id ?? '',
    due_date: assignment?.due_date ?? defaults?.due_date ?? todayISO(),
    priority: assignment?.priority ?? 'medium',
    status: assignment?.status ?? 'todo',
  }))
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.due_date) return
    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim() || null,
      course_id: form.course_id || null,
    }
    setBusy(true)
    try {
      if (editing) await updateAssignment(assignment.id, payload)
      else await addAssignment(payload)
      onClose()
    } catch {
      // Error banner is shown by DataContext.
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Edit assignment' : 'New assignment'}
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="assignment-form" className="btn-primary" disabled={busy || !form.title.trim()}>
            {busy ? 'Saving…' : editing ? 'Save' : 'Create assignment'}
          </button>
        </>
      }
    >
      <form id="assignment-form" onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="a-title" className="label">
            Title
          </label>
          <input id="a-title" className="input" value={form.title} onChange={set('title')} maxLength={200} required placeholder="e.g. Chapter 4 exercises" />
        </div>
        <div>
          <label htmlFor="a-desc" className="label">
            Description <span className="font-normal muted">(optional)</span>
          </label>
          <textarea id="a-desc" className="input min-h-[80px] py-2" value={form.description} onChange={set('description')} rows={3} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="a-course" className="label">
              Course
            </label>
            <select id="a-course" className="input" value={form.course_id} onChange={set('course_id')}>
              <option value="">No course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="a-due" className="label">
              Due date
            </label>
            <input id="a-due" type="date" className="input" value={form.due_date} onChange={set('due_date')} required />
          </div>
          <div>
            <label htmlFor="a-priority" className="label">
              Priority
            </label>
            <select id="a-priority" className="input" value={form.priority} onChange={set('priority')}>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="a-status" className="label">
              Status
            </label>
            <select id="a-status" className="input" value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  )
}

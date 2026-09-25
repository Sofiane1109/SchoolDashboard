import { useState } from 'react'
import { Check } from 'lucide-react'
import Modal from '../ui/Modal'
import { COURSE_COLORS } from '../../lib/constants'
import { useData } from '../../hooks/useData'

export default function CourseFormModal({ open, onClose }) {
  const { addCourse, courses } = useData()
  const [name, setName] = useState('')
  const [teacher, setTeacher] = useState('')
  const [color, setColor] = useState(null)
  const [busy, setBusy] = useState(false)

  // Default to the next unused color in the fixed palette order.
  const defaultColor = COURSE_COLORS[courses.length % COURSE_COLORS.length].value
  const selected = color ?? defaultColor

  const close = () => {
    setName('')
    setTeacher('')
    setColor(null)
    onClose()
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      await addCourse({ name: name.trim(), teacher: teacher.trim() || null, color: selected })
      close()
    } catch {
      // Error banner is shown by DataContext.
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="New course"
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={close}>
            Cancel
          </button>
          <button type="submit" form="course-form" className="btn-primary" disabled={busy || !name.trim()}>
            {busy ? 'Creating…' : 'Create course'}
          </button>
        </>
      }
    >
      <form id="course-form" onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="course-name" className="label">
            Course name
          </label>
          <input id="course-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required placeholder="e.g. Mathematics" />
        </div>
        <div>
          <label htmlFor="course-teacher" className="label">
            Teacher <span className="font-normal muted">(optional)</span>
          </label>
          <input id="course-teacher" className="input" value={teacher} onChange={(e) => setTeacher(e.target.value)} maxLength={100} placeholder="e.g. Mrs. Smith" />
        </div>
        <fieldset>
          <legend className="label">Color</legend>
          <div className="flex flex-wrap gap-2">
            {COURSE_COLORS.map((c) => (
              <label key={c.value} className="cursor-pointer" title={c.label}>
                <input type="radio" name="course-color" value={c.value} checked={selected === c.value} onChange={() => setColor(c.value)} className="peer sr-only" />
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full ring-offset-2 ring-offset-white transition-shadow duration-200 peer-checked:ring-2 peer-checked:ring-slate-900 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 dark:ring-offset-slate-900 dark:peer-checked:ring-slate-100"
                  style={{ backgroundColor: c.value }}
                >
                  {selected === c.value && <Check className="h-5 w-5 text-white" aria-hidden="true" />}
                  <span className="sr-only">{c.label}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  )
}

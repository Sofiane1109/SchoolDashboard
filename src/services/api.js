import { isSupabaseConfigured, supabaseBackend } from './supabase'
import { localBackend } from './localBackend'

const db = isSupabaseConfigured ? supabaseBackend : localBackend

export const isDemoMode = !isSupabaseConfigured

export const coursesApi = {
  list: () => db.list('courses', 'created_at'),
  create: (course) => db.insert('courses', course),
  async remove(id) {
    // The SQL foreign key cascades; the local demo backend needs it done explicitly.
    await db.removeWhere('assignments', 'course_id', id)
    await db.remove('courses', id)
  },
}

export const assignmentsApi = {
  list: () => db.list('assignments', 'due_date'),
  create: (assignment) => db.insert('assignments', assignment),
  update: (id, patch) => db.update('assignments', id, patch),
  remove: (id) => db.remove('assignments', id),
}

export const dailyTasksApi = {
  list: () => db.list('daily_tasks', 'position'),
  create: (task) => db.insert('daily_tasks', task),
  update: (id, patch) => db.update('daily_tasks', id, patch),
  remove: (id) => db.remove('daily_tasks', id),
}

// Demo backend used when Supabase env vars are missing. Same interface as supabaseBackend.
const KEY = 'school-dashboard-demo'

const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`

const empty = () => ({ courses: [], assignments: [], daily_tasks: [] })

let memory = null

function load() {
  if (memory) return memory
  try {
    const raw = localStorage.getItem(KEY)
    memory = raw ? JSON.parse(raw) : null
  } catch {
    memory = null
  }
  if (!memory) {
    memory = empty()
    save()
  }
  return memory
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory))
  } catch {
    // Storage unavailable (private mode): keep data in memory only.
  }
}

export const localBackend = {
  async list(table, orderBy) {
    const rows = load()[table] ?? []
    return [...rows].sort((x, y) => String(x[orderBy]).localeCompare(String(y[orderBy])))
  },
  async insert(table, row) {
    const record = { id: uid(), created_at: new Date().toISOString(), ...row }
    load()[table].push(record)
    save()
    return record
  },
  async update(table, id, patch) {
    const rows = load()[table]
    const i = rows.findIndex((r) => r.id === id)
    if (i === -1) throw new Error('Item not found')
    rows[i] = { ...rows[i], ...patch }
    save()
    return rows[i]
  },
  async remove(table, id) {
    const db = load()
    db[table] = db[table].filter((r) => r.id !== id)
    save()
  },
  async removeWhere(table, column, value) {
    const db = load()
    db[table] = db[table].filter((r) => r[column] !== value)
    save()
  },
}

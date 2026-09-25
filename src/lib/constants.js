import { ArrowDown, ArrowUp, CheckCircle2, Circle, Minus, Timer } from 'lucide-react'

export const STATUSES = [
  { value: 'todo', label: 'To do', icon: Circle, badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', dot: 'bg-slate-400' },
  { value: 'in_progress', label: 'In progress', icon: Timer, badge: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', dot: 'bg-amber-500' },
  { value: 'done', label: 'Done', icon: CheckCircle2, badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300', dot: 'bg-emerald-500' },
]

export const PRIORITIES = [
  { value: 'high', label: 'High', icon: ArrowUp, badge: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300' },
  { value: 'medium', label: 'Medium', icon: Minus, badge: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
  { value: 'low', label: 'Low', icon: ArrowDown, badge: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300' },
]

export const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }

export const statusMeta = (value) => STATUSES.find((s) => s.value === value) ?? STATUSES[0]
export const priorityMeta = (value) => PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[1]

// Categorical order validated with the dataviz palette validator (see design-system/MASTER.md).
export const COURSE_COLORS = [
  { value: '#0D9488', label: 'Teal' },
  { value: '#EA580C', label: 'Orange' },
  { value: '#2563EB', label: 'Blue' },
  { value: '#DB2777', label: 'Pink' },
  { value: '#65A30D', label: 'Green' },
  { value: '#7C3AED', label: 'Violet' },
  { value: '#D97706', label: 'Amber' },
  { value: '#0891B2', label: 'Cyan' },
]

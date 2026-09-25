import { BookOpen, CalendarDays, ClipboardList, KanbanSquare, LayoutDashboard } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', short: 'Home', icon: LayoutDashboard, end: true },
  { to: '/assignments', label: 'Assignments', short: 'Tasks', icon: ClipboardList },
  { to: '/todo', label: 'Daily to-do', short: 'To-do', icon: KanbanSquare },
  { to: '/calendar', label: 'Calendar', short: 'Calendar', icon: CalendarDays },
  { to: '/courses', label: 'Courses', short: 'Courses', icon: BookOpen },
]

import { NavLink, Outlet } from 'react-router-dom'
import { AlertTriangle, GraduationCap, Info, X } from 'lucide-react'
import { NAV_ITEMS } from './navItems'
import { ThemeCycleButton, ThemeSegmented } from './ThemeToggle'
import { MobileUserMenu, SidebarUserMenu } from './UserMenu'
import { useData } from '../../hooks/useData'

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white dark:bg-primary-500 dark:text-slate-950">
        <GraduationCap className="h-5 w-5" aria-hidden="true" />
      </div>
      <span className="font-display text-lg font-bold">SchoolDash</span>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900 lg:flex">
      <div className="px-2">
        <Brand />
      </div>
      <nav aria-label="Main navigation" className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex min-h-[44px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-800 dark:bg-primary-500/10 dark:text-primary-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
              }`
            }
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <SidebarUserMenu />
      <ThemeSegmented />
    </aside>
  )
}

function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
      <Brand />
      <div className="flex items-center gap-1">
        <ThemeCycleButton />
        <MobileUserMenu />
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-slate-800 dark:bg-slate-900 lg:hidden"
    >
      {NAV_ITEMS.map(({ to, short, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors duration-200 ${
              isActive ? 'text-primary-700 dark:text-primary-300' : 'text-slate-600 dark:text-slate-400'
            }`
          }
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          {short}
        </NavLink>
      ))}
    </nav>
  )
}

function Banners() {
  const { error, clearError, isDemoMode } = useData()
  return (
    <>
      {isDemoMode && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Demo mode: data is stored in this browser. Set <code className="font-mono">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to use Supabase.
          </p>
        </div>
      )}
      {error && (
        <div role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="flex-1">{error}</p>
          <button type="button" onClick={clearError} className="-m-1 cursor-pointer rounded p-1 hover:bg-rose-100 dark:hover:bg-rose-900" aria-label="Dismiss error">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Sidebar />
      <MobileTopBar />
      <main id="main" className="px-4 pb-24 pt-6 sm:px-6 lg:ml-64 lg:px-8 lg:pb-10 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <Banners />
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

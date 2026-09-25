import { Link } from 'react-router-dom'

const TONES = {
  primary: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
}

export default function StatCard({ label, value, hint, icon: Icon, tone = 'primary', to }) {
  return (
    <Link to={to} className="card group flex flex-col gap-3 p-4 transition-colors duration-200 hover:border-primary-300 dark:hover:border-primary-700 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium muted">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONES[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div>
        <p className="font-display tabular-nums text-3xl font-bold leading-none">{value}</p>
        {hint && <p className="mt-1.5 text-xs muted">{hint}</p>}
      </div>
    </Link>
  )
}

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const OPTIONS = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
]

export function ThemeSegmented() {
  const { mode, setMode } = useTheme()
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={mode === value}
          onClick={() => setMode(value)}
          className={`flex min-h-[36px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md text-[11px] font-medium transition-colors duration-200 ${
            mode === value
              ? 'bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
          }`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  )
}

export function ThemeCycleButton() {
  const { mode, setMode } = useTheme()
  const i = OPTIONS.findIndex((o) => o.value === mode)
  const current = OPTIONS[i]
  const next = OPTIONS[(i + 1) % OPTIONS.length]
  const Icon = current.icon
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={() => setMode(next.value)}
      aria-label={`Theme: ${current.label}. Switch to ${next.label}`}
      title={`Theme: ${current.label}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  )
}

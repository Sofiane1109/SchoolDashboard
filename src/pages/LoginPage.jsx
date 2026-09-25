import { useState } from 'react'
import { AlertTriangle, CalendarDays, ClipboardList, GraduationCap, KanbanSquare } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}

// Supabase sends OAuth failures back as ?error_description=… (or in the hash for the implicit flow).
function readOAuthError() {
  const params = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.slice(1))
  return params.get('error_description') ?? hash.get('error_description')
}

const FEATURES = [
  { icon: ClipboardList, text: 'Track assignments, deadlines and priorities' },
  { icon: KanbanSquare, text: 'Plan your day on a drag & drop board' },
  { icon: CalendarDays, text: 'See every due date on a monthly calendar' },
]

export default function LoginPage() {
  const { signInWithGoogle } = useAuth()
  const [error, setError] = useState(readOAuthError)
  const [busy, setBusy] = useState(false)

  const signIn = async () => {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white dark:bg-primary-500 dark:text-slate-950">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="font-display text-xl font-bold">SchoolDash</span>
        </div>

        <h1 className="mt-8 font-display text-2xl font-bold">Sign in</h1>
        <p className="mt-1 muted">Your courses, assignments and daily tasks, synced across your devices.</p>

        <ul className="mt-6 space-y-3">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        {error && (
          <div role="alert" className="mt-6 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>Sign-in failed: {error}</p>
          </div>
        )}

        <button type="button" onClick={signIn} disabled={busy} className="btn-secondary mt-6 w-full">
          <GoogleLogo />
          {busy ? 'Redirecting to Google…' : 'Continue with Google'}
        </button>
      </div>
    </main>
  )
}

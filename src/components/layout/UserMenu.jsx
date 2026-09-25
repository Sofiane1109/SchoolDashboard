import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function Avatar({ user, size = 'h-9 w-9' }) {
  const [broken, setBroken] = useState(false)
  const meta = user.user_metadata ?? {}
  const name = meta.full_name || meta.name || user.email
  const src = meta.avatar_url || meta.picture

  if (src && !broken) {
    // Google avatar URLs reject requests that send a referrer.
    return <img src={src} alt="" referrerPolicy="no-referrer" onError={() => setBroken(true)} className={`${size} shrink-0 rounded-full object-cover`} />
  }
  return (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-800 dark:bg-primary-500/15 dark:text-primary-300`} aria-hidden="true">
      {name?.[0]?.toUpperCase() ?? '?'}
    </span>
  )
}

function useSignOut() {
  const { signOut } = useAuth()
  const [busy, setBusy] = useState(false)
  const run = async () => {
    setBusy(true)
    try {
      await signOut()
    } finally {
      setBusy(false)
    }
  }
  return [run, busy]
}

export function SidebarUserMenu() {
  const { authEnabled, user } = useAuth()
  const [signOut, busy] = useSignOut()
  if (!authEnabled || !user) return null
  const meta = user.user_metadata ?? {}

  return (
    <div className="mb-3 flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-slate-800">
      <Avatar user={user} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{meta.full_name || meta.name || 'Signed in'}</p>
        <p className="truncate text-xs muted">{user.email}</p>
      </div>
      <button type="button" className="icon-btn h-9 w-9" onClick={signOut} disabled={busy} aria-label="Sign out" title="Sign out">
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
}

export function MobileUserMenu() {
  const { authEnabled, user } = useAuth()
  const [signOut, busy] = useSignOut()
  if (!authEnabled || !user) return null

  return (
    <div className="flex items-center gap-1">
      <Avatar user={user} size="h-8 w-8" />
      <button type="button" className="icon-btn" onClick={signOut} disabled={busy} aria-label={`Sign out (${user.email})`} title="Sign out">
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  )
}

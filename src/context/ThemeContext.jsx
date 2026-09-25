import { createContext, useEffect, useMemo, useState } from 'react'

export const ThemeContext = createContext(null)

const STORAGE_KEY = 'theme'
const query = () => window.matchMedia('(prefers-color-scheme: dark)')

function readStoredMode() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(readStoredMode)
  const [systemDark, setSystemDark] = useState(() => query().matches)

  useEffect(() => {
    const mql = query()
    const onChange = (e) => setSystemDark(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const resolved = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#0B1220' : '#0D9488')
  }, [resolved])

  useEffect(() => {
    try {
      if (mode === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // Preference simply won't persist.
    }
  }, [mode])

  const value = useMemo(() => ({ mode, setMode, resolved }), [mode, resolved])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

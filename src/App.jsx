import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import Spinner from './components/ui/Spinner'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AssignmentsPage from './pages/AssignmentsPage'
import DailyBoardPage from './pages/DailyBoardPage'
import CalendarPage from './pages/CalendarPage'
import CoursesPage from './pages/CoursesPage'
import NotFoundPage from './pages/NotFoundPage'

function AuthGate({ children }) {
  const { authEnabled, user, loading } = useAuth()
  if (!authEnabled) return children
  if (loading) return <Spinner />
  if (!user) return <LoginPage />
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AuthGate>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="assignments" element={<AssignmentsPage />} />
                  <Route path="todo" element={<DailyBoardPage />} />
                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthGate>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

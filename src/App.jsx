import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { DataProvider } from './context/DataContext'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import AssignmentsPage from './pages/AssignmentsPage'
import DailyBoardPage from './pages/DailyBoardPage'
import CalendarPage from './pages/CalendarPage'
import CoursesPage from './pages/CoursesPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
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
      </DataProvider>
    </ThemeProvider>
  )
}

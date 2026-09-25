import { useContext, useMemo } from 'react'
import { DataContext } from '../context/DataContext'

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}

export function useCourseMap() {
  const { courses } = useData()
  return useMemo(() => new Map(courses.map((c) => [c.id, c])), [courses])
}

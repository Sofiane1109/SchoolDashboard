import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      message="This page doesn't exist or has been moved."
      action={
        <Link to="/" className="btn-primary">
          Back to dashboard
        </Link>
      }
    />
  )
}

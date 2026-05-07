import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Spinner from '@/components/ui/Spinner'

export default function PublicRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (user) {
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
    if (user.role === 'principal') return <Navigate to="/principal/dashboard" replace />
  }

  return children
}
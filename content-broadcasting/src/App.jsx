import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'

// Auth
import LoginPage from '@/pages/auth/LoginPage'

// Teacher
import TeacherLayout from './components/layout/TeacherLayout'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import UploadContentPage from './pages/teacher/UploadContentPage'
import MyContentPage from './pages/teacher/MyContentPage'

// Principal
import PrincipalLayout from './components/layout/PrincipalLayout'
import PrincipalDashboard from './pages/principal/PrincipalDashboard'
import PendingApprovalPage from './pages/principal/PendingApprovalPage'
import AllContentPage from './pages/principal/AllContentPage'

// Public
import LivePage from './pages/public/LivePage'

const RoleRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
  if (user.role === 'principal') return <Navigate to="/principal/dashboard" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/live/:teacherId" element={<LivePage />} />

      {/* Auth */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      {/* Teacher */}
      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="upload" element={<UploadContentPage />} />
        <Route path="my-content" element={<MyContentPage />} />
      </Route>

      {/* Principal */}
      <Route path="/principal" element={<ProtectedRoute role="principal"><PrincipalLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PrincipalDashboard />} />
        <Route path="pending" element={<PendingApprovalPage />} />
        <Route path="all-content" element={<AllContentPage />} />
      </Route>

      {/* Default */}
      <Route path="/" element={<RoleRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
import { NavLink, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { useAuth } from '@/context/AuthContext'
import Avatar from '@/components/ui/Avatar'

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
          isActive
            ? 'bg-brand-500 text-white shadow-brand'
            : 'text-surface-500 hover:bg-surface-100 hover:text-surface-800'
        )
      }
    >
      <span className="text-base">{icon}</span>
      {label}
    </NavLink>
  )
}

const TEACHER_NAV = [
  { to: '/teacher/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/teacher/upload', icon: '📤', label: 'Upload Content' },
  { to: '/teacher/my-content', icon: '📚', label: 'My Content' },
]

const PRINCIPAL_NAV = [
  { to: '/principal/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/principal/pending', icon: '⏳', label: 'Pending Approvals' },
  { to: '/principal/all-content', icon: '📋', label: 'All Content' },
]

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth()
  const nav = user?.role === 'teacher' ? TEACHER_NAV : PRINCIPAL_NAV

  return (
    <aside className="flex flex-col h-full bg-white border-r border-surface-100 w-64">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-surface-100">
        <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center text-white text-sm font-bold font-display shadow-brand">
          GB
        </div>
        <span className="font-display font-bold text-surface-900 text-lg">Grubpac Broadcast</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-surface-400 hover:text-surface-700 lg:hidden"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-3">
          <span className="text-xs font-bold text-surface-300 uppercase tracking-widest">
            {user?.role === 'teacher' ? 'Teacher Menu' : 'Principal Menu'}
          </span>
        </div>
        {nav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-surface-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-50 transition-colors">
          <Avatar name={user?.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-800 truncate">{user?.name}</p>
            <p className="text-xs text-surface-400 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-100 text-surface-700 hover:text-red-500 hover:bg-red-50 transition-colors text-base font-black"
          >
            →
          </button>
        </div>
      </div>
    </aside>
  )
}
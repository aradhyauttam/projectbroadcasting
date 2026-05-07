import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { fetchPrincipalStats, fetchPendingContent } from '@/services/content.service'
import StatCard from '@/components/ui/StatCard'
import { StatusBadge } from '@/components/ui/Badge'
import { SkeletonStats, SkeletonRow } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Avatar from '@/components/ui/Avatar'
import { formatDate, truncate } from '@/utils/helpers'

export default function PrincipalDashboard() {
  const { user } = useAuth()

  const { data: stats, isLoading: statsLoading, error: statsError, execute: refetchStats } =
    useAsync(fetchPrincipalStats, { immediate: true })

  const { data: pending, isLoading: pendingLoading, error: pendingError, execute: refetchPending } =
    useAsync(fetchPendingContent, { immediate: true })

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Overview, {user.name.split(' ').pop()} 🏫</h1>
          <p className="text-surface-400 mt-1 text-sm">Manage and approve educator content submissions.</p>
        </div>
        <Link to="/principal/pending" className="btn-primary hidden sm:inline-flex">
          ⏳ Review Pending
        </Link>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <SkeletonStats />
      ) : statsError ? (
        <ErrorState message={statsError} onRetry={refetchStats} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Content" value={stats?.total} icon="📁" color="brand" />
          <StatCard label="Pending Review" value={stats?.pending} icon="⏳" color="amber" />
          <StatCard label="Approved" value={stats?.approved} icon="✅" color="green" />
          <StatCard label="Rejected" value={stats?.rejected} icon="❌" color="red" />
        </div>
      )}

      {/* Pending queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-bold text-surface-900 text-lg">Pending Approvals</h2>
            {pending?.length > 0 && (
              <p className="text-surface-400 text-sm mt-0.5">{pending.length} item{pending.length !== 1 ? 's' : ''} awaiting your review</p>
            )}
          </div>
          <Link to="/principal/pending" className="text-sm font-semibold text-brand-500 hover:text-brand-700">
            View all →
          </Link>
        </div>

        {pendingLoading ? (
          <div className="divide-y divide-surface-100">
            {[1, 2, 3].map((n) => <SkeletonRow key={n} />)}
          </div>
        ) : pendingError ? (
          <ErrorState message={pendingError} onRetry={refetchPending} />
        ) : !pending || pending.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="All caught up!"
            description="No content is pending approval right now."
          />
        ) : (
          <div className="divide-y divide-surface-100">
            {pending.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3.5 group">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                  <img src={item.fileUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-surface-800 text-sm truncate">{item.title}</p>
                  <p className="text-xs text-surface-400">
                    {item.subject} · by {item.teacherName} · {formatDate(item.createdAt, 'MMM d')}
                  </p>
                </div>
                <StatusBadge status={item.status} />
                <Link
                  to="/principal/pending"
                  className="btn-ghost text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Review
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
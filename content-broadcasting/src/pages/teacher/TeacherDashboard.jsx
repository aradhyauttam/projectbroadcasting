import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { fetchTeacherStats, fetchContentByTeacher } from '@/services/content.service'
import StatCard from '@/components/ui/StatCard'
import ContentCard from '@/components/ui/ContentCard'
import { SkeletonStats, SkeletonCard } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { StatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/utils/helpers'

export default function TeacherDashboard() {
  const { user } = useAuth()

  const fetchStats = useCallback(() => fetchTeacherStats(user.id), [user.id])
  const fetchContent = useCallback(() => fetchContentByTeacher(user.id), [user.id])

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    execute: refetchStats,
  } = useAsync(fetchStats, { immediate: true, deps: [user.id] })

  const {
    data: content,
    isLoading: contentLoading,
    error: contentError,
    execute: refetchContent,
  } = useAsync(fetchContent, { immediate: true, deps: [user.id] })

  const recentContent = content?.slice(0, 3) || []

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Good day, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-surface-400 mt-1 text-sm">Here's an overview of your content activity.</p>
        </div>
        <Link to="/teacher/upload" className="btn-primary hidden sm:inline-flex">
          <span>＋</span> Upload Content
        </Link>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <SkeletonStats />
      ) : statsError ? (
        <ErrorState message={statsError} onRetry={refetchStats} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Uploaded" value={stats?.total} icon="📁" color="brand" />
          <StatCard label="Pending Review" value={stats?.pending} icon="⏳" color="amber" />
          <StatCard label="Approved" value={stats?.approved} icon="✅" color="green" />
          <StatCard label="Rejected" value={stats?.rejected} icon="❌" color="red" />
        </div>
      )}

      {/* Recent Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-surface-900 text-lg">Recent Uploads</h2>
          <Link to="/teacher/my-content" className="text-sm font-semibold text-brand-500 hover:text-brand-700 transition-colors">
            View all →
          </Link>
        </div>

        {contentLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : contentError ? (
          <ErrorState message={contentError} onRetry={refetchContent} />
        ) : recentContent.length === 0 ? (
          <EmptyState
            icon="📤"
            title="No uploads yet"
            description="Start sharing educational content with your students."
            action={<Link to="/teacher/upload" className="btn-primary">Upload your first content</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentContent.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile upload CTA */}
      <div className="sm:hidden">
        <Link to="/teacher/upload" className="btn-primary w-full">
          <span>＋</span> Upload New Content
        </Link>
      </div>
    </div>
  )
}
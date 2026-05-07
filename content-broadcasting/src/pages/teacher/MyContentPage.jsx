import { useCallback, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAsync } from '@/hooks/useAsync'
import { useDebounce } from '@/hooks/useDebounce'
import { fetchContentByTeacher } from '@/services/content.service'
import { StatusBadge, ScheduleBadge } from '@/components/ui/Badge'
import { SkeletonCard } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import SearchInput from '@/components/ui/SearchInput'
import { formatDate, formatFileSize } from '@/utils/helpers'
import { CONTENT_STATUS } from '@/utils/constants'

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: CONTENT_STATUS.PENDING },
  { label: 'Approved', value: CONTENT_STATUS.APPROVED },
  { label: 'Rejected', value: CONTENT_STATUS.REJECTED },
]

export default function MyContentPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const debouncedSearch = useDebounce(search, 300)

  const fetchFn = useCallback(() => fetchContentByTeacher(user.id), [user.id])
  const { data: content, isLoading, error, execute: refetch } = useAsync(fetchFn, {
    immediate: true,
    deps: [user.id],
  })

  const filtered = useMemo(() => {
    if (!content) return []
    return content.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      const q = debouncedSearch.toLowerCase()
      const matchSearch = !q ||
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [content, statusFilter, debouncedSearch])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Content</h1>
          <p className="text-surface-400 text-sm mt-1">All your uploaded educational content.</p>
        </div>
        <Link to="/teacher/upload" className="btn-primary hidden sm:inline-flex">
          <span>＋</span> Upload
        </Link>
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search title or subject…"
          />
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`
                  px-3.5 py-2 rounded-xl text-xs font-bold transition-all border
                  ${statusFilter === f.value
                    ? 'bg-brand-500 text-white border-brand-500 shadow-brand'
                    : 'bg-white text-surface-500 border-surface-200 hover:border-brand-300 hover:text-brand-600'
                  }
                `}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={debouncedSearch || statusFilter !== 'all' ? 'No results found' : 'No content yet'}
          description={
            debouncedSearch || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Upload your first piece of content to get started.'
          }
          action={
            !debouncedSearch && statusFilter === 'all'
              ? <Link to="/teacher/upload" className="btn-primary">Upload Content</Link>
              : undefined
          }
        />
      ) : (
        <>
          <p className="text-sm text-surface-400 -mt-2">
            Showing {filtered.length} of {content.length} items
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <ContentItemCard key={item.id} content={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ContentItemCard({ content }) {
  return (
    <div className="card-hover overflow-hidden animate-slide-up">
      {/* Image */}
      <div className="relative -mx-6 -mt-6 mb-4 h-40 bg-surface-100">
        <img
          src={content.fileUrl}
          alt={content.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={content.status} />
        </div>
        <div className="absolute top-3 left-3">
          <ScheduleBadge startTime={content.startTime} endTime={content.endTime} />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">{content.subject}</span>
        <h3 className="font-display font-bold text-surface-900 text-sm leading-snug line-clamp-2">{content.title}</h3>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-surface-400 mt-2">
          <span>📅 {formatDate(content.startTime, 'MMM d, h:mm a')}</span>
          <span>⏱ {formatDate(content.endTime, 'MMM d, h:mm a')}</span>
          <span>🔄 {content.rotationDuration}s</span>
          <span>📦 {formatFileSize(content.fileSize)}</span>
        </div>

        {content.status === 'rejected' && content.rejectionReason && (
          <div className="mt-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs text-red-600">
              <span className="font-bold">Rejected:</span> {content.rejectionReason}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
import { useState, useCallback, useMemo } from 'react'
import { useAsync } from '@/hooks/useAsync'
import { useDebounce } from '@/hooks/useDebounce'
import { fetchAllContent } from '@/services/content.service'
import { StatusBadge, ScheduleBadge } from '@/components/ui/Badge'
import { SkeletonRow } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import SearchInput from '@/components/ui/SearchInput'
import Modal from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import { formatDate, formatFileSize } from '@/utils/helpers'
import { CONTENT_STATUS } from '@/utils/constants'

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: CONTENT_STATUS.PENDING },
  { label: 'Approved', value: CONTENT_STATUS.APPROVED },
  { label: 'Rejected', value: CONTENT_STATUS.REJECTED },
]

export default function AllContentPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [previewItem, setPreviewItem] = useState(null)
  const debouncedSearch = useDebounce(search, 300)

  const fetchFn = useCallback(() => fetchAllContent(), [])
  const { data: content, isLoading, error, execute: refetch } = useAsync(fetchFn, {
    immediate: true,
    deps: [],
  })

  const filtered = useMemo(() => {
    if (!content) return []
    return content.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      const q = debouncedSearch.toLowerCase()
      const matchSearch = !q ||
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [content, statusFilter, debouncedSearch])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">All Content</h1>
        <p className="text-surface-400 text-sm mt-1">Browse all content submitted across all teachers.</p>
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search title, subject, or teacher…"
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

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-surface-50">
            {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : error ? (
          <div className="p-6"><ErrorState message={error} onRetry={refetch} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No content found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <>
            {/* Table header — desktop only */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-surface-100 bg-surface-50">
              {['Title', 'Subject', 'Teacher', 'Status', 'Schedule', ''].map((h) => (
                <span key={h} className="text-xs font-bold text-surface-400 uppercase tracking-wider">{h}</span>
              ))}
            </div>

            <div className="divide-y divide-surface-50">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 hover:bg-surface-50 transition-colors group"
                >
                  {/* Title + preview thumb */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                      <img src={item.fileUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-surface-800 text-sm truncate">{item.title}</p>
                      <p className="text-xs text-surface-400">{formatDate(item.createdAt, 'MMM d, yyyy')}</p>
                    </div>
                  </div>

                  <span className="text-sm text-surface-600 hidden md:block">{item.subject}</span>

                  <div className="hidden md:flex items-center gap-2">
                    <Avatar name={item.teacherName} size="sm" />
                    <span className="text-sm text-surface-600 truncate">{item.teacherName.split(' ')[0]}</span>
                  </div>

                  <div className="hidden md:block">
                    <StatusBadge status={item.status} />
                  </div>

                  <div className="hidden md:block">
                    <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
                  </div>

                  <button
                    onClick={() => setPreviewItem(item)}
                    className="btn-ghost text-xs px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-surface-100 bg-surface-50">
              <p className="text-xs text-surface-400">Showing {filtered.length} of {content.length} items</p>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} title="Content Details" size="lg">
        {previewItem && (
          <div className="space-y-4">
            <img src={previewItem.fileUrl} alt={previewItem.title} className="w-full max-h-72 object-cover rounded-xl" />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoRow label="Title" value={previewItem.title} />
              <InfoRow label="Subject" value={previewItem.subject} />
              <InfoRow label="Teacher" value={previewItem.teacherName} />
              <InfoRow label="Status" value={<StatusBadge status={previewItem.status} />} />
              <InfoRow label="Start" value={formatDate(previewItem.startTime)} />
              <InfoRow label="End" value={formatDate(previewItem.endTime)} />
              <InfoRow label="Rotation" value={`${previewItem.rotationDuration}s`} />
              <InfoRow label="File Size" value={formatFileSize(previewItem.fileSize)} />
            </div>
            {previewItem.description && (
              <div className="pt-2 border-t border-surface-100">
                <p className="text-xs font-semibold text-surface-400 mb-1">Description</p>
                <p className="text-sm text-surface-700">{previewItem.description}</p>
              </div>
            )}
            {previewItem.status === 'rejected' && previewItem.rejectionReason && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs font-bold text-red-600 mb-0.5">Rejection Reason</p>
                <p className="text-sm text-red-700">{previewItem.rejectionReason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-surface-400 font-medium">{label}</p>
      <div className="font-semibold text-surface-800 mt-0.5">{value}</div>
    </div>
  )
}
import { useState, useCallback } from 'react'
import { useAsync } from '@/hooks/useAsync'
import { fetchPendingContent } from '@/services/content.service'
import { approveContent, rejectContent } from '@/services/approval.service'
import { SkeletonCard } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { ScheduleBadge } from '@/components/ui/Badge'
import { formatDate, formatFileSize } from '@/utils/helpers'
import toast from 'react-hot-toast'

export default function PendingApprovalPage() {
  const {
    data: content,
    isLoading,
    error,
    execute: refetch,
  } = useAsync(fetchPendingContent, { immediate: true })

  const [actionItem, setActionItem] = useState(null)  // {id, title, action: 'approve'|'reject'}
  const [rejectReason, setRejectReason] = useState('')
  const [isActioning, setIsActioning] = useState(false)
  const [previewItem, setPreviewItem] = useState(null)

  const handleApprove = async (item) => {
    setActionItem({ ...item, action: 'approve' })
  }

  const handleRejectOpen = (item) => {
    setRejectReason('')
    setActionItem({ ...item, action: 'reject' })
  }

  const handleConfirm = async () => {
    if (!actionItem) return
    setIsActioning(true)
    try {
      if (actionItem.action === 'approve') {
        await approveContent(actionItem.id)
        toast.success(`"${actionItem.title}" approved successfully.`)
      } else {
        if (!rejectReason.trim()) {
          toast.error('Please provide a rejection reason.')
          setIsActioning(false)
          return
        }
        await rejectContent(actionItem.id, rejectReason)
        toast.success(`"${actionItem.title}" rejected.`)
      }
      setActionItem(null)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Action failed.')
    } finally {
      setIsActioning(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="page-title">Pending Approvals</h1>
        <p className="text-surface-400 text-sm mt-1">Review and approve or reject submitted content.</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : !content || content.length === 0 ? (
        <EmptyState
          icon="✅"
          title="Nothing to review"
          description="All submitted content has been reviewed. Check back later."
        />
      ) : (
        <>
          <p className="text-sm text-surface-400">{content.length} item{content.length !== 1 ? 's' : ''} awaiting review</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map((item) => (
              <PendingCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleRejectOpen}
                onPreview={setPreviewItem}
              />
            ))}
          </div>
        </>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title="Content Preview"
        size="lg"
      >
        {previewItem && (
          <div className="space-y-4">
            <img
              src={previewItem.fileUrl}
              alt={previewItem.title}
              className="w-full max-h-80 object-cover rounded-xl"
            />
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-surface-400 font-medium">Title</span><p className="font-semibold text-surface-800 mt-0.5">{previewItem.title}</p></div>
              <div><span className="text-surface-400 font-medium">Subject</span><p className="font-semibold text-surface-800 mt-0.5">{previewItem.subject}</p></div>
              <div><span className="text-surface-400 font-medium">Teacher</span><p className="font-semibold text-surface-800 mt-0.5">{previewItem.teacherName}</p></div>
              <div><span className="text-surface-400 font-medium">File Size</span><p className="font-semibold text-surface-800 mt-0.5">{formatFileSize(previewItem.fileSize)}</p></div>
              <div><span className="text-surface-400 font-medium">Start</span><p className="font-semibold text-surface-800 mt-0.5">{formatDate(previewItem.startTime)}</p></div>
              <div><span className="text-surface-400 font-medium">End</span><p className="font-semibold text-surface-800 mt-0.5">{formatDate(previewItem.endTime)}</p></div>
            </div>
            {previewItem.description && (
              <div><span className="text-surface-400 font-medium text-sm">Description</span><p className="text-surface-700 text-sm mt-0.5">{previewItem.description}</p></div>
            )}
            <div className="flex gap-3 pt-2 border-t border-surface-100">
              <button onClick={() => { setPreviewItem(null); handleApprove(previewItem) }} className="btn-success flex-1">
                ✓ Approve
              </button>
              <button onClick={() => { setPreviewItem(null); handleRejectOpen(previewItem) }} className="btn-danger flex-1">
                ✕ Reject
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Action Modal */}
      <Modal
        isOpen={!!actionItem}
        onClose={() => !isActioning && setActionItem(null)}
        title={actionItem?.action === 'approve' ? 'Approve Content' : 'Reject Content'}
        size="sm"
      >
        {actionItem && (
          <div className="space-y-4">
            <p className="text-surface-600 text-sm">
              {actionItem.action === 'approve'
                ? <>Are you sure you want to approve <strong>"{actionItem.title}"</strong>? It will be visible on the live page during its scheduled time.</>
                : <>Please provide a reason for rejecting <strong>"{actionItem.title}"</strong>.</>
              }
            </p>

            {actionItem.action === 'reject' && (
              <div>
                <label className="label">Rejection Reason <span className="text-red-400">*</span></label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this content is being rejected…"
                  className="input resize-none"
                  autoFocus
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActionItem(null)}
                disabled={isActioning}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isActioning || (actionItem.action === 'reject' && !rejectReason.trim())}
                className={actionItem.action === 'approve' ? 'btn-success flex-1' : 'btn-danger flex-1'}
              >
                {isActioning ? <><Spinner size="sm" /> Processing…</> : actionItem.action === 'approve' ? '✓ Approve' : '✕ Reject'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function PendingCard({ item, onApprove, onReject, onPreview }) {
  return (
    <div className="card-hover overflow-hidden animate-slide-up">
      {/* Image */}
      <div
        className="relative -mx-6 -mt-6 mb-4 h-44 bg-surface-100 cursor-pointer group"
        onClick={() => onPreview(item)}
      >
        <img
          src={item.fileUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-bold bg-black/50 px-3 py-1.5 rounded-full transition-opacity">
            👁 Preview
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <ScheduleBadge startTime={item.startTime} endTime={item.endTime} />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-4">
        <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">{item.subject}</span>
        <h3 className="font-display font-bold text-surface-900 text-sm line-clamp-2">{item.title}</h3>
        <div className="text-xs text-surface-400 space-y-0.5">
          <p>👤 {item.teacherName}</p>
          <p>📅 {formatDate(item.startTime, 'MMM d')} → {formatDate(item.endTime, 'MMM d, h:mm a')}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-surface-100">
        <button onClick={() => onReject(item)} className="btn-danger flex-1 text-xs py-2">
          ✕ Reject
        </button>
        <button onClick={() => onApprove(item)} className="btn-success flex-1 text-xs py-2">
          ✓ Approve
        </button>
      </div>
    </div>
  )
}
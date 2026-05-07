import { memo } from 'react'
import { StatusBadge, ScheduleBadge } from './Badge'
import { formatDate, formatFileSize } from '@/utils/helpers'

const ContentCard = memo(function ContentCard({ content, actions }) {
  return (
    <div className="card-hover overflow-hidden animate-slide-up">
      {/* Image Preview */}
      <div className="relative -mx-6 -mt-6 mb-4 h-44 bg-surface-100 overflow-hidden">
        <img
          src={content.fileUrl}
          alt={content.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.classList.add('flex', 'items-center', 'justify-center')
          }}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <StatusBadge status={content.status} />
        </div>
        <div className="absolute top-3 left-3">
          <ScheduleBadge startTime={content.startTime} endTime={content.endTime} />
        </div>
      </div>

      {/* Content Info */}
      <div className="space-y-2">
        <div>
          <span className="text-xs font-semibold text-brand-500 uppercase tracking-wider">{content.subject}</span>
          <h3 className="font-display font-bold text-surface-900 text-base leading-tight mt-0.5 line-clamp-2">
            {content.title}
          </h3>
        </div>

        {content.description && (
          <p className="text-sm text-surface-400 line-clamp-2">{content.description}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-400 pt-1">
          <span>📅 {formatDate(content.startTime, 'MMM d, h:mm a')}</span>
          <span>⏰ {content.rotationDuration}s rotation</span>
          <span>📁 {formatFileSize(content.fileSize)}</span>
        </div>

        {content.status === 'rejected' && content.rejectionReason && (
          <div className="mt-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs text-red-600">
              <span className="font-semibold">Rejected: </span>
              {content.rejectionReason}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="mt-4 pt-4 border-t border-surface-100 flex gap-2">
          {actions}
        </div>
      )}
    </div>
  )
})

export default ContentCard
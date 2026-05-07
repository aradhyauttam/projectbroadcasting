import { clsx } from 'clsx'
import { getScheduleStatus } from '@/utils/helpers'
import { SCHEDULE_STATUS } from '@/utils/constants'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   className: 'badge-pending',   dot: 'bg-amber-400' },
  approved:  { label: 'Approved',  className: 'badge-approved',  dot: 'bg-green-400' },
  rejected:  { label: 'Rejected',  className: 'badge-rejected',  dot: 'bg-red-400'   },
  active:    { label: 'Active',    className: 'badge-active',    dot: 'bg-brand-400' },
  scheduled: { label: 'Scheduled', className: 'badge-scheduled', dot: 'bg-purple-400'},
  expired:   { label: 'Expired',   className: 'badge-expired',   dot: 'bg-surface-300'},
}

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return (
    <span className={config.className}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}

export function ScheduleBadge({ startTime, endTime }) {
  const scheduleStatus = getScheduleStatus(startTime, endTime)
  const config = STATUS_CONFIG[scheduleStatus] || STATUS_CONFIG.scheduled
  return (
    <span className={config.className}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', scheduleStatus === SCHEDULE_STATUS.ACTIVE ? 'animate-pulse' : '', config.dot)} />
      {config.label}
    </span>
  )
}
import { clsx } from 'clsx'
import { getInitials } from '@/utils/helpers'

const COLORS = [
  'bg-brand-100 text-brand-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
]

export default function Avatar({ name = '', size = 'md', className }) {
  const initials = getInitials(name)
  const colorIndex = name.charCodeAt(0) % COLORS.length
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }

  return (
    <div className={clsx(
      'rounded-xl flex items-center justify-center font-bold font-display flex-shrink-0',
      COLORS[colorIndex],
      sizes[size],
      className
    )}>
      {initials}
    </div>
  )
}
import { clsx } from 'clsx'

export default function StatCard({ label, value, icon, color = 'brand', trend }) {
  const colors = {
    brand:  { bg: 'bg-brand-50',  icon: 'text-brand-500',  value: 'text-brand-600'  },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-500',  value: 'text-amber-600'  },
    green:  { bg: 'bg-green-50',  icon: 'text-green-500',  value: 'text-green-600'  },
    red:    { bg: 'bg-red-50',    icon: 'text-red-500',    value: 'text-red-600'    },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', value: 'text-purple-600' },
  }
  const c = colors[color] || colors.brand

  return (
    <div className="card-hover animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-xl', c.bg, c.icon)}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div className={clsx('font-display text-3xl font-bold mb-0.5', c.value)}>
        {value ?? '—'}
      </div>
      <div className="text-sm text-surface-400 font-medium">{label}</div>
    </div>
  )
}
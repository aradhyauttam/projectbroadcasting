export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4 text-surface-300 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="font-display font-bold text-surface-700 text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-surface-400 text-sm max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
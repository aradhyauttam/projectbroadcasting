export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 text-3xl">
        ⚠️
      </div>
      <h3 className="font-display font-bold text-surface-800 text-lg mb-1">Something went wrong</h3>
      <p className="text-surface-400 text-sm max-w-xs mb-5">{message || 'An unexpected error occurred. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  )
}
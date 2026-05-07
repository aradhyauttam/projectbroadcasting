import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAsync } from '@/hooks/useAsync'
import { usePolling } from '@/hooks/usePolling'
import { fetchLiveContent } from '@/services/content.service'
import { MOCK_USERS } from '@/lib/mockData'
import { POLL_INTERVAL_MS } from '@/utils/constants'
import { formatDate } from '@/utils/helpers'
import Spinner from '@/components/ui/Spinner'

export default function LivePage() {
  const { teacherId } = useParams()
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const teacher = MOCK_USERS.find((u) => u.id === teacherId)

  const fetchFn = useCallback(() => fetchLiveContent(teacherId), [teacherId])

  const {
    data: liveContent,
    isLoading,
    error,
    execute: refetch,
  } = useAsync(fetchFn, { immediate: true, deps: [teacherId] })

  // Auto-refresh polling
  usePolling(() => {
    refetch()
    setLastRefresh(new Date())
  }, POLL_INTERVAL_MS, true)

  const handleManualRefresh = () => {
    refetch()
    setLastRefresh(new Date())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-950 to-brand-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-sm font-bold font-display shadow-brand">
              EB
            </div>
            <div>
              <span className="font-display font-bold text-white">EduBroadcast</span>
              {teacher && (
                <span className="text-white/50 text-sm ml-2">· {teacher.name}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold disabled:opacity-50"
            >
              {isLoading ? <Spinner size="sm" className="text-white" /> : '🔄'} Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Teacher info */}
        {teacher && (
          <div className="mb-8 text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Currently broadcasting
            </div>
            <h1 className="font-display font-black text-3xl md:text-4xl text-white">{teacher.name}</h1>
            <p className="text-white/50 mt-1">{teacher.subject || 'Educational Content'}</p>
          </div>
        )}

        {/* Content */}
        {isLoading && !liveContent ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="xl" className="text-brand-400" />
            <p className="text-white/50 text-sm">Loading live content…</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="font-display font-bold text-white text-xl mb-2">Failed to load</h2>
            <p className="text-white/50 text-sm mb-6">{error}</p>
            <button onClick={handleManualRefresh} className="btn-primary">Try again</button>
          </div>
        ) : !liveContent || liveContent.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="w-24 h-24 mx-auto bg-white/5 rounded-3xl flex items-center justify-center text-5xl mb-6">
              📺
            </div>
            <h2 className="font-display font-black text-white text-2xl mb-2">No content available</h2>
            <p className="text-white/40 text-sm max-w-xs mx-auto">
              There is no active broadcast right now. Check back later or refresh the page.
            </p>
            <p className="text-white/20 text-xs mt-6">
              Auto-refreshes every {POLL_INTERVAL_MS / 1000}s · Last updated: {formatDate(lastRefresh.toISOString(), 'h:mm:ss a')}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {liveContent.map((item, idx) => (
              <LiveContentCard key={item.id} item={item} featured={idx === 0} />
            ))}
            <p className="text-center text-white/20 text-xs">
              Auto-refreshes every {POLL_INTERVAL_MS / 1000}s · Last updated: {formatDate(lastRefresh.toISOString(), 'h:mm:ss a')}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function LiveContentCard({ item, featured }) {
  return (
    <div className={`animate-slide-up ${featured ? 'ring-2 ring-brand-400/50' : ''} bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10`}>
      {featured && (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-brand-500/20 border-b border-brand-400/20">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="text-xs font-bold text-brand-300 uppercase tracking-wider">Now Showing</span>
        </div>
      )}

      <div className="md:flex">
        {/* Image */}
        <div className="md:w-1/2 h-56 md:h-auto bg-surface-800">
          <img
            src={item.fileUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <span className="inline-block text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">
            {item.subject}
          </span>
          <h2 className="font-display font-black text-white text-xl md:text-2xl leading-tight mb-3">
            {item.title}
          </h2>
          {item.description && (
            <p className="text-white/60 text-sm leading-relaxed mb-4">{item.description}</p>
          )}

          <div className="grid grid-cols-2 gap-3 text-xs text-white/40 pt-4 border-t border-white/10">
            <div>
              <p className="text-white/20 mb-0.5">By</p>
              <p className="text-white/60 font-medium">{item.teacherName}</p>
            </div>
            <div>
              <p className="text-white/20 mb-0.5">Rotation</p>
              <p className="text-white/60 font-medium">{item.rotationDuration}s</p>
            </div>
            <div>
              <p className="text-white/20 mb-0.5">Ends</p>
              <p className="text-white/60 font-medium">{formatDate(item.endTime, 'h:mm a, MMM d')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
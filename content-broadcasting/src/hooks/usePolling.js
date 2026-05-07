import { useEffect, useRef, useCallback } from 'react'

/**
 * Polling hook — runs a function on an interval
 * @param {Function} fn - the function to poll
 * @param {number} interval - polling interval in ms
 * @param {boolean} enabled - whether polling is active
 */
export function usePolling(fn, interval = 30_000, enabled = true) {
  const fnRef = useRef(fn)
  const timerRef = useRef(null)

  useEffect(() => { fnRef.current = fn }, [fn])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    stop()
    if (!enabled) return
    timerRef.current = setInterval(() => fnRef.current(), interval)
  }, [interval, enabled, stop])

  useEffect(() => {
    if (enabled) start()
    return stop
  }, [enabled, start, stop])

  return { start, stop }
}
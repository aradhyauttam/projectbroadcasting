import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Generic hook for handling async operations with loading / error / data state
 * @param {Function} asyncFn - the async function to call
 * @param {object} options
 * @param {boolean} options.immediate - if true, run on mount
 * @param {Array}   options.deps - dependencies for immediate mode
 */
export function useAsync(asyncFn, { immediate = false, deps = [] } = {}) {
  const [state, setState] = useState({
    data: null,
    isLoading: immediate,
    error: null,
  })
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(async (...args) => {
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const data = await asyncFn(...args)
      if (mountedRef.current) {
        setState({ data, isLoading: false, error: null })
      }
      return { data, error: null }
    } catch (err) {
      const error = err.message || 'Something went wrong.'
      if (mountedRef.current) {
        setState((s) => ({ ...s, data: null, isLoading: false, error }))
      }
      return { data: null, error }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFn])

  useEffect(() => {
    if (immediate) execute()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null })
  }, [])

  return { ...state, execute, reset }
}
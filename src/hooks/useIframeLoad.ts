import { useCallback, useEffect, useRef, useState } from 'react'

const IFRAME_TIMEOUT_MS = 8000

interface UseIframeLoadOptions {
  src: string
  enabled: boolean
}

interface UseIframeLoadResult {
  isLoading: boolean
  hasError: boolean
  loadKey: number
  handleLoad: () => void
  handleError: () => void
  retry: () => void
}

export function useIframeLoad({
  src,
  enabled,
}: UseIframeLoadOptions): UseIframeLoadResult {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [loadKey, setLoadKey] = useState(0)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    loadedRef.current = false
    setIsLoading(true)
    setHasError(false)

    const timer = window.setTimeout(() => {
      if (!loadedRef.current) {
        setIsLoading(false)
        setHasError(true)
        console.warn('[AgentPortal] iframe load timeout or blocked:', src)
      }
    }, IFRAME_TIMEOUT_MS)

    return () => window.clearTimeout(timer)
  }, [src, enabled, loadKey])

  const handleLoad = useCallback(() => {
    loadedRef.current = true
    setIsLoading(false)
    setHasError(false)
  }, [])

  const handleError = useCallback(() => {
    loadedRef.current = true
    setIsLoading(false)
    setHasError(true)
    console.warn('[AgentPortal] iframe failed to load:', src)
  }, [src])

  const retry = useCallback(() => {
    setLoadKey((key) => key + 1)
  }, [])

  return {
    isLoading,
    hasError,
    loadKey,
    handleLoad,
    handleError,
    retry,
  }
}

export { IFRAME_TIMEOUT_MS }

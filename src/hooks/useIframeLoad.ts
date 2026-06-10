import { useState, useCallback } from 'react'

export function useIframeLoad() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleError = useCallback(() => {
    setIsLoading(false)
    setHasError(true)
  }, [])

  const reset = useCallback(() => {
    setIsLoading(true)
    setHasError(false)
  }, [])

  return { isLoading, hasError, handleLoad, handleError, reset }
}

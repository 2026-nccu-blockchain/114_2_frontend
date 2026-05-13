/**
 * useAsync Hook
 * Custom hook for managing async operations
 */

import { useState, useCallback, useEffect } from 'react'

interface UseAsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error'
  data: T | null
  error: Error | null
}

interface UseAsyncOptions {
  immediate?: boolean
  onSuccess?: (data: unknown) => void
  onError?: (error: Error) => void
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncOptions = {}
) => {
  const { immediate = false, onSuccess, onError } = options
  const [state, setState] = useState<UseAsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null })

    try {
      const response = await asyncFunction()
      setState({ status: 'success', data: response, error: null })
      onSuccess?.(response)
      return response
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ status: 'error', data: null, error: err })
      onError?.(err)
      throw err
    }
  }, [asyncFunction, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      void (async () => {
        await execute()
      })()
    }
  }, [execute, immediate])

  return { ...state, execute }
}

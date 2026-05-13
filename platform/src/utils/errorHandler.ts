/**
 * Global Error Handler
 * Centralized error handling and logging
 */

import { AxiosError } from 'axios'
import type { ApiError } from '@/types'

export const handleError = (error: unknown): ApiError | null => {
  if (error instanceof AxiosError) {
    const apiError: ApiError = {
      code: error.code ?? 'UNKNOWN_ERROR',
      message: error.message ?? 'An unknown error occurred',
      details: error.response?.data,
      timestamp: new Date().toISOString(),
    }

    // Log error based on environment
    if (import.meta.env.DEV) {
      console.error('[Error]', apiError)
    }

    return apiError
  }

  if (error instanceof Error) {
    const apiError: ApiError = {
      code: 'ERROR',
      message: error.message ?? 'An error occurred',
      timestamp: new Date().toISOString(),
    }

    if (import.meta.env.DEV) {
      console.error('[Error]', apiError)
    }

    return apiError
  }

  console.error('[Unknown Error]', error)
  return null
}

/**
 * Async error wrapper for Promise-based operations
 */
export const handleAsyncError = async <T>(
  fn: () => Promise<T>,
  onError?: (error: ApiError | null) => void
): Promise<T | null> => {
  try {
    return await fn()
  } catch (error) {
    const apiError = handleError(error)
    if (onError) {
      onError(apiError)
    }
    return null
  }
}

/**
 * User-friendly error message mapping
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      return 'Your session has expired. Please log in again.'
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.'
    }
    if (error.response?.status === 404) {
      return 'The requested resource was not found.'
    }
    if (error.response?.status === 500) {
      return 'An error occurred on the server. Please try again later.'
    }
    return error.message || 'An error occurred while processing your request.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}

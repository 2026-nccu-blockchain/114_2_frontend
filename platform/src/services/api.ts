/**
 * HTTP API Client Configuration
 * Centralized axios instance with interceptors
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { handleError } from '@/utils/errorHandler'
import type { ApiError } from '@/types'

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token and logging
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    }

    return config
  },
  (error) => {
    handleError(error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`)
    }

    return response.data
  },
  (error: AxiosError<ApiError>) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const apiError = error.response.data

      console.error(`[API Error] ${status}: ${apiError?.message || 'Unknown error'}`)

      // Handle specific status codes
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      } else if (status === 403) {
        // Forbidden
        console.error('Access denied')
      } else if (status === 404) {
        // Not found
        console.error('Resource not found')
      } else if (status >= 500) {
        // Server error
        console.error('Server error occurred')
      }
    } else if (error.request) {
      // Request made but no response
      console.error('[API Error] No response from server', error.request)
    } else {
      // Error in request setup
      console.error('[API Error]', error.message)
    }

    handleError(error)
    return Promise.reject(error)
  }
)

export default apiClient

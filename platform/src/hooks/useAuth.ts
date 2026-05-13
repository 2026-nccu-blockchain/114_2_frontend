/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useCallback } from 'react'
import { useAuthStore } from '@/store'
import { authApi, type LoginRequest } from '@/services'
import { handleAsyncError, getErrorMessage } from '@/utils'

export const useAuth = () => {
  const { token, user, isAuthenticated, isLoading, error, setLoading, setError, login, logout } =
    useAuthStore()

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true)
      setError(null)

      const result = await handleAsyncError(
        () => authApi.login(credentials),
        (err) => {
          const message = getErrorMessage(err)
          setError(message)
        }
      )

      setLoading(false)

      if (result) {
        login(result.data.user, result.data.token)
        return true
      }

      return false
    },
    [setLoading, setError, login]
  )

  const handleLogout = useCallback(async () => {
    setLoading(true)

    await handleAsyncError(
      () => authApi.logout(),
      (err) => {
        const message = getErrorMessage(err)
        console.warn('Logout error:', message)
      }
    )

    logout()
    setLoading(false)
  }, [setLoading, logout])

  return {
    token,
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    setError,
  }
}

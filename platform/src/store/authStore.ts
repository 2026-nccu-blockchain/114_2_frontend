/**
 * Authentication Store
 * Zustand store for managing auth state
 */

import { create } from 'zustand'
import type { IUser, IAuthState } from '@/types'

interface AuthStore extends IAuthState {
  setToken: (token: string | null) => void
  setUser: (user: IUser | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (user: IUser, token: string) => void
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('auth_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token)
      set({ token, isAuthenticated: true })
    } else {
      localStorage.removeItem('auth_token')
      set({ token: null, isAuthenticated: false })
    }
  },

  setUser: (user) => { set({ user }) },

  setLoading: (loading) => { set({ isLoading: loading }) },

  setError: (error) => { set({ error }) },

  login: (user, token) => {
    localStorage.setItem('auth_token', token)
    set({ user, token, isAuthenticated: true, error: null })
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    set({ user: null, token: null, isAuthenticated: false, error: null })
  },

  clearError: () => { set({ error: null }) },
}))

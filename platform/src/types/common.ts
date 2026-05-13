/**
 * Common Type Definitions
 * Shared types used across the application
 */

export type Optional<T> = T | null | undefined

export type Nullable<T> = T | null

export interface IUser {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface IAuthState {
  token: Optional<string>
  user: Optional<IUser>
  isAuthenticated: boolean
  isLoading: boolean
  error: Optional<string>
}

export interface RequestConfig {
  timeout?: number
  retries?: number
  headers?: Record<string, string>
}

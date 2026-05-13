/**
 * Application Constants
 * Centralized constant definitions
 */

export const API_TIMEOUT = 10000
export const REQUEST_RETRY_COUNT = 3
export const TOKEN_STORAGE_KEY = 'auth_token'
export const USER_STORAGE_KEY = 'user_data'

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const

export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const

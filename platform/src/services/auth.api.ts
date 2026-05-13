/**
 * Auth API Service
 * API calls related to authentication
 */

import { apiClient } from './api'
import type { ApiResponse, IUser } from '@/types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: IUser
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export const authApi = {
  /**
   * User login
   */
  login: async (credentials: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      credentials
    )
    return response.data
  },

  /**
   * User registration
   */
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<IUser>>('/auth/register', data)
    return response.data
  },

  /**
   * User logout
   */
  logout: async () => {
    const response = await apiClient.post<ApiResponse<null>>('/auth/logout')
    return response.data
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async () => {
    const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh')
    return response.data
  },
}

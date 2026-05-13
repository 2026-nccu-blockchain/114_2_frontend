/**
 * User API Service
 * API calls related to user operations
 */

import { apiClient } from './api'
import type { IUser, ApiResponse } from '@/types'

export const userApi = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<IUser>>('/users/profile')
    return response.data
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<IUser>) => {
    const response = await apiClient.put<ApiResponse<IUser>>('/users/profile', data)
    return response.data
  },

  /**
   * Get user by ID
   */
  getUser: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<IUser>>(`/users/${userId}`)
    return response.data
  },

  /**
   * List all users
   */
  listUsers: async (page = 1, pageSize = 20) => {
    const response = await apiClient.get<ApiResponse<IUser[]>>('/users', {
      params: { page, pageSize },
    })
    return response.data
  },
}

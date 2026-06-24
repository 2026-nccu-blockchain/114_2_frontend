import { apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/common';

export interface BaseResponse {
  status_code: string;
  message: string;
  datetime: string;
}

type ProfileRole = 'admin' | 'buyer' | 'seller' | 'driver';

interface CachedProfileRequest {
  expiresAt: number;
  request: Promise<ApiResponse<any>>;
}

const PROFILE_CACHE_MS = 2_000;
const profileRequests = new Map<string, CachedProfileRequest>();

const getProfile = (role: ProfileRole, token: string) => {
  const cacheKey = `${role}:${token}`;
  const cached = profileRequests.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.request;
  }

  const request = apiRequest<any>(`/${role}/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  }).catch((error) => {
    profileRequests.delete(cacheKey);
    throw error;
  });

  profileRequests.set(cacheKey, {
    expiresAt: Date.now() + PROFILE_CACHE_MS,
    request,
  });

  return request;
};

const invalidateProfile = (role: ProfileRole, token: string) => {
  profileRequests.delete(`${role}:${token}`);
};

export const userService = {
  //buyer
  getBuyer: (token: string) => {
    return getProfile('buyer', token);
  },
  updateBuyer: async (data: any, token: string) => {
    const response = await apiRequest<any>('/buyer/me', {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    invalidateProfile('buyer', token);
    return response;
  },
  deleteBuyer: (buyerId: string, token: string) => {
    return apiRequest<BaseResponse>(`/api/v2/buyer/${buyerId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  //seller
  getSeller: (token: string) => {
    return getProfile('seller', token);
  },
  updateSeller: async (data: any, token: string) => {
    const response = await apiRequest<any>('/seller/me', {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    invalidateProfile('seller', token);
    return response;
  },
  deleteSeller: (sellerId: string, token: string) => {
    return apiRequest<BaseResponse>(`/api/v2/seller/${sellerId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  //driver
  getDriver: (token: string) => {
    return getProfile('driver', token);
  },
  updateDriver: async (data: any, token: string) => {
    const response = await apiRequest<any>('/driver/me', {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    invalidateProfile('driver', token);
    return response;
  },
  deleteDriver: (driverId: string, token: string) => {
    return apiRequest<BaseResponse>(`/api/v2/driver/${driverId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  //admin
  getAdmin: (token: string) => {
    return getProfile('admin', token);
  },
  updateAdmin: async (data: any, token: string) => {
    const response = await apiRequest<any>('/admin/me', {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    invalidateProfile('admin', token);
    return response;
  },
};

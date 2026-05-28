import { apiRequest } from '@/services/api';

export interface AuthResponse {
  status_code: string;
  message: string;
  datetime: string;
  token?: string;
}

export const authService = {
  //login
  buyerLogin: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/buyer/login', {
      method: 'POST',
      body: data,
    });
  },
  sellerLogin: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/seller/login', {
      method: 'POST',
      body: data,
    });
  },
  adminLogin: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/admin/login', {
      method: 'POST',
      body: data,
    });
  },
  driverLogin: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/driver/login', {
      method: 'POST',
      body: data,
    });
  },
  //register
  buyerRegister: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/buyer/register', {
      method: 'POST',
      body: data,
    });
  },
  sellerRegister: (data: any, token: string) => {
    return apiRequest<AuthResponse>('/api/v2/auth/seller/register', {
      method: 'POST',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  adminRegister: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/admin/register', {
      method: 'POST',
      body: data,
    });
  },
  driverRegister: (data: any, token: string) => {
    return apiRequest<AuthResponse>('/api/v2/auth/driver/register', {
      method: 'POST',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};
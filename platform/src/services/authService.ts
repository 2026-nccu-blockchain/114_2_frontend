import { apiRequest } from '@/services/api';

export interface AuthResponse {
  status_code: string;
  message: string;
  response_datetime?: string;
  datetime?: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const authService = {
  //login
  buyerLogin: (data: LoginRequest) => {
    return apiRequest<AuthResponse>('/auth/buyer/login', {
      method: 'POST',
      body: data,
    });
  },
  sellerLogin: (data: LoginRequest) => {
    return apiRequest<AuthResponse>('/auth/seller/login', {
      method: 'POST',
      body: data,
    });
  },
  adminLogin: (data: LoginRequest) => {
    return apiRequest<AuthResponse>('/auth/admin/login', {
      method: 'POST',
      body: data,
    });
  },
  driverLogin: (data: LoginRequest) => {
    return apiRequest<AuthResponse>('/auth/driver/login', {
      method: 'POST',
      body: data,
    });
  },
  //register
  buyerRegister: (data: any) => {
    return apiRequest<AuthResponse>('/auth/buyer/register', {
      method: 'POST',
      body: data,
    });
  },
  sellerRegister: (data: any, token: string) => {
    return apiRequest<AuthResponse>('/auth/seller/register', {
      method: 'POST',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  adminRegister: (data: any) => {
    return apiRequest<AuthResponse>('/auth/admin/register', {
      method: 'POST',
      body: data,
    });
  },
  driverRegister: (data: any, token: string) => {
    return apiRequest<AuthResponse>('/auth/driver/register', {
      method: 'POST',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};

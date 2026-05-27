import { apiRequest } from './api';

export interface AuthResponse {
  status_code: string;
  message: string;
  datetime: string;
  token?: string;
}

export const authService = {
  //buyer
  buyerLogin: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/buyer/login', {
      method: 'POST',
      body: data,
    });
  },
  buyerRegister: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/buyer/register', {
      method: 'POST',
      body: data,
    });
  },
  //seller
  sellerLogin: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/seller/login', {
      method: 'POST',
      body: data,
    });
  },
  //Admin
  adminLogin: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/admin/login', {
      method: 'POST',
      body: data,
    });
  },
  //Driver
  driverLogin: (data: any) => {
    return apiRequest<AuthResponse>('/api/v2/auth/driver/login', {
      method: 'POST',
      body: data,
    });
  }
};
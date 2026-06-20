import { apiRequest } from '@/services/api';

export interface BaseResponse {
  status_code: string;
  message: string;
  datetime: string;
}

export const userService = {
  //buyer
  getBuyer: (token: string) => {
    return apiRequest<any>('/buyer/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  updateBuyer: (data: any, token: string) => {
    return apiRequest<any>('/buyer/me', {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  deleteBuyer: (buyerId: string, token: string) => {
    return apiRequest<BaseResponse>(`/buyer/${buyerId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  //seller
  getSeller: (token: string) => {
    return apiRequest<any>('/seller/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  updateSeller: (data: any, token: string) => {
    return apiRequest<any>('/seller/me', {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  deleteSeller: (sellerId: string, token: string) => {
    return apiRequest<BaseResponse>(`/seller/${sellerId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  //driver
  getDriver: (token: string) => {
    return apiRequest<any>('/driver/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  updateDriver: (data: any, token: string) => {
    return apiRequest<any>('/driver/me', {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  deleteDriver: (driverId: string, token: string) => {
    return apiRequest<BaseResponse>(`/driver/${driverId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  //admin
  getAdmin: (token: string) => {
    return apiRequest<any>('/admin/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  updateAdmin: (data: any, token: string) => {
    return apiRequest<any>('/admin/me', {
      method: 'PUT',
      body: data,
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
};
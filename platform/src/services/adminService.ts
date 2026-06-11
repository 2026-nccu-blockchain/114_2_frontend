import { apiRequest } from '@/services/api';

export type AdminUserRole = 'buyer' | 'seller' | 'driver';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: 'Active';
  phone?: string;
  avatarUrl?: string;
}

interface AdminBaseResponse {
  status_code: string;
  message: string;
  response_datetime: string;
}

interface BuyerDto {
  uuid: string;
  email: string;
  phone: string;
  name: string;
  avatar_url?: string;
  address?: string;
}

interface SellerDto extends BuyerDto {
  company_address?: string;
  company_phone?: string;
  company_name?: string;
}

interface DriverDto extends BuyerDto {}

interface BuyerListResponse extends AdminBaseResponse {
  buyer?: BuyerDto[];
}

interface SellerListResponse extends AdminBaseResponse {
  seller?: SellerDto[];
}

interface DriverListResponse extends AdminBaseResponse {
  driver?: DriverDto[];
}

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

const assertSuccess = (response: AdminBaseResponse) => {
  if (response.status_code !== '00000') {
    throw new Error(response.message || `Admin API error (${response.status_code})`);
  }
};

const mapBuyer = (user: BuyerDto): AdminUserRecord => ({
  id: user.uuid,
  name: user.name,
  email: user.email,
  role: 'buyer',
  status: 'Active',
  phone: user.phone,
  avatarUrl: user.avatar_url,
});

const mapSeller = (user: SellerDto): AdminUserRecord => ({
  id: user.uuid,
  name: user.company_name || user.name,
  email: user.email,
  role: 'seller',
  status: 'Active',
  phone: user.company_phone || user.phone,
  avatarUrl: user.avatar_url,
});

const mapDriver = (user: DriverDto): AdminUserRecord => ({
  id: user.uuid,
  name: user.name,
  email: user.email,
  role: 'driver',
  status: 'Active',
  phone: user.phone,
  avatarUrl: user.avatar_url,
});

export const adminService = {
  getBuyers: async (token: string): Promise<AdminUserRecord[]> => {
    const { data } = await apiRequest<BuyerListResponse>('/admin/buyer', {
      method: 'GET',
      headers: authHeaders(token),
    });
    assertSuccess(data);
    return (data.buyer ?? []).map(mapBuyer);
  },

  getSellers: async (token: string): Promise<AdminUserRecord[]> => {
    const { data } = await apiRequest<SellerListResponse>('/admin/seller', {
      method: 'GET',
      headers: authHeaders(token),
    });
    assertSuccess(data);
    return (data.seller ?? []).map(mapSeller);
  },

  getDrivers: async (token: string): Promise<AdminUserRecord[]> => {
    const { data } = await apiRequest<DriverListResponse>('/admin/driver', {
      method: 'GET',
      headers: authHeaders(token),
    });
    assertSuccess(data);
    return (data.driver ?? []).map(mapDriver);
  },

  getAllUsers: async (token: string): Promise<AdminUserRecord[]> => {
    const [buyers, sellers, drivers] = await Promise.all([
      adminService.getBuyers(token),
      adminService.getSellers(token),
      adminService.getDrivers(token),
    ]);

    return [...buyers, ...sellers, ...drivers];
  },
};

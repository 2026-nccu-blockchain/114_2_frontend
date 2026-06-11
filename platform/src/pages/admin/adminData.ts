export type AdminUserRole = 'admin' | 'buyer' | 'seller' | 'driver';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: 'Active' | 'Pending';
}

export const adminUsers: AdminUser[] = [
  {
    id: 'USR-1000',
    name: 'Platform Admin',
    email: 'admin@demo.local',
    role: 'admin',
    status: 'Active',
  },
  {
    id: 'USR-1001',
    name: 'Mia Chen',
    email: 'mia.buyer@demo.local',
    role: 'buyer',
    status: 'Active',
  },
  {
    id: 'USR-1002',
    name: 'Demo Seller',
    email: 'seller@demo.local',
    role: 'seller',
    status: 'Active',
  },
  {
    id: 'USR-1003',
    name: 'Driver Lin',
    email: 'driver@demo.local',
    role: 'driver',
    status: 'Active',
  },
  {
    id: 'USR-1004',
    name: 'Ariel Wu',
    email: 'ariel.buyer@demo.local',
    role: 'buyer',
    status: 'Active',
  },
  {
    id: 'USR-1005',
    name: 'Jason Ho',
    email: 'jason.seller@demo.local',
    role: 'seller',
    status: 'Pending',
  },
];

export const getAdminUserStats = () => {
  const admins = adminUsers.filter((user) => user.role === 'admin').length;
  const buyers = adminUsers.filter((user) => user.role === 'buyer').length;
  const sellers = adminUsers.filter((user) => user.role === 'seller').length;
  const drivers = adminUsers.filter((user) => user.role === 'driver').length;

  return {
    totalUsers: adminUsers.length,
    admins,
    buyers,
    sellers,
    drivers,
  };
};

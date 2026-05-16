import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  User,
  Users,
  UserPlus,
  Truck,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { type UserRole } from '@/store/authStore';

export interface NavItem {
  name: string;
  path: string;
  icon: any;
}

export const getNavItems = (role: UserRole | null): NavItem[] => {
  if (!role) return [];

  switch (role) {
    case 'seller':
      return [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard }, 
        { name: 'Products', path: '/products', icon: Package },
        { name: 'Add Product', path: '/add-product', icon: PlusCircle },
        { name: 'Orders', path: '/orders', icon: ShoppingBag },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    case 'buyer':
      return [
        { name: 'Products', path: '/', icon: Package }, 
        { name: 'My Orders', path: '/orders', icon: FileText },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    case 'driver':
      return [
        { name: 'Available Tasks', path: '/', icon: Truck }, 
        { name: 'Active Delivery', path: '/active', icon: Package },
        { name: 'Completed', path: '/completed', icon: CheckCircle },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    case 'admin':
      return [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard }, 
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Add Seller', path: '/add-seller', icon: UserPlus },
        { name: 'Add Driver', path: '/add-driver', icon: UserPlus },
        { name: 'Profile', path: '/profile', icon: User },
      ];
    default:
      return [];
  }
};
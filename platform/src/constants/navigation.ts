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

export const getNavItems = (role: UserRole): NavItem[] => {
  switch (role) {
    case 'seller':
      return [
        { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
        { name: 'Products', path: '/seller/products', icon: Package },
        { name: 'Add Product', path: '/seller/add-product', icon: PlusCircle },
        { name: 'Orders', path: '/seller/orders', icon: ShoppingBag },
        { name: 'Profile', path: '/seller/profile', icon: User },
      ];
    case 'buyer':
      return [
        { name: 'Products', path: '/buyer', icon: Package },
        { name: 'My Orders', path: '/buyer/orders', icon: FileText },
        { name: 'Profile', path: '/buyer/profile', icon: User },
      ];
    case 'driver':
      return [
        { name: 'Available Tasks', path: '/driver', icon: Truck },
        { name: 'Active Delivery', path: '/driver/active', icon: Package },
        { name: 'Completed', path: '/driver/completed', icon: CheckCircle },
        { name: 'Profile', path: '/driver/profile', icon: User },
      ];
    case 'admin':
      return [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Add Seller', path: '/admin/add-seller', icon: UserPlus },
        { name: 'Add Driver', path: '/admin/add-driver', icon: UserPlus },
        { name: 'Profile', path: '/admin/profile', icon: User },
      ];
    default:
      return [];
  }
};

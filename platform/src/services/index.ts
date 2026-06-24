/**
 * API Services Export
 * Central export point for service helpers
 */

export { apiRequest } from '@/services/api';
export * as orderApi from '@/services/orderApi';
export * as driverApi from '@/services/driverApi';


export { adminService } from '@/services/adminService';
export type { AdminUserRecord } from '@/services/adminService';
export { authService } from '@/services/authService';

export * as cartApi from '@/services/cartApi';

export type { AuthResponse } from '@/services/authService';
export { userService } from '@/services/userService';
export type { BaseResponse } from '@/services/userService';
export { uploadService } from '@/services/uploadService';
export { productService } from '@/services/productService';
export type { ProductItem } from '@/services/productService';


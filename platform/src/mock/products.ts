import { type Product } from '@/types';

export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'COD Starter Kit',
    description: 'Starter pack for quick COD store setup. Includes everything you need to begin your journey.',
    price: 890,
    stock: 25,
    category: 'Starter',
    sellerId: 'seller_123',
    sellerName: 'Demo Seller',
    imageUrl: 'https://via.placeholder.com/300x300?text=Starter+Kit' // 暫時用預設圖代替
  },
  {
    id: 'prod_002',
    name: 'Delivery Box M',
    description: 'Standard medium sized delivery box. Perfect for everyday shipping needs.',
    price: 120,
    stock: 120,
    category: 'Packaging',
    sellerId: 'seller_123',
    sellerName: 'Demo Seller',
    imageUrl: 'https://via.placeholder.com/300x300?text=Delivery+Box'
  },
  {
    id: 'prod_003',
    name: 'Thermal Bag',
    description: 'High-quality thermal bag to keep deliveries fresh and at the right temperature.',
    price: 350,
    stock: 50,
    category: 'Delivery',
    sellerId: 'seller_124',
    sellerName: 'Pro Logistics',
    imageUrl: 'https://via.placeholder.com/300x300?text=Thermal+Bag'
  }
];
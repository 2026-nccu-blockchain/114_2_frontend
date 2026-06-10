import { type Product } from '@/types';

export const mockProducts: Product[] = [
  {
    uuid: 'mock-product-001',
    pid: 'P000001',
    name: 'COD Starter Kit',
    desc: 'Starter pack for quick COD store setup. Includes everything you need to begin your journey.',
    price: 890,
    stock: 25,
    status: true,
    type: 'Starter',
    seller_id: 'seller_123',
    product_url: 'https://via.placeholder.com/300x300?text=Starter+Kit',
  },
  {
    uuid: 'mock-product-002',
    pid: 'P000002',
    name: 'Delivery Box M',
    desc: 'Standard medium sized delivery box. Perfect for everyday shipping needs.',
    price: 120,
    stock: 120,
    status: true,
    type: 'Packaging',
    seller_id: 'seller_123',
    product_url: 'https://via.placeholder.com/300x300?text=Delivery+Box',
  },
  {
    uuid: 'mock-product-003',
    pid: 'P000003',
    name: 'Thermal Bag',
    desc: 'High-quality thermal bag to keep deliveries fresh and at the right temperature.',
    price: 350,
    stock: 50,
    status: true,
    type: 'Delivery',
    seller_id: 'seller_124',
    product_url: 'https://via.placeholder.com/300x300?text=Thermal+Bag',
  }
];

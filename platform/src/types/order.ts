// src/types/order.ts
import { type CartItem } from './product';

export interface Order {
  id: string;
  createdAt: string;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingStatus: 'Assigned' | 'In Transit' | 'Out for Delivery' | 'Completed';
  items: CartItem[];
  total: number;
  recipientName: string;
  phone: string;
  address: string;
  notes?: string;
}
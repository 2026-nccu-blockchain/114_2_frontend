import { create } from 'zustand';
import { type Order } from '@/types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingStatus'>) => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // 範例訂單
  orders: [
    {
      id: 'order_00',
      createdAt: 'May 21, 2026, 02:21 PM',
      status: 'Confirmed',
      trackingStatus: 'Assigned',
      total: 1010,
      recipientName: 'Demo Buyer',
      phone: '0912-000-111',
      address: 'Taipei City, Xinyi Rd. No. 88',
      notes: 'Leave at the front desk.',
      items: [
        {
          id: 'prod_001',
          name: 'COD Starter Kit',
          description: '',
          price: 890,
          stock: 25,
          category: 'Starter',
          sellerId: 's1',
          sellerName: 'Demo Seller',
          quantity: 1
        },
        {
          id: 'prod_002',
          name: 'Delivery Box M',
          description: '',
          price: 120,
          stock: 120,
          category: 'Packaging',
          sellerId: 's1',
          sellerName: 'Demo Seller',
          quantity: 1
        }
      ]
    }
  ],

  // 創建新訂單
  addOrder: (newOrder) => {
    set((state) => {
      const orderId = `order_${String(state.orders.length).padStart(2, '0')}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

      const fullOrder: Order = {
        ...newOrder,
        id: orderId,
        createdAt: formattedDate,
        status: 'Confirmed',
        trackingStatus: 'Assigned',
      };

      return { orders: [fullOrder, ...state.orders] }; 
    });
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),
}));
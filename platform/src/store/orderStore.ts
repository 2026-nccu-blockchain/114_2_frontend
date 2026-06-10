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
          uuid: 'mock-uuid-1',
          pid: 'prod_001',        
          name: 'COD Starter Kit',
          price: 890,
          stock: 25,
          status: true,      
          type: 'Starter',    
          desc: '',                  
          seller_id: 's1',           
          product_url: '',           
          quantity: 1
        },
        {
          uuid: 'mock-uuid-2',
          pid: 'prod_002',
          name: 'Delivery Box M',
          price: 120,
          stock: 120,
          status: true,
          type: 'Packaging',
          desc: '',
          seller_id: 's1',
          product_url: '',
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
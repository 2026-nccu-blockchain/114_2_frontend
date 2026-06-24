import { create } from 'zustand';
import { driverApi, orderApi } from '@/services';
import { type Order, type OrderStatus } from '@/types';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  createOrder: (toAddress: string) => Promise<Order>;
  fetchMyOrders: () => Promise<Order[]>;
  fetchAvailableOrders: () => Promise<Order[]>;
  fetchOrderById: (id: string) => Promise<Order>;
  takeOrder: (id: string) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return fallback;
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  createOrder: async (toAddress) => {
    set({ isLoading: true, error: null });

    try {
      const order = await orderApi.createOrder(toAddress);
      set((state) => ({
        orders: [order, ...state.orders.filter((currentOrder) => currentOrder.id !== order.id)],
        selectedOrder: order,
        isLoading: false,
      }));
      return order;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to create order'), isLoading: false });
      throw error;
    }
  },

  fetchMyOrders: async () => {
    set({ isLoading: true, error: null });

    try {
      const orders = await orderApi.getMyOrders();
      set({ orders, isLoading: false });
      return orders;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to load orders'), isLoading: false });
      throw error;
    }
  },

  fetchAvailableOrders: async () => {
    set({ isLoading: true, error: null });

    try {
      const orders = await driverApi.getAvailableOrders();
      set({ orders, isLoading: false });
      return orders;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to load available orders'), isLoading: false });
      throw error;
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const order = await orderApi.getOrder(id);
      set((state) => ({
        selectedOrder: order,
        orders: state.orders.some((currentOrder) => currentOrder.id === id)
          ? state.orders.map((currentOrder) => (currentOrder.id === id ? order : currentOrder))
          : [order, ...state.orders],
        isLoading: false,
      }));
      return order;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to load order'), isLoading: false });
      throw error;
    }
  },

  takeOrder: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const order = await driverApi.takeOrder(id);
      set((state) => ({
        selectedOrder: order,
        orders: state.orders.filter((currentOrder) => currentOrder.id !== id),
        isLoading: false,
      }));
      return order;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to take order'), isLoading: false });
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ isLoading: true, error: null });

    try {
      const order = await orderApi.updateOrderStatus(id, status);
      set((state) => ({
        selectedOrder: order,
        orders: state.orders.map((currentOrder) => (currentOrder.id === id ? order : currentOrder)),
        isLoading: false,
      }));
      return order;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to update order'), isLoading: false });
      throw error;
    }
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),
}));

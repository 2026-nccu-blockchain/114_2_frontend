import { create } from 'zustand';
import { type CartItem, type Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // 加入購物車
  addItem: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.pid === product.pid);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.pid === product.pid
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return { items: [...state.items, { ...product, quantity }] };
    });
  },

  // 移除商品
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.pid !== productId),
    }));
  },

  // 更新數量
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.pid === productId ? { ...item, quantity } : item
      ),
    }));
  },

  // 清空購物車
  clearCart: () => set({ items: [] }),

  // 取得總金額
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
import { create } from 'zustand';
import { cartApi } from '@/services';
import { type CartItem, type Product } from '@/types';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (product: Product, quantity: number) => Promise<CartItem>;
  removeItem: (cartId: string) => Promise<void>;
  updateQuantity: (cartId: string, quantity: number) => Promise<CartItem>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<CartItem[]>;
  getTotalPrice: () => number;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return fallback;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: async (product, quantity) => {
    set({ isLoading: true, error: null });

    try {
      const state = get();
      const existingItem = state.items.find((item) => item.uuid === product.uuid);

      if (existingItem && existingItem.cartId) {
        const newQuantity = Number(existingItem.quantity) + Number(quantity);
        await cartApi.updateCartItem(existingItem.cartId, newQuantity);

        set((state) => ({
          items: state.items.map((item) => 
            item.cartId === existingItem.cartId 
              ? { ...item, quantity: newQuantity } 
              : item
          ),
          isLoading: false,
        }));
        void get().fetchCart(); 
        return existingItem; 
      } else {
        const item = await cartApi.addCartItem(product.uuid, quantity);
        await get().fetchCart();
        return item;
      }
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to add item to cart'), isLoading: false });
      throw error;
    }
  },

  removeItem: async (cartId) => {
    set({ isLoading: true, error: null });

    try {
      await cartApi.deleteCartItem(cartId);
      set((state) => ({
        items: state.items.filter((item) => item.cartId !== cartId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to remove item from cart'), isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (cartId, quantity) => {
    set({ isLoading: true, error: null });

    try {
      await cartApi.updateCartItem(cartId, quantity);
      set((state) => ({
        items: state.items.map((item) => 
          item.cartId === cartId 
            ? { ...item, quantity: Number(quantity) } 
            : item
        ),
        isLoading: false,
      }));
      const updatedItem = get().items.find(item => item.cartId === cartId);
      return updatedItem as CartItem;
      
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to update cart item'), isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });

    try {
      const cartIds = get().items.map((item) => item.cartId).filter((cartId): cartId is string => Boolean(cartId));
      await Promise.all(cartIds.map((cartId) => cartApi.deleteCartItem(cartId)));
      set({ items: [], isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to clear cart'), isLoading: false });
      throw error;
    }
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null });

    try {
      const items = await cartApi.getMyCart();
      set({ items, isLoading: false });
      return items;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to load cart'), isLoading: false });
      throw error;
    }
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  },
}));
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
      const item = await cartApi.addCartItem(product.id, quantity);
      set((state) => ({
        items: state.items.some((currentItem) => currentItem.cartId === item.cartId)
          ? state.items.map((currentItem) => (currentItem.cartId === item.cartId ? item : currentItem))
          : [...state.items.filter((currentItem) => currentItem.id !== item.id), item],
        isLoading: false,
      }));
      return item;
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
      const item = await cartApi.updateCartItem(cartId, quantity);
      set((state) => ({
        items: state.items.map((currentItem) => (currentItem.cartId === cartId ? item : currentItem)),
        isLoading: false,
      }));
      return item;
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
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));

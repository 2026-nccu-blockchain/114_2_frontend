import { apiRequest } from '@/services/api';
import { mapCartDtoToCartItem } from '@/services/cartMapper';
import type {
  AddCartRequest,
  CartItemModel,
  CartItemResponse,
  CartListResponse,
  CartMutationResponse,
  UpdateCartRequest,
} from '@/types';

export const addCartItem = async (productId: string, count: number): Promise<CartItemModel> => {
  const { data } = await apiRequest<CartItemResponse>('/carts/cart', {
    method: 'POST',
    body: { product_id: productId, count } satisfies AddCartRequest,
  });

  return mapCartDtoToCartItem(data);
};

export const updateCartItem = async (cartId: string, count: number): Promise<CartItemModel> => {
  const { data } = await apiRequest<CartItemResponse>(`/carts/cart/${cartId}`, {
    method: 'PUT',
    body: { count } satisfies UpdateCartRequest,
  });

  return mapCartDtoToCartItem(data);
};

export const deleteCartItem = async (cartId: string): Promise<void> => {
  await apiRequest<CartMutationResponse>(`/carts/cart/${cartId}`, {
    method: 'DELETE',
  });
};

export const getMyCart = async (): Promise<CartItemModel[]> => {
  const { data } = await apiRequest<CartListResponse>('/carts/me');
  return (data.cart ?? []).map(mapCartDtoToCartItem);
};

import type { CartItem } from '@/types/product';

export interface CartDto {
  cart_id: string;
  product_id: string;
  name: string;
  type: string;
  price: number;
  count: number;
  seller_id: string;
}

export interface CartItemResponse extends CartDto {
  status_code: string;
  message: string;
  response_datetime: string;
}

export interface CartListResponse {
  status_code: string;
  message: string;
  response_datetime: string;
  cart?: CartDto[];
}

export interface CartMutationResponse {
  status_code: string;
  message: string;
  response_datetime: string;
}

export interface AddCartRequest {
  product_id: string;
  count: number;
}

export interface UpdateCartRequest {
  count: number;
}

export type CartItemModel = CartItem;

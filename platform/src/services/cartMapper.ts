import type { CartDto, CartItemModel } from '@/types';

export const mapCartDtoToCartItem = (item: CartDto): CartItemModel => ({
  id: item.product_id,
  cartId: item.cart_id,
  name: item.name,
  description: '',
  price: item.price,
  stock: Number.MAX_SAFE_INTEGER,
  category: item.type,
  sellerId: item.seller_id,
  sellerName: item.seller_id,
  quantity: item.count,
});

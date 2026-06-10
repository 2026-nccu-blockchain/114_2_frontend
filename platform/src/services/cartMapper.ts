import type { CartDto, CartItemModel } from '@/types';

export const mapCartDtoToCartItem = (item: CartDto): CartItemModel => ({
  uuid: item.product_id,
  pid: item.product_id,
  cartId: item.cart_id,
  name: item.name,
  price: item.price,
  stock: Number.MAX_SAFE_INTEGER,
  status: true,
  seller_id: item.seller_id,
  desc: '',
  type: item.type,
  quantity: item.count,
});

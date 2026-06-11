import type { Order, OrderDetailResponse, OrderDto, OrderItem, OrderProductDto } from '@/types';

const mapOrderItem = (item: OrderProductDto): OrderItem => ({
  id: item.product_id,
  name: item.name,
  type: item.type,
  price: item.price,
  quantity: item.count,
  sellerId: item.seller_id,
});

export const mapOrderDtoToOrder = (order: OrderDto, responseDatetime = ''): Order => ({
  id: order.order_id,
  buyerId: order.buyer_id,
  sellerId: order.seller_id,
  driverId: order.driver_id,
  createdAt: responseDatetime,
  fromAddress: order.from_addr,
  toAddress: order.to_addr,
  status: order.order_status,
  total: order.total_price,
  items: order.product?.map(mapOrderItem) ?? [],
});

export const mapOrderDetailResponseToOrder = (response: OrderDetailResponse): Order =>
  mapOrderDtoToOrder(response, response.response_datetime);

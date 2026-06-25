import type { MyOrdersResponse, Order, OrderDetailResponse, OrderDto, OrderItem, OrderProductDto } from '@/types';

const myOrderKeys: Array<keyof Pick<
  MyOrdersResponse,
  | 'ordered_order'
  | 'success_order'
  | 'packed_order'
  | 'deliver_order'
  | 'arrived_order'
  | 'refund_order'
  | 'fail_order'
>> = [
  'ordered_order',
  'success_order',
  'packed_order',
  'deliver_order',
  'arrived_order',
  'refund_order',
  'fail_order',
];

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
  oid: order.oid,
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

export const mapMyOrdersResponseToOrders = (response: MyOrdersResponse): Order[] => {
  const groupedOrders = myOrderKeys.flatMap((key) => response[key] ?? []);
  const orders = groupedOrders.length > 0 ? groupedOrders : response.order ?? [];

  return orders.map((order) => mapOrderDtoToOrder(order, response.response_datetime));
};

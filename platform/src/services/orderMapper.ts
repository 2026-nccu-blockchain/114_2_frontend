import type { MyOrdersResponse, Order, OrderDetailResponse, OrderDto, OrderItem, OrderProductDto } from '@/types';

type OrderMapperOptions = {
  requireItems?: boolean;
  source?: string;
};

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

const requireOrderField = <T>(value: T | null | undefined, field: string, source = 'Order response'): T => {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${source} is missing ${field}`);
  }

  return value;
};

const mapOrderItem = (item: OrderProductDto): OrderItem => ({
  id: requireOrderField(item.product_id, 'product.product_id'),
  name: requireOrderField(item.name, 'product.name'),
  type: requireOrderField(item.type, 'product.type'),
  price: requireOrderField(item.price, 'product.price'),
  quantity: requireOrderField(item.count, 'product.count'),
  sellerId: item.seller_id,
});

export const mapOrderDtoToOrder = (
  order: OrderDto,
  responseDatetime = '',
  options: OrderMapperOptions = {},
): Order => {
  const source = options.source ?? 'Order response';

  if (options.requireItems && !order.product) {
    throw new Error(`${source} is missing product`);
  }

  return {
    id: requireOrderField(order.order_id, 'order_id', source),
    oid: order.oid,
    buyerId: requireOrderField(order.buyer_id, 'buyer_id', source),
    sellerId: requireOrderField(order.seller_id, 'seller_id', source),
    driverId: order.driver_id,
    createdAt: responseDatetime,
    fromAddress: order.from_addr,
    toAddress: requireOrderField(order.to_addr, 'to_addr', source),
    status: requireOrderField(order.order_status, 'order_status', source),
    total: requireOrderField(order.total_price, 'total_price', source),
    items: order.product?.map(mapOrderItem) ?? [],
  };
};

export const mapOrderDetailResponseToOrder = (
  response: OrderDetailResponse,
  options: OrderMapperOptions = {},
): Order => mapOrderDtoToOrder(response, response.response_datetime, {
  source: 'Order detail response',
  ...options,
});

export const mapMyOrdersResponseToOrders = (response: MyOrdersResponse): Order[] => {
  const groupedOrders = myOrderKeys.flatMap((key) => response[key] ?? []);
  const orders = groupedOrders.length > 0 ? groupedOrders : response.order ?? [];

  return orders.map((order) => mapOrderDtoToOrder(order, response.response_datetime, {
    source: 'My orders response',
  }));
};

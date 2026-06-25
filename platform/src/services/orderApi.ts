import { apiRequest } from '@/services/api';
import { mapMyOrdersResponseToOrders, mapOrderDetailResponseToOrder, mapOrderDtoToOrder } from '@/services/orderMapper';
import type {
  CreateOrderRequest,
  MyOrdersResponse,
  Order,
  OrderDetailResponse,
  OrderResponse,
  OrderStatus,
  UpdateOrderStatusRequest,
} from '@/types';

type GetOrderOptions = {
  requireItems?: boolean;
};

export const createOrder = async (toAddress: string): Promise<Order> => {
  const { data } = await apiRequest<OrderResponse>('/orders/order', {
    method: 'POST',
    body: { to_addr: toAddress } satisfies CreateOrderRequest,
  });

  const [order] = data.order ?? [];
  if (!order) throw new Error('Order response is empty');

  return mapOrderDtoToOrder(order, data.response_datetime, {
    requireItems: true,
    source: 'Create order response',
  });
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await apiRequest<MyOrdersResponse>('/orders/me');
  return mapMyOrdersResponseToOrders(data);
};

export const getOrder = async (orderId: string, options: GetOrderOptions = {}): Promise<Order> => {
  const { data } = await apiRequest<OrderDetailResponse>(`/orders/order/${orderId}`);
  return mapOrderDetailResponseToOrder(data, options);
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const { data } = await apiRequest<OrderDetailResponse>(`/orders/order/${orderId}`, {
    method: 'PUT',
    body: { status } satisfies UpdateOrderStatusRequest,
  });

  return mapOrderDetailResponseToOrder(data);
};

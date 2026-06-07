import { apiRequest } from '@/services/api';
import { mapOrderDetailResponseToOrder, mapOrderDtoToOrder } from '@/services/orderMapper';
import type {
  CreateOrderRequest,
  Order,
  OrderDetailResponse,
  OrderResponse,
  OrderStatus,
  UpdateOrderStatusRequest,
} from '@/types';

export const createOrder = async (toAddress: string): Promise<Order> => {
  const { data } = await apiRequest<OrderResponse>('/orders/order', {
    method: 'POST',
    body: { to_addr: toAddress } satisfies CreateOrderRequest,
  });

  const [order] = data.order ?? [];
  if (!order) throw new Error('Order response is empty');

  return mapOrderDtoToOrder(order, data.response_datetime);
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await apiRequest<OrderResponse>('/order/me');
  return (data.order ?? []).map((order) => mapOrderDtoToOrder(order, data.response_datetime));
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const { data } = await apiRequest<OrderDetailResponse>(`/order/${orderId}`);
  return mapOrderDetailResponseToOrder(data);
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const { data } = await apiRequest<OrderDetailResponse>(`/order/${orderId}`, {
    method: 'PUT',
    body: { status } satisfies UpdateOrderStatusRequest,
  });

  return mapOrderDetailResponseToOrder(data);
};

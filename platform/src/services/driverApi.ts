import { apiRequest } from '@/services/api';
import { mapOrderDetailResponseToOrder, mapOrderDtoToOrder } from '@/services/orderMapper';
import type { Order, OrderDetailResponse, OrderResponse } from '@/types';

const assertSuccess = (statusCode: string, message: string) => {
  if (statusCode !== '00000') {
    throw new Error(message || `Driver API error (${statusCode})`);
  }
};

export const getAvailableOrders = async (): Promise<Order[]> => {
  const { data } = await apiRequest<OrderResponse>('/driver/look');
  assertSuccess(data.status_code, data.message);

  return (data.order ?? []).map((order) => mapOrderDtoToOrder(order, data.response_datetime));
};

export const takeOrder = async (orderId: string): Promise<Order> => {
  const { data } = await apiRequest<OrderDetailResponse>(`/driver/take/${orderId}`, {
    method: 'POST',
  });
  assertSuccess(data.status_code, data.message);

  return mapOrderDetailResponseToOrder(data);
};

import Cookies from 'js-cookie';
import type { Order } from '@/types';

export interface DriverTaskItem {
  name: string;
  quantity: number;
}

export interface DriverTask {
  id: string;
  orderId: string;
  orderLabel: string;
  customer: string;
  createdAt: string;
  from: string;
  to: string;
  distance: string;
  items: DriverTaskItem[];
}

const LEGACY_ACTIVE_TASK_KEY = 'driverActiveTaskId';
export const ACTIVE_TASKS_KEY = 'driverActiveTaskIds';
export const COMPLETED_TASKS_KEY = 'driverCompletedTaskIds';

Cookies.remove(LEGACY_ACTIVE_TASK_KEY);
Cookies.remove(ACTIVE_TASKS_KEY);
Cookies.remove(COMPLETED_TASKS_KEY);

export const mapOrderToDriverTask = (order: Order): DriverTask => ({
  id: order.id,
  orderId: order.id,
  orderLabel: order.oid ? `Order ${order.oid}` : 'Order',
  customer: 'Customer',
  createdAt: order.createdAt || 'Order time unavailable',
  from: order.fromAddress || 'Pickup address unavailable',
  to: order.toAddress,
  distance: order.status,
  items: order.items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
  })),
});

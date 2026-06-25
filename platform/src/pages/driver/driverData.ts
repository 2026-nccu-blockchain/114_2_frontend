import Cookies from 'js-cookie';
import type { Order } from '@/types';
//假資料

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

const cookieOptions: Cookies.CookieAttributes = {
  expires: 30,
  sameSite: 'strict',
};

const getStoredIds = (key: string) => {
  const storedIds = Cookies.get(key);
  if (!storedIds) return [];

  try {
    const parsedIds = JSON.parse(storedIds);
    return Array.isArray(parsedIds) ? parsedIds : [];
  } catch {
    return [];
  }
};

const saveStoredIds = (key: string, ids: string[]) => {
  Cookies.set(key, JSON.stringify(ids), cookieOptions);
};

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

export const getCompletedTaskIds = () => {
  return getStoredIds(COMPLETED_TASKS_KEY);
};

export const getActiveTaskIds = () => {
  return getStoredIds(ACTIVE_TASKS_KEY);
};

export const acceptTask = (taskId: string) => {
  const activeIds = getActiveTaskIds();
  const nextIds = activeIds.includes(taskId) ? activeIds : [...activeIds, taskId];

  saveStoredIds(ACTIVE_TASKS_KEY, nextIds);
};

export const completeTask = (taskId: string) => {
  const completedIds = getCompletedTaskIds();
  const nextIds = completedIds.includes(taskId) ? completedIds : [...completedIds, taskId];
  const activeIds = getActiveTaskIds().filter((activeTaskId) => activeTaskId !== taskId);

  saveStoredIds(COMPLETED_TASKS_KEY, nextIds);
  saveStoredIds(ACTIVE_TASKS_KEY, activeIds);
  Cookies.remove(LEGACY_ACTIVE_TASK_KEY);
};

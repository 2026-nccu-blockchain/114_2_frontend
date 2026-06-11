import type { OrderStatus, OrderStatusFilter } from '@/types';

export const statusOptions: Array<{ value: OrderStatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'success', label: 'Success' },
  { value: 'packed', label: 'Packed' },
  { value: 'deliever', label: 'Deliever' },
  { value: 'arrived', label: 'Arrived' },
  { value: 'refund', label: 'Refund' },
  { value: 'fail', label: 'Fail' },
];

export const statusStyles: Record<OrderStatus, string> = {
  refund: 'bg-purple-50 text-purple-700',
  fail: 'bg-red-50 text-red-700',
  ordered: 'bg-amber-50 text-amber-700',
  success: 'bg-emerald-50 text-emerald-700',
  packed: 'bg-blue-50 text-blue-700',
  deliever: 'bg-teal-50 text-teal-700',
  arrived: 'bg-gray-100 text-gray-700',
};

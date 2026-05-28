//假資料

export interface DriverTaskItem {
  name: string;
  quantity: number;
}

export interface DriverTask {
  id: string;
  orderId: string;
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

export const driverTasks: DriverTask[] = [
  {
    id: 'TASK-3001',
    orderId: 'ORD-1003',
    customer: 'Ariel Wu',
    createdAt: 'May 20, 2026, 4:35 PM',
    from: 'No. 12, Seller Warehouse, Taipei',
    to: 'No. 8, Renai Rd., New Taipei',
    distance: '8.4 km',
    items: [{ name: 'Cold Brew Pack', quantity: 2 }],
  },
  {
    id: 'TASK-3002',
    orderId: 'ORD-1004',
    customer: 'Jason Ho',
    createdAt: 'May 20, 2026, 1:10 PM',
    from: 'No. 12, Seller Warehouse, Taipei',
    to: 'No. 20, Xinyi Rd., Taipei',
    distance: '3.1 km',
    items: [{ name: 'Organic Apple Box', quantity: 1 }],
  },
  {
    id: 'TASK-3003',
    orderId: 'ORD-1008',
    customer: 'Eva Liu',
    createdAt: 'May 21, 2026, 2:45 PM',
    from: 'No. 5, Fresh Market Hub, Taipei',
    to: 'No. 90, Heping E. Rd., Taipei',
    distance: '5.6 km',
    items: [
      { name: 'Honey Oat Granola', quantity: 2 },
      { name: 'Seasonal Jam Set', quantity: 1 },
    ],
  },
];

export const getCompletedTaskIds = () => {
  const storedIds = window.localStorage.getItem(COMPLETED_TASKS_KEY);
  if (!storedIds) return [];

  try {
    const parsedIds = JSON.parse(storedIds);
    return Array.isArray(parsedIds) ? parsedIds : [];
  } catch {
    return [];
  }
};

export const getActiveTaskIds = () => {
  const storedIds = window.localStorage.getItem(ACTIVE_TASKS_KEY);

  if (storedIds) {
    try {
      const parsedIds = JSON.parse(storedIds);
      return Array.isArray(parsedIds) ? parsedIds : [];
    } catch {
      return [];
    }
  }

  const legacyTaskId = window.localStorage.getItem(LEGACY_ACTIVE_TASK_KEY);
  if (!legacyTaskId) return [];

  window.localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify([legacyTaskId]));
  window.localStorage.removeItem(LEGACY_ACTIVE_TASK_KEY);
  return [legacyTaskId];
};

export const acceptTask = (taskId: string) => {
  const activeIds = getActiveTaskIds();
  const nextIds = activeIds.includes(taskId) ? activeIds : [...activeIds, taskId];

  window.localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(nextIds));
};

export const completeTask = (taskId: string) => {
  const completedIds = getCompletedTaskIds();
  const nextIds = completedIds.includes(taskId) ? completedIds : [...completedIds, taskId];
  const activeIds = getActiveTaskIds().filter((activeTaskId) => activeTaskId !== taskId);

  window.localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(nextIds));
  window.localStorage.setItem(ACTIVE_TASKS_KEY, JSON.stringify(activeIds));
  window.localStorage.removeItem(LEGACY_ACTIVE_TASK_KEY);
};

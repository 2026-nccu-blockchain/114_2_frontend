export type OrderStatus = 'all' | 'refund' | 'fail' | 'ordered' | 'success' | 'packed' | 'deliever' | 'arrived';

export interface OrderItem {
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  customer: string;
  status: Exclude<OrderStatus, 'all'>;
  createdAt: string;
  total: string;
  items: OrderItem[];
  delivery: {
    recipient: string;
    phone: string;
    address: string;
    driver: string;
  };
}

export const statusOptions: Array<{ value: OrderStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'success', label: 'Success' },
  { value: 'packed', label: 'Packed' },
  { value: 'deliever', label: 'Deliever' },
  { value: 'arrived', label: 'Arrived' },
  { value: 'refund', label: 'Refund' },
  { value: 'fail', label: 'Fail' },
];

export const statusStyles: Record<Exclude<OrderStatus, 'all'>, string> = {
  refund: 'bg-purple-50 text-purple-700',
  fail: 'bg-red-50 text-red-700',
  ordered: 'bg-amber-50 text-amber-700',
  success: 'bg-emerald-50 text-emerald-700',
  packed: 'bg-blue-50 text-blue-700',
  deliever: 'bg-teal-50 text-teal-700',
  arrived: 'bg-gray-100 text-gray-700',
};

export const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    customer: 'Mia Chen',
    status: 'ordered',
    createdAt: 'May 21, 2026, 9:20 AM',
    total: '$56.50',
    items: [
      { name: 'Organic Apple Box', quantity: 2, price: '$48.00' },
      { name: 'Honey Oat Granola', quantity: 1, price: '$8.50' },
    ],
    delivery: {
      recipient: 'Mia Chen',
      phone: '0912-345-678',
      address: 'No. 18, Zhongshan Rd., Taipei',
      driver: 'Unassigned',
    },
  },
  {
    id: 'ORD-1002',
    customer: 'Daniel Lin',
    status: 'success',
    createdAt: 'May 21, 2026, 10:05 AM',
    total: '$32.00',
    items: [{ name: 'Seasonal Jam Set', quantity: 1, price: '$32.00' }],
    delivery: {
      recipient: 'Daniel Lin',
      phone: '0988-222-109',
      address: 'No. 56, Minsheng E. Rd., Taipei',
      driver: 'Unassigned',
    },
  },
  {
    id: 'ORD-1003',
    customer: 'Ariel Wu',
    status: 'packed',
    createdAt: 'May 20, 2026, 4:35 PM',
    total: '$36.00',
    items: [{ name: 'Cold Brew Pack', quantity: 2, price: '$36.00' }],
    delivery: {
      recipient: 'Ariel Wu',
      phone: '0966-781-201',
      address: 'No. 8, Renai Rd., New Taipei',
      driver: 'Kai Driver',
    },
  },
  {
    id: 'ORD-1004',
    customer: 'Jason Ho',
    status: 'deliever',
    createdAt: 'May 20, 2026, 1:10 PM',
    total: '$24.00',
    items: [{ name: 'Organic Apple Box', quantity: 1, price: '$24.00' }],
    delivery: {
      recipient: 'Jason Ho',
      phone: '0933-456-700',
      address: 'No. 20, Xinyi Rd., Taipei',
      driver: 'Kai Driver',
    },
  },
  {
    id: 'ORD-1005',
    customer: 'Nina Tsai',
    status: 'refund',
    createdAt: 'May 19, 2026, 11:50 AM',
    total: '$12.50',
    items: [{ name: 'Honey Oat Granola', quantity: 1, price: '$12.50' }],
    delivery: {
      recipient: 'Nina Tsai',
      phone: '0921-009-119',
      address: 'No. 3, Roosevelt Rd., Taipei',
      driver: 'Unassigned',
    },
  },
  {
    id: 'ORD-1006',
    customer: 'Owen Lee',
    status: 'arrived',
    createdAt: 'May 18, 2026, 3:25 PM',
    total: '$42.50',
    items: [
      { name: 'Cold Brew Pack', quantity: 1, price: '$18.00' },
      { name: 'Organic Apple Box', quantity: 1, price: '$24.50' },
    ],
    delivery: {
      recipient: 'Owen Lee',
      phone: '0919-882-001',
      address: 'No. 77, Bade Rd., Taipei',
      driver: 'Luna Driver',
    },
  },
  {
    id: 'ORD-1007',
    customer: 'Ivy Wang',
    status: 'fail',
    createdAt: 'May 17, 2026, 5:40 PM',
    total: '$18.00',
    items: [{ name: 'Cold Brew Pack', quantity: 1, price: '$18.00' }],
    delivery: {
      recipient: 'Ivy Wang',
      phone: '0900-111-222',
      address: 'No. 9, Songshan Rd., Taipei',
      driver: 'Unassigned',
    },
  },
];

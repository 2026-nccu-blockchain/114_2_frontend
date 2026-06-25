export type OrderStatus = 'refund' | 'fail' | 'ordered' | 'success' | 'packed' | 'deliever' | 'arrived';

export type OrderStatusFilter = 'all' | OrderStatus;

export interface OrderProductDto {
  product_id: string;
  name: string;
  type: string;
  price: number;
  count: number;
  seller_id?: string;
}

export interface OrderDto {
  order_id: string;
  oid?: string;
  buyer_id: string;
  seller_id: string;
  driver_id?: string;
  from_addr?: string;
  to_addr: string;
  order_status: OrderStatus;
  total_price: number;
  product?: OrderProductDto[];
}

export interface OrderResponse {
  status_code: string;
  message: string;
  response_datetime: string;
  order?: OrderDto[];
}

export interface MyOrdersResponse {
  status_code: string;
  message: string;
  response_datetime: string;
  ordered_order?: OrderDto[];
  success_order?: OrderDto[];
  packed_order?: OrderDto[];
  deliver_order?: OrderDto[];
  arrived_order?: OrderDto[];
  refund_order?: OrderDto[];
  fail_order?: OrderDto[];
  order?: OrderDto[];
}

export interface OrderDetailResponse extends OrderDto {
  status_code: string;
  message: string;
  response_datetime: string;
}

export interface CreateOrderRequest {
  to_addr: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrderItem {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  sellerId?: string;
}

export interface Order {
  id: string;
  oid?: string;
  buyerId: string;
  sellerId: string;
  driverId?: string;
  createdAt: string;
  fromAddress?: string;
  toAddress: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

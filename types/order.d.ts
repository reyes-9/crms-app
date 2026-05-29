export interface OrderProviderProps {
  children: React.ReactNode;
}

export type OrderStatusType =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface CreateOrderPayload {
  customer: number;
  description: string;
  price: number;
  status: OrderStatusType;
}

export interface OrderDetails {
  id: number;
  description: string;
  price: number;
  status: OrderStatusType;
  created_at: string;
  updated_at?: string;
  customer_id: number;
}

export interface OrderContextType {
  orders: OrderDetails[];
  limitedOrders: OrderDetails[];
  getOrdersByCustomerId: (customer_id: number) => Promise<void>;
  getOrdersByCustomerIdLimit: (customer_id: number) => Promise<void>;
  getOrdersById: (id: number) => Promise<OrderDetails>;
  searchOrder: (search: string) => Promise<void>;
  editOrder: (id: number, data: OrderDetails) => Promise<void>;
  addOrder: (data: CreateOrderPayload) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  cancelOrder: (id: number) => Promise<void>;
  advanceOrder: (id: number, status: string) => Promise<void>;
}

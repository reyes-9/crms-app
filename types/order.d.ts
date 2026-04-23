export interface OrderProviderProps {
  children: React.ReactNode;
}

export interface OrderDetails {
  id: number;
  description: string;
  status: string;
  customer_id: string;
}

export interface OrderContextType {
  orders: OrderDetails[];
  getOrders: (customer_id: number) => Promise<void>;
}

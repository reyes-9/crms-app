import { orderService } from '@/services/orderService';
import {
  OrderContextType,
  OrderDetails,
  OrderProviderProps,
} from '@/types/order';
import { createContext, useState } from 'react';

export const OrderContext = createContext<OrderContextType | undefined>(
  undefined,
);

export function OrderProvider({ children }: OrderProviderProps) {
  const [orders, setOrders] = useState<OrderDetails[]>([]);

  async function getOrders(customer_id: number) {
    try {
      const order = await orderService.getOrders(customer_id);
      setOrders(order.data);
      console.log(orders);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  return (
    <OrderContext.Provider value={{ orders, getOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

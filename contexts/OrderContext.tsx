// TEST THE NEWLY CREATED API'S
// TEST THE NEWLY CREATED API'S
// TEST THE NEWLY CREATED API'S
// TEST THE NEWLY CREATED API'S
// TEST THE NEWLY CREATED API'S

import { orderService } from '@/services/orderService';
import {
  CreateOrderPayload,
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
  const [limitedOrders, setLimitedOrders] = useState<OrderDetails[]>([]);

  async function getOrdersByCustomerId(customer_id: number) {
    try {
      const res = await orderService.getOrdersByCustomerId(customer_id);
      setOrders(res.data.data.orders);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function getOrdersByCustomerIdLimit(customer_id: number) {
    try {
      const res = await orderService.getOrdersByCustomerIdLimit(customer_id);
      setLimitedOrders(res.data.data.orders);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function getOrdersById(id: number) {
    try {
      const res = await orderService.getOrdersById(id);
      // Don't modify the global orders list - just return the data
      return res.data.data.order;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function searchOrder(search: string) {
    try {
      const res = await orderService.searchOrder(search);
      const order = res.data.data.orders;
      setOrders(order);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function editOrder(id: number, data: OrderDetails) {
    try {
      const res = await orderService.editOrder(id, data);
      const updatedOrder = res.data.order;

      setOrders((prev) => prev.map((c) => (c.id === id ? updatedOrder : c)));
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }

  async function addOrder(data: CreateOrderPayload) {
    try {
      const res = await orderService.addOrder(data);
      const newOrder = res.data.order;

      setOrders((prev) => [...prev, newOrder]);
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }

  async function deleteOrder(id: number) {
    try {
      await orderService.deleteOrder(id);
      // Remove the deleted order from the orders array
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }

  async function cancelOrder(id: number) {
    try {
      const res = await orderService.cancelOrder(id);
      const cancelledOrder = res.data.data.order;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                ...cancelledOrder,
              }
            : o,
        ),
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function advanceOrder(id: number, status: string) {
    try {
      const res = await orderService.advanceOrder(id, {
        status,
      });

      const advancedOrder = res.data.data.order;

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                ...advancedOrder,
              }
            : o,
        ),
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        limitedOrders,
        getOrdersByCustomerId,
        getOrdersByCustomerIdLimit,
        getOrdersById,
        searchOrder,
        editOrder,
        addOrder,
        deleteOrder,
        cancelOrder,
        advanceOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

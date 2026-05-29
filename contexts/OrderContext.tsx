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
      const order = await orderService.getOrdersByCustomerId(customer_id);
      setOrders(order.data);
      // console.log(orders);
    } catch (err: any) {
      throw new Error(err);
    }
  }
  
  async function getOrdersByCustomerIdLimit(customer_id: number) {
    try {
      const order = await orderService.getOrdersByCustomerIdLimit(customer_id);
      setLimitedOrders(order.data);
      // console.log(orders);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function getOrdersById(id: number) {
    try {
      const order = await orderService.getOrdersById(id);
      // Don't modify the global orders list - just return the data
      // console.log('Return Data: ', order.data);
      return order.data;
    } catch (err: any) {
      // console.error(err);
      throw new Error(err);
      // return null;
    }
  }

  async function searchOrder(search: string) {
    try {
      const res = await orderService.searchOrder(search);
      const order = res.data;

      setOrders(order);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function editOrder(id: number, data: OrderDetails) {
    try {
      const res = await orderService.editOrder(id, data);
      console.log('RES: ', res);
      const updatedOrder = res;

      // Update the customers array with the updated customer
      setOrders((prev) => prev.map((c) => (c.id === id ? updatedOrder : c)));

      return updatedOrder;
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }

  async function addOrder(data: CreateOrderPayload) {
    try {
      const res = await orderService.addOrder(data);
      const newOrder = res;

      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }

  async function deleteOrder(id: number) {
    try {
      const res = await orderService.deleteOrder(id);

      // Remove the deleted order from the orders array
      setOrders((prev) => prev.filter((order) => order.id !== id));

      return res;
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }

  async function cancelOrder(id: number) {
    try {
      const res = await orderService.cancelOrder(id);

      const cancelledOrder = res.data.order || res.data;

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

      return cancelledOrder;
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function advanceOrder(id: number, status: string) {
    try {
      const res = await orderService.advanceOrder(id, {
        status,
      });

      const advancedOrder = res.data.order || res.data;

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

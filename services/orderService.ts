import { CreateOrderPayload, OrderDetails } from '@/types/order';
import { api } from './api';

export const orderService = {
  async getOrdersByCustomerId(customer_id: number) {
    const res = await api.get(`/orders/by-customer/${customer_id}/`);
    return res;
  },

  async getOrdersByCustomerIdLimit(customer_id: number) {
    const res = await api.get(`/orders/?customer_id=${customer_id}&limit=${5}`);
    return res;
  },

  async getOrdersById(id: number) {
    const res = await api.get(`/orders/${id}`);
    return res;
  },

  async searchOrder(search: string) {
    const res = await api.get(`/orders/search/${search}/`); // /api/orders/search/test/
    return res;
  },

  async editOrder(id: number, data: OrderDetails) {
    const res = await api.patch(`/orders/${id}/edit/`, data);
    return res.data;
  },

  async addOrder(data: CreateOrderPayload) {
    const res = await api.post(`/orders/`, data);
    return res.data;
  },

  async deleteOrder(id: number) {
    const res = await api.delete(`/orders/${id}/delete/`);
    return res.data;
  },

  async cancelOrder(id: number) {
    const res = await api.patch(`/orders/${id}/cancel/`);
    return res;
  },

  async advanceOrder(id: number, data: { status: string }) {
    const res = await api.patch(`/orders/${id}/advance/`, data);
    return res;
  },
};

import { api } from './api';

export const orderService = {
  async getOrders(customer_id: number) {
    const res = api.get(`/orders/?customer_id=${customer_id}`);
    return res;
  },
};

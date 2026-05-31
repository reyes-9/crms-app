import { CustomerProfile, CustomerProfileForm } from '@/types/customer';
import { api } from './api';

export const customerService = {
  async getCustomers() {
    const res = await api.get('/customers/');
    return res;
  },

  async addCustomer(payload: CustomerProfileForm) {
    const res = await api.post<CustomerProfile>(`/customers/`, payload);
    return res.data;
  },

  async editCustomer(id: number, data: CustomerProfile) {
    const res = await api.patch<CustomerProfile>(
      `/customers/${id}/edit/`,
      data,
    );
    return res.data;
  },

  async archiveCustomer(id: number) {
    const res = await api.patch(`/customers/${id}/archive/`);
    return res;
  },

  async deleteCustomer(id: number) {
    const res = await api.delete(`/customers/${id}/delete/`);
    return res;
  },

  async searchCustomer(search: string) {
    const res = await api.get(`/customers/?search=${search}`);
    return res;
  },
};

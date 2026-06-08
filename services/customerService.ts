import { ApiResponse } from '@/types/api';
import {
  CustomerProfile,
  CustomerProfileForm,
  CustomerResponse,
} from '@/types/customer';
import { api } from './api';

export const customerService = {
  async getCustomers() {
    const res = await api.get('/customers/');
    return res;
  },

  async addCustomer(payload: CustomerProfileForm) {
    const res = await api.post<ApiResponse<CustomerResponse>>(
      `/customers/`,
      payload,
    );
    return res;
  },

  async editCustomer(id: number, data: CustomerProfile) {
    const res = await api.patch<ApiResponse<CustomerResponse>>(
      `/customers/${id}/edit/`,
      data,
    );
    return res;
  },

  async archiveCustomer(id: number) {
    const res = await api.patch(`/customers/${id}/archive/`);
    return res;
  },

  async deleteCustomer(id: number) {
    const res = await api.delete(`/customers/${id}/delete/`);
    return res;
  },

  async restoreCustomer(id: number) {
    const res = await api.patch(`/customers/${id}/restore/`);
    return res;
  },

  async searchCustomer(search: string) {
    const res = await api.get(
      `/customers/?search=${encodeURIComponent(search)}`,
    );
    return res;
  },
};

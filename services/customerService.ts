import { api } from './api';

export const customerService = {
  async getCustomers() {
    const res = await api.get('/customers/');
    return res;
  },

  async archiveCustomer(id: number) {
    const res = await api.patch(`/customers/${id}/archive/`);
    return res;
  },

  async deleteCustomer(id: number) {
    const res = await api.patch(`/customers/${id}/delete/`);
    return res;
  },
};
// export const customerService = async () => {
//   const res = await api.get('/customers/');
//   return res.data;
// };

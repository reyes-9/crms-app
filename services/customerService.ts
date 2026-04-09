import { api } from './api';

export const customerService = {
  async getCustomers() {
    const res = await api.get('/customers/');
    return res;
  },
};
// export const customerService = async () => {
//   const res = await api.get('/customers/');
//   return res.data;
// };

import { api } from './api';

export const customerNoteService = {
  async getCustomerNotes(customer_id: number) {
    const res = api.get(`/customer-notes/?customer_id=${customer_id}`);
    return res;
  },
};

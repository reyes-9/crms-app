import {
  CreateCustomerNotePayload,
  EditCustomerNotePayload,
} from '@/types/customerNote';
import { api } from './api';

export const customerNoteService = {
  async getCustomerNotes(customer_id: number) {
    const res = await api.get(`/customer-notes/?customer_id=${customer_id}`);
    return res;
  },

  async addCustomerNote(payload: CreateCustomerNotePayload) {
    const res = await api.post(`/customer-notes/`, payload);
    return res;
  },

  async editCustomerNote(payload: EditCustomerNotePayload) {
    const res = await api.patch(`/customer-notes/${payload.id}/edit/`, {
      id: payload.id,
      title: payload.title,
      content: payload.content,
    });
    return res;
  },

  async deleteCustomerNote(note_id: number) {
    const res = await api.delete(`/customer-notes/${note_id}/purge/`);
    return res;
  },
};

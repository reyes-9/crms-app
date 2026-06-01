import { LeadProfileForm, LeadProfile } from '@/types/lead';
import { api } from './api';

export const orderService = {
  async getLead(customer_id: number) {

  },

  async getOrdersByCustomerIdLimit(customer_id: number) {

  },
  async advanceLead(id: number, data: { status: string }) {
   
  },

  async getOrdersById(id: number) {

  },

  async searchOrder(search: string) {

  },

  async editOrder(id: number, data: LeadProfileForm) {
 
  },

  async addOrder(data: LeadProfileForm) {
   
  },

  async deleteOrder(id: number) {
   
  },

  async cancelOrder(id: number) {
 
  },

};

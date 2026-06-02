import { LeadProfileForm, LeadStatus } from '@/types/lead';
import { api } from './api';

export const leadService = {
  async getLeads() {
    const res = await api.get('/leads/');
    return res;
  },

  async addLead(data: LeadProfileForm) {
    const res = await api.post('/leads/', data);
    return res;
  },

  async editLead(id: number, data: LeadProfileForm) {
    const res = await api.patch(`/leads/${id}/edit/`, data);
    return res;
  },

  async advanceLead(id: number, status: LeadStatus) {
    const res = await api.patch(`/leads/${id}/advance/`, { status });
    return res;
  },

  async deleteLead(id: number) {
    const res = await api.delete(`/leads/${id}/delete/`);
    return res;
  },

  async archiveLead(id: number) {
    const res = await api.patch(`/leads/${id}/archive/`);
    return res;
  },

  async searchLead(query: string) {
    const res = await api.get(`/leads/?search=${encodeURIComponent(query)}`);
    return res;
  },
};
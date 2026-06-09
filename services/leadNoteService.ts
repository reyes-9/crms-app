
import { CreateLeadNotePayload, EditLeadNotePayload } from '@/types/leadNote';
import { api } from './api';

export const leadNoteService = {
  async getLeadNotes(lead_id: number) {
    const res = await api.get(`/lead-notes/?lead_id=${lead_id}`);
    return res;
  },

  async getLeadNotesWithLimit(lead_id: number) {
    const res = await api.get(`/lead-notes/?lead_id=${lead_id}&limit=${5}`);
    return res;
  },

  async addLeadNote(payload: CreateLeadNotePayload) {
    const res = await api.post(`/lead-notes/`, payload);
    return res;
  },

  async editLeadNote(payload: EditLeadNotePayload) {
    const res = await api.patch(`/lead-notes/${payload.id}/edit/`, {
      id: payload.id,
      title: payload.title,
      content: payload.content,
    });
    return res;
  },

  async deleteLeadNote(note_id: number) {
    const res = await api.delete(`/lead-notes/${note_id}/purge/`);
    return res;
  },
};

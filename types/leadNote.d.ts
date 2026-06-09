export interface LeadNoteProviderProps {
  children: React.ReactNode;
}

export interface LeadNoteDetails {
  id: number;
  lead: number;
  title: string;
  content: string;
  created_at: string;
  pinned?: boolean;
}

export interface CreateLeadNotePayload {
  lead: number;
  title: string;
  content: string;
}

export interface EditLeadNotePayload {
  id: number;
  title: string;
  content: string;
}

export interface LeadNoteContextType {
  leadNotes: LeadNoteDetails[];
  limitedLeadNotes: LeadNoteDetails[];
  isLoading: boolean;
  getLeadNotes: (lead_id: number) => Promise<void>;
  getLeadNotesWithLimit: (lead_id: number) => Promise<void>;
  addLeadNote: (payload: CreateLeadNotePayload) => Promise<void>;
  editLeadNote: (payload: EditLeadNotePayload) => Promise<void>;
  deleteLeadNote: (note_id: number) => Promise<void>;
}

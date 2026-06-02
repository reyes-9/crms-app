export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'unqualified'
  | 'converted'
  | 'lost';

export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'other';

export interface LeadProfile {
  id: number;
  name: string;
  company?: string | null;
  email: string;
  number: string;
  status: LeadStatus;
  source: LeadSource;
  value: number;
  notes?: string;
  is_archived?: boolean;
}

export type LeadProfileForm = Omit<LeadProfile, 'id' | 'is_archived'>;

export interface LeadProviderProps {
  children: React.ReactNode;
}

export interface LeadContextType {
  leads: LeadProfile[];
  getLeads: () => Promise<void>;
  addLead: (data: LeadProfileForm) => Promise<void>;
  editLead: (id: number, data: LeadProfileForm) => Promise<LeadProfile>;
  advanceLead: (id: number, status: LeadStatus) => Promise<LeadProfile>;
  deleteLead: (id: number) => Promise<void>;
  archiveLead: (id: number) => Promise<void>;
  searchLead: (query: string) => Promise<void>;
}

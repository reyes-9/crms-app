export interface LeadProfile {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  number: string;
  status:
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'unqualified'
    | 'converted'
    | 'lost';
  source: 'website' | 'referral' | 'social' | 'email' | 'other';
  value: number;
}

export type LeadProfileForm = Omit<LeadProfile, 'id'>;

export interface LeadContextType {
  
}

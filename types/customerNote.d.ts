export interface CustomerNoteProviderProps {
  children: React.ReactNode;
}
 
export interface CustomerNoteDetails {
  id: number;
  customer: number;
  title: string;
  content: string;
  created_at: string;
  pinned?: boolean;
}
 
export interface CreateCustomerNotePayload {
  customer: number;
  title: string;
  content: string;
}
 
export interface EditCustomerNotePayload {
  id: number;
  title: string;
  content: string;
}
 
export interface CustomerNoteContextType {
  customerNotes: CustomerNoteDetails[];
  limitedCustomerNotes: CustomerNoteDetails[];
  isLoading: boolean;
  getCustomerNotes: (customer_id: number) => Promise<void>;
  getCustomerNotesWithLimit: (customer_id: number) => Promise<void>;
  addCustomerNote: (payload: CreateCustomerNotePayload) => Promise<void>;
  editCustomerNote: (payload: EditCustomerNotePayload) => Promise<void>;
  deleteCustomerNote: (note_id: number) => Promise<void>;
}
 
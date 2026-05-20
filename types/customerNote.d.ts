export interface CustomerNoteProviderProps {
  children: React.ReactNode;
}

export interface CustomerNoteDetails {
  id: number;
  content: string;
}

export interface CustomerNoteContextType {
  customerNotes: CustomerNoteDetails[];
  getCustomerNotes: (customer_id: number) => Promise<void>;
}

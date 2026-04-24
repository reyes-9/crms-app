import { customerNoteService } from '@/services/customerNoteService';

import {
  CustomerNoteContextType,
  CustomerNoteDetails,
  CustomerNoteProviderProps,
} from '@/types/customerNote';

import { createContext, useState } from 'react';

export const CustomerNoteContext = createContext<
  CustomerNoteContextType | undefined
>(undefined);

export function CustomerNoteProvider({ children }: CustomerNoteProviderProps) {
  const [customerNotes, setCustomerNotes] = useState<CustomerNoteDetails[]>([]);

  async function getCustomerNotes(customer_id: number) {
    try {
      const notes = await customerNoteService.getCustomerNotes(customer_id);
      setCustomerNotes(notes.data);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  return (
    <CustomerNoteContext.Provider value={{ customerNotes, getCustomerNotes }}>
      {children}
    </CustomerNoteContext.Provider>
  );
}

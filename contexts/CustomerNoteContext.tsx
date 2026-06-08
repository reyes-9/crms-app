import { customerNoteService } from '@/services/customerNoteService';
import {
  CreateCustomerNotePayload,
  CustomerNoteContextType,
  CustomerNoteDetails,
  CustomerNoteProviderProps,
  EditCustomerNotePayload,
} from '@/types/customerNote';
import { createContext, useState } from 'react';

export const CustomerNoteContext = createContext<
  CustomerNoteContextType | undefined
>(undefined);

export function CustomerNoteProvider({ children }: CustomerNoteProviderProps) {
  const [customerNotes, setCustomerNotes] = useState<CustomerNoteDetails[]>([]);
  const [limitedCustomerNotes, setLimitedCustomerNotes] = useState<
    CustomerNoteDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getCustomerNotes(customer_id: number) {
    try {
      // setIsLoading(true);
      const res = await customerNoteService.getCustomerNotes(customer_id);
      const notes = res.data.data.notes;
      setCustomerNotes(notes);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function getCustomerNotesWithLimit(customer_id: number) {
    try {
      const res = await customerNoteService.getCustomerNotesWithLimit(customer_id);
      const notes = res.data.data.notes;
      setLimitedCustomerNotes(notes);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function addCustomerNote(payload: CreateCustomerNotePayload) {
    try {
      const res = await customerNoteService.addCustomerNote(payload);
      const note = res.data.data.note;

      // Append new note to state — avoid re-fetching
      setCustomerNotes((prev) => [note, ...prev]);
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }

  async function editCustomerNote(payload: EditCustomerNotePayload) {
    try {
      const res = await customerNoteService.editCustomerNote(payload);
      const edited = res.data.data.note;
      setCustomerNotes((prev) =>
        prev.map((note) => (note.id === payload.id ? edited : note)),
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function deleteCustomerNote(note_id: number) {
    try {
      await customerNoteService.deleteCustomerNote(note_id);
      setCustomerNotes((prev) => prev.filter((note) => note.id !== note_id));
    } catch (err: any) {
      throw new Error(err);
    }
  }

  return (
    <CustomerNoteContext.Provider
      value={{
        customerNotes,
        limitedCustomerNotes,
        isLoading,
        getCustomerNotes,
        getCustomerNotesWithLimit,
        addCustomerNote,
        editCustomerNote,
        deleteCustomerNote,
      }}
    >
      {children}
    </CustomerNoteContext.Provider>
  );
}

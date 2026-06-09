// import { leadNoteService } from '@/services/leadNoteService';
import { leadNoteService } from '@/services/leadNoteService';
import {
  CreateLeadNotePayload,
  EditLeadNotePayload,
  LeadNoteContextType,
  LeadNoteDetails,
  LeadNoteProviderProps,
} from '@/types/leadNote';
import { createContext, useState } from 'react';

export const LeadNoteContext = createContext<LeadNoteContextType | undefined>(
  undefined,
);

export function LeadNoteProvider({ children }: LeadNoteProviderProps) {
  const [leadNotes, setLeadNotes] = useState<LeadNoteDetails[]>([]);
  const [limitedLeadNotes, setLimitedLeadNotes] = useState<LeadNoteDetails[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);

  async function getLeadNotes(lead_id: number) {
    try {
      // setIsLoading(true);
      const res = await leadNoteService.getLeadNotes(lead_id);
      const notes = res.data.data.notes;
      setLeadNotes(notes);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function getLeadNotesWithLimit(lead_id: number) {
    try {
      const res = await leadNoteService.getLeadNotesWithLimit(lead_id);
      const notes = res.data.data.notes;
      setLimitedLeadNotes(notes);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function addLeadNote(payload: CreateLeadNotePayload) {
    try {
      const res = await leadNoteService.addLeadNote(payload);
      const note = res.data.data.note;

      // Append new note to state — avoid re-fetching
      setLeadNotes((prev) => [note, ...prev]);
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }

  async function editLeadNote(payload: EditLeadNotePayload) {
    try {
      const res = await leadNoteService.editLeadNote(payload);
      const edited = res.data.data.note;
      setLeadNotes((prev) =>
        prev.map((note) => (note.id === payload.id ? edited : note)),
      );
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function deleteLeadNote(note_id: number) {
    try {
      await leadNoteService.deleteLeadNote(note_id);
      setLeadNotes((prev) => prev.filter((note) => note.id !== note_id));
    } catch (err: any) {
      throw new Error(err);
    }
  }

  return (
    <LeadNoteContext.Provider
      value={{
        leadNotes,
        limitedLeadNotes,
        isLoading,
        getLeadNotes,
        getLeadNotesWithLimit,
        addLeadNote,
        editLeadNote,
        deleteLeadNote,
      }}
    >
      {children}
    </LeadNoteContext.Provider>
  );
}

import { LeadNoteContext } from '@/contexts/LeadNoteContext';
import { useContext } from 'react';

export const useLeadNote = () => {
  const context = useContext(LeadNoteContext);

  if (!context) {
    throw new Error('useLeadNote must be used within a LeadNoteProvider');
  }

  return context;
};

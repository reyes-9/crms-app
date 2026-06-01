import { LeadContext } from '@/contexts/LeadContext';
import { useContext } from 'react';

export function useOrder() {
  const context = useContext(LeadContext);

  if (!context) {
    throw new Error('useLead must be used within a LeadProvider');
  }

  return context;
}

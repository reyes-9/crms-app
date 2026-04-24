import { CustomerNoteContext } from '@/contexts/CustomerNoteContext';
import { useContext } from 'react';

export const useCustomerNote = () => {
  const context = useContext(CustomerNoteContext);

  if (!context) {
    throw new Error('useCustomer must be used within a OrderProvider');
  }

  return context;
};

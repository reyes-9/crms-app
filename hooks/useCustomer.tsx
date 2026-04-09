import { CustomerContext } from '@/contexts/CustomerContext';
import { useContext } from 'react';

export function useCustomer() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error('useCustomer must be used within a UserProvider');
  }

  return context;
}

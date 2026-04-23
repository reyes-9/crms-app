import { OrderContext } from '@/contexts/OrderContext';
import { useContext } from 'react';

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error('useCustomer must be used within a OrderProvider');
  }

  return context;
}

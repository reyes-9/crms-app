import { customerService } from '@/services/customerService';
import {
  CustomerContextType,
  CustomerProfile,
  CustomerProviderProps,
} from '@/types/customer';
import { createContext, useState } from 'react';

export const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined,
);

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);

  async function getCustomers() {
    try {
      const res = await customerService.getCustomers();
      setCustomers(res.data); // update state only
    } catch (err: any) {
      throw new Error(err);
      //   console.error(err); // optional error handling
    }
  }

  return (
    <CustomerContext.Provider value={{ customers, getCustomers }}>
      {children}
    </CustomerContext.Provider>
  );
}

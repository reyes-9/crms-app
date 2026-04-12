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
      const activeCustomers = res.data.filter((c: any) => !c.is_archived);
      setCustomers(activeCustomers); // update state only
    } catch (err: any) {
      throw new Error(err);
      // throw new Error(err?.response?.data?.message || err.message);
      // console.error(err); // optional error handling
    }
  }

  async function archiveCustomer(id: number) {
    try {
      await customerService.archiveCustomer(id);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async function deleteCustomer(id: number) {
    try {
      await customerService.deleteCustomer(id);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  return (
    <CustomerContext.Provider
      value={{ customers, getCustomers, archiveCustomer, deleteCustomer }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

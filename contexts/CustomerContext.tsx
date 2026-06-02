import { customerService } from '@/services/customerService';
import {
  CustomerContextType,
  CustomerProfile,
  CustomerProfileForm,
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
    }
  }
  async function addCustomer(payload: CustomerProfileForm) {
    try {
      const res = await customerService.addCustomer(payload);
      // console.log('Payload:', payload);
      console.log('RES:', res);

      // Append new customer to state — avoid re-fetching
      setCustomers((prev) => [res, ...prev]);
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }
  async function editCustomer(
    id: number,
    data: CustomerProfile,
  ): Promise<CustomerProfile> {
    try {
      const res = await customerService.editCustomer(id, data);
      const updatedCustomer = res;

      // Update the customers array with the updated customer
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? updatedCustomer : c)),
      );

      return updatedCustomer;
    } catch (err: any) {
      throw new Error(err);
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
  async function searchCustomer(search: string) {
    try {
      const res = await customerService.searchCustomer(search);
      const activeCustomers = res.data.filter((c: any) => !c.is_archived);
      setCustomers(activeCustomers); // update state only
    } catch (err: any) {
      throw new Error(err);
    }
  }
  return (
    <CustomerContext.Provider
      value={{
        customers,
        setCustomers,
        getCustomers,
        addCustomer,
        editCustomer,
        archiveCustomer,
        deleteCustomer,
        searchCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

// Define your stack params for type-safe navigation

export interface CustomerProviderProps {
  children: React.ReactNode;
}

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  company: string;
  number: string;
}

export type CustomerProfileForm = Omit<CustomerProfile, 'id'>;

export interface CustomerContextType {
  customers: CustomerProfile[];
  setCustomers: Dispatch<SetStateAction<CustomerProfile[]>>;
  getCustomers: () => Promise<void>;
  addCustomer: (payload: CustomerProfileForm) => Promise<void>;
  editCustomer: (id: number, data: CustomerProfile) => Promise<CustomerProfile>;
  archiveCustomer: (id: number) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  searchCustomer: (search: string) => Promise<void>;
}

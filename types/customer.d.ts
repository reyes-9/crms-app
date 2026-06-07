// Define your stack params for type-safe navigation

export interface CustomerProviderProps {
  children: React.ReactNode;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
  number: string;
  status: CustomerStatus;
  is_archived: booloean;
}

export type CustomerStatus = 'active' | 'archived' | 'deleted';

export type CustomerProfile = Omit<CustomerProfile, 'id', 'is_archived'>;

export interface CustomerResponse {
  customer: CustomerProfile;
}

export type CustomerProfileForm = Omit<CustomerProfile, 'id', 'is_archived'>;

export interface CustomerContextType {
  customers: CustomerProfile[];
  setCustomers: Dispatch<SetStateAction<CustomerProfile[]>>;
  getCustomers: () => Promise<void>;
  addCustomer: (payload: CustomerProfileForm) => Promise<void>;
  editCustomer: (id: number, data: CustomerProfile) => Promise<CustomerProfile>;
  archiveCustomer: (id: number) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  restoreCustomer: (id: number) => Promise<void>;
  searchCustomer: (search: string) => Promise<void>;
}

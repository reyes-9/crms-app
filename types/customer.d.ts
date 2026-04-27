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

export interface CustomerContextType {
  customers: CustomerProfile[];
  setCustomers: Dispatch<SetStateAction<CustomerProfile[]>>;
  getCustomers: () => Promise<void>;
  editCustomer: (id: number, data: CustomerProfile) => Promise<CustomerProfile>;
  archiveCustomer: (id: number) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  searchCustomer: (search: string) => Promise<void>;
}

// export interface UserContextType {
//   user: UserDetails | null;
//   isLoading: boolean;
//   register: (credentials: RegisterCredentials) => Promise<void>;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   loadUser: () => Promise<void>;
//   logout: () => Promise<void>;
// }

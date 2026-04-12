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
  getCustomers: () => Promise<void>;
  archiveCustomer: (id: number) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;

}

// export interface UserContextType {
//   user: UserDetails | null;
//   isLoading: boolean;
//   register: (credentials: RegisterCredentials) => Promise<void>;
//   login: (credentials: LoginCredentials) => Promise<void>;
//   loadUser: () => Promise<void>;
//   logout: () => Promise<void>;
// }

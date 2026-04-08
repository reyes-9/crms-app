import { RegisterOptions } from 'react-hook-form';

export interface UserProviderProps {
  children: React.ReactNode;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  email: string;
  password: string;
}

export interface UserContextType {
  user: UserDetails | null;
  isLoading: boolean;
  register: (credentials: RegisterCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface InputProps {
  control: any; // Replace 'any' with the proper type from react-hook-form (e.g., Control<FieldValues>)
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  rules: RegisterOptions;
}

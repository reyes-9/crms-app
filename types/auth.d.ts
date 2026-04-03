import { RegisterOptions } from 'react-hook-form';

export interface UserProviderProps {
  children: React.ReactNode;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserCreadentials {
  email: string;
  password: string;
}

export interface UserContextType {
  user: UserDetails | null;
  register: (credentials: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export interface RegisterCredentials {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface InputProps {
  control: any; // Replace 'any' with the proper type from react-hook-form (e.g., Control<FieldValues>)
  name: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  rules: RegisterOptions;
}

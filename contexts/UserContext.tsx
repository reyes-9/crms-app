import { createContext, useState } from 'react';
import {
  LoginCredentials,
  RegisterCredentials,
  UserContextType,
  UserProviderProps,
} from '../types/auth';
import { UserDetails } from '../types/user';

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserDetails | null>(null);

  async function register({
    username,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    password,
    confirmPassword,
  }: RegisterCredentials) {}
  async function login({ email, password }: LoginCredentials) {}
  async function logout() {}

  return (
    <UserContext.Provider value={{ user, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

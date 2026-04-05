import { authService } from '@/services/authService';
import { UserDetails } from '@/types/user';
import { clearKeys } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import {
  LoginCredentials,
  RegisterCredentials,
  UserContextType,
  UserProviderProps,
} from '../types/auth';

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start — check if a token exists and restore session
  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await AsyncStorage.getItem('access');
        if (token) {
          const data = await authService.getMe();
          setUser(data.user);
        }
      } catch {
        // Token expired and refresh also failed — stay logged out
        await clearKeys(['access', 'refresh']);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function register(credentials: RegisterCredentials) {
    try {
      const data = await authService.register(credentials);

      await AsyncStorage.setItem('access', data.access);
      await AsyncStorage.setItem('refresh', data.refresh);

      setUser(data.user);
    } catch (error) {
      throw error;
    }
  }

  async function login(credentials: LoginCredentials) {
    await authService.login(credentials);
    const data = await authService.getMe();
    setUser(data.user);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, isLoading, register, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

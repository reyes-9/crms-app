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
          const user = data.data.user;
          setUser(user);
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
      const registrationRes = await authService.register(credentials);

      setUser(registrationRes.data.user);
    } catch (registrationErr) {
      throw registrationErr;
    }
  }

  async function login(credentials: LoginCredentials) {
    try {
      const loginRes = await authService.login(credentials);

      const access = loginRes.data.access;
      const refresh = loginRes.data.refresh;

      // console.log(JSON.stringify(access, null, 2));
      // console.log(JSON.stringify(refresh, null, 2));

      await AsyncStorage.setItem('access', access);
      await AsyncStorage.setItem('refresh', refresh);

      // const storedAccess = await AsyncStorage.getItem('access');
      // const storedRefresh = await AsyncStorage.getItem('refresh');

      // console.log('Stored Access:', storedAccess);
      // console.log('Stored Refresh:', storedRefresh);
    } catch (loginErr: any) {
      const message =
        loginErr?.response?.data?.detail || loginErr?.message || 'Login failed';
      // console.log(message);
      throw new Error(message);
    }
  }

  async function loadUser() {
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch (err) {
      console.error('Failed to load user:', err);
      setUser(null);
    }
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <UserContext.Provider
      value={{ user, isLoading, register, login, loadUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

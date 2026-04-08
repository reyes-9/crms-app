import { LoginCredentials } from '@/types/auth';
import { clearKeys } from '@/utils/storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

export const authService = {
  async register(data: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    password: string;
  }) {
    const res = await api.post('/auth/register/', data); //    {headers: { 'Content-Type': 'application/json' },}
    return res.data; // { access, refresh, user, success }
  },

  async login(credentials: LoginCredentials) {
    // Django's /token/ uses username + password (not email)
    const res = await api.post('/auth/token/', credentials);
    return res.data; // { access, refresh, user }
  },

  async getMe() {
    const res = await api.get('/auth/me/');
    return res.data; // { user, account }
  },

  async logout() {
    await clearKeys(['access', 'refresh']);
  },
};

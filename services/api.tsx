import { clearKeys } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const getBaseURL = () => {
  if (Platform.OS === 'android') return 'http://192.168.68.112:8000'; // Android
  return 'http://localhost:8000'; // web
};

export const api = axios.create({
  baseURL: `${getBaseURL()}/api`,
  headers: { 'Content-Type': 'application-json' },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = await AsyncStorage.getItem('referesh');
        const res = await axios.post(
          `${getBaseURL()}/api/auth/token/refresh/`,
          { refresh },
        );
        await AsyncStorage.setItem('access', res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        // Refresh also failed — user needs to log in again
        await clearKeys(['access', 'refresh']);
      }
    }
    return Promise.reject(error);
  },
);

import axios from 'axios';
import { API_BASE_URL } from '@/constants';
import { usePersistentStore } from '@/hooks/usePersistentStore';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = usePersistentStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

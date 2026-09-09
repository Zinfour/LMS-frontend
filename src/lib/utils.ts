import { clsx, type ClassValue } from 'clsx';
import { usePersistentStore } from '../hooks/usePersistentStore';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { jwtDecode } from 'jwt-decode';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export let logoutTimeout: number | undefined = undefined;

export const setLogoutOnTokenExpiredTimeout = (token: string) => {
  if (logoutTimeout) {
    clearTimeout(logoutTimeout);
  }

  const decodedToken: { exp: number } = jwtDecode(token);
  const currentTime = Date.now();
  const timeUntilExpiration = decodedToken.exp * 1000 - currentTime;

  logoutTimeout = setTimeout(() => {
    usePersistentStore.getState().logUserOut();
    toast.warning('Please log in again.', { description: 'Your session has expired.' });
  }, timeUntilExpiration);
};

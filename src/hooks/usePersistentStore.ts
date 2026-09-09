import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';
import { logoutTimeout } from '../lib/utils';
import { queryClient } from './../main';

type User = {
  id: number;
  username: string;
  email: string;
  role: 'teacher' | 'student';
  token: string;
  courseId: number;
  imageURL?: string;
};

export type State = {
  user?: User;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  logUserOut: () => void;
  setUser: (user?: User) => void;
};

export const usePersistentStore = createWithEqualityFn<State>()(
  persist(
    (set) => ({
      user: undefined,
      theme: 'dark',
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
      logUserOut: () => {
        if (logoutTimeout) {
          clearTimeout(logoutTimeout);
        }

        queryClient.clear(); // Clear the query cache when logging out, to be sure that the next user will not see the previous user's data

        set({ user: undefined });
      },
      setUser: (user?: User) => set({ user }),
    }),
    {
      name: 'persistent-store',
    },
  ),
  shallow,
);

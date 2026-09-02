import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';

export type State = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

export const usePersistentStore = createWithEqualityFn<State>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme: (theme: 'light' | 'dark') => set({ theme }),
    }),
    {
      name: 'persistent-store',
    },
  ),
  shallow,
);

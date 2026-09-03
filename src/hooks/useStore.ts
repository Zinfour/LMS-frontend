import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

type User = {
  id: number;
  username: string;
  email: string;
  role: 'teacher' | 'student';
  imageURL?: string;
};

export type State = {
  user?: User;
  count: number;
  increaseCount: () => void;
  decreaseCount: () => void;
  logUserOut: () => void;
  setUser: (user?: User) => void;
};

export const useStore = createWithEqualityFn<State>(
  (set) => ({
    count: 0,
    user: {
      id: 1,
      username: 'Elin Sandström',
      email: 'elin@sandstrom.com',
      role: 'student',
      imageURL:
        'https://images.unsplash.com/photo-1740252117070-7aa2955b25f8?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    increaseCount: () => set((state) => ({ count: state.count + 1 })),
    decreaseCount: () => set((state) => ({ count: state.count - 1 })),
    logUserOut: () => set({ user: undefined }),
    setUser: (user?: User) => set({ user }),
  }),
  shallow,
);

import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

export type State = {
  count: number;
  increaseCount: () => void;
  decreaseCount: () => void;
};

export const useStore = createWithEqualityFn<State>(
  (set) => ({
    count: 0,
    increaseCount: () => set((state) => ({ count: state.count + 1 })),
    decreaseCount: () => set((state) => ({ count: state.count - 1 })),
  }),
  shallow,
);

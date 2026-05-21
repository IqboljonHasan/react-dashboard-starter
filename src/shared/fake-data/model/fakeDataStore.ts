import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { env } from '@/shared/config/env';

interface FakeDataState {
  enabled: boolean;
  toggle: () => void;
}

export const useFakeDataStore = create<FakeDataState>()(
  persist(
    (set) => ({
      enabled: env.fakeData,
      toggle: () => set((s) => ({ enabled: !s.enabled })),
    }),
    { name: 'fake-data' },
  ),
);

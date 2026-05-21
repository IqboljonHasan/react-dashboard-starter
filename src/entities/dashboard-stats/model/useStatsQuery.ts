import { useQuery } from '@tanstack/react-query';

import { useFakeDataStore } from '@/shared/fake-data';
import { statsApi } from '../api/statsApi';
import { fakeDashboardStats } from './fakeData';
import { statsKeys } from './statsKeys';
import type { DashboardStats } from './types';

export function useStatsQuery(options?: { fakeData?: DashboardStats }) {
  const isFake = useFakeDataStore((s) => s.enabled);

  return useQuery({
    queryKey: [...statsKeys.stats(), isFake],
    queryFn: () => {
      if (options?.fakeData !== undefined) return Promise.resolve(options.fakeData);
      if (isFake) return Promise.resolve(fakeDashboardStats);
      return statsApi.getStats();
    },
  });
}

import { useQuery } from '@tanstack/react-query';

import { useFakeDataStore } from '@/shared/fake-data';
import { userApi } from '../api/userApi';
import { fakeUsers } from './fakeData';
import type { User } from './types';
import { userKeys } from './userKeys';

export function useUserQuery(id: string, options?: { fakeData?: User }) {
  const isFake = useFakeDataStore((s) => s.enabled);

  return useQuery({
    queryKey: [...userKeys.detail(id), isFake],
    queryFn: () => {
      if (options?.fakeData !== undefined) return Promise.resolve(options.fakeData);
      if (isFake) {
        const user = fakeUsers.find((u) => u.id === id);
        if (!user) throw new Error(`User ${id} not found`);
        return Promise.resolve(user);
      }
      return userApi.getById(id);
    },
    enabled: !!id,
  });
}

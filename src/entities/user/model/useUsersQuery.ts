import { useQuery } from '@tanstack/react-query';

import { useFakeDataStore } from '@/shared/fake-data';
import { userApi } from '../api/userApi';
import { applyFakeUserFilters } from './fakeData';
import type { PaginatedResponse, User, UserListParams } from './types';
import { userKeys } from './userKeys';

export function useUsersQuery(
  params: UserListParams,
  options?: { fakeData?: PaginatedResponse<User> },
) {
  const isFake = useFakeDataStore((s) => s.enabled);

  return useQuery({
    queryKey: [...userKeys.list(params), isFake],
    queryFn: () => {
      if (options?.fakeData !== undefined) return Promise.resolve(options.fakeData);
      if (isFake) return Promise.resolve(applyFakeUserFilters(params));
      return userApi.list(params);
    },
    placeholderData: (prev) => prev,
  });
}

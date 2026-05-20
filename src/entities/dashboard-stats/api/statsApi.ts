import { apiClient } from '@/shared/api/instance';
import type { DashboardStats } from '../model/types';

export const statsApi = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats').then((r) => r.data),
};

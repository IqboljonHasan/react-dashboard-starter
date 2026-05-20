import { apiClient } from '@/shared/api/instance';
import type { PaginatedResponse, User, UserListParams } from '../model/types';

export const userApi = {
  list: (params: UserListParams) =>
    apiClient.get<PaginatedResponse<User>>('/users', { params }).then((r) => r.data),

  getById: (id: string) => apiClient.get<User>(`/users/${id}`).then((r) => r.data),

  create: (payload: Omit<User, 'id' | 'createdAt'>) =>
    apiClient.post<User>('/users', payload).then((r) => r.data),

  update: (id: string, payload: Partial<User>) =>
    apiClient.patch<User>(`/users/${id}`, payload).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/users/${id}`).then((r) => r.data),
};

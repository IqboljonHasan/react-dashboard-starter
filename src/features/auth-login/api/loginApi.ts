import type { AuthUser } from '@/entities/session';
import { apiClient } from '@/shared/api/instance';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const loginApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  me: () => apiClient.get<AuthUser>('/auth/me').then((r) => r.data),
};

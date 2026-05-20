import type { AuthUser } from '@/entities/session';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

const FAKE_USERS: Array<LoginPayload & { user: AuthUser }> = [
  {
    email: 'admin@example.com',
    password: 'password',
    user: {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  },
  {
    email: 'manager@example.com',
    password: 'password',
    user: {
      id: '2',
      email: 'manager@example.com',
      name: 'Manager User',
      role: 'manager',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
    },
  },
  {
    email: 'viewer@example.com',
    password: 'password',
    user: {
      id: '3',
      email: 'viewer@example.com',
      name: 'Viewer User',
      role: 'viewer',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
    },
  },
];

export const loginApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    await new Promise((r) => setTimeout(r, 600));
    const match = FAKE_USERS.find(
      (u) => u.email === payload.email && u.password === payload.password,
    );
    if (!match) {
      throw new Error('Invalid email or password');
    }
    return {
      accessToken: `fake-access-token-${match.user.id}`,
      refreshToken: `fake-refresh-token-${match.user.id}`,
      user: match.user,
    };
  },

  me: async (): Promise<AuthUser> => {
    throw new Error('Not implemented');
  },
};

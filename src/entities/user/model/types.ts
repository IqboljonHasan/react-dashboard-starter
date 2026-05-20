export type UserStatus = 'active' | 'inactive' | 'suspended';
export type UserRole = 'admin' | 'manager' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
}

export interface UserListParams {
  page: number;
  pageSize: number;
  search: string;
  role: UserRole | '';
  status: UserStatus | '';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

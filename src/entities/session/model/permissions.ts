import type { AuthUser } from './sessionStore';

export type Permission =
  | 'users:view'
  | 'users:create'
  | 'users:edit'
  | 'users:delete'
  | 'reports:view'
  | 'roles:manage';

export const ALL_PERMISSIONS: Permission[] = [
  'users:view',
  'users:create',
  'users:edit',
  'users:delete',
  'reports:view',
  'roles:manage',
];

export const ROLE_PERMISSIONS: Record<AuthUser['role'], Permission[]> = {
  admin: [
    'users:view',
    'users:create',
    'users:edit',
    'users:delete',
    'reports:view',
    'roles:manage',
  ],
  manager: ['users:view', 'users:create', 'users:edit', 'reports:view'],
  viewer: ['users:view', 'reports:view'],
};

export const ALL_ROLES = Object.keys(ROLE_PERMISSIONS) as AuthUser['role'][];

export function hasPermission(role: AuthUser['role'] | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role].includes(permission);
}

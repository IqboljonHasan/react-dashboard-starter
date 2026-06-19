import { hasPermission, type Permission } from './permissions';
import { useSessionStore } from './sessionStore';

export function useHasPermission(permission: Permission): boolean {
  const role = useSessionStore((s) => s.user?.role);
  return hasPermission(role, permission);
}

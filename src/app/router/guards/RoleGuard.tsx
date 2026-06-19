import { Navigate, Outlet } from 'react-router-dom';
import type { Permission } from '@/entities/session';
import { useHasPermission } from '@/entities/session';
import { ROUTES } from '@/shared/config/routes';

interface RoleGuardProps {
  permission: Permission;
}

export function RoleGuard({ permission }: RoleGuardProps) {
  const allowed = useHasPermission(permission);

  if (!allowed) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return <Outlet />;
}

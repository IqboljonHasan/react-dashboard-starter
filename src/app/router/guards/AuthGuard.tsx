import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config/routes';

export function AuthGuard() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

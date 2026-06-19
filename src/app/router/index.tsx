import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import { DashboardPage } from '@/pages/dashboard';
import { ForbiddenPage } from '@/pages/forbidden';
import { LoginPage } from '@/pages/login';
import { NotFoundPage } from '@/pages/not-found';
import { ReportsPage } from '@/pages/reports';
import {
  AppearancePage,
  NotificationsPage,
  ProfilePage,
  RolesPage,
  SecurityPage,
  SettingsLayout,
} from '@/pages/settings';
import { ComponentsPage, IconsPage, UiLayout } from '@/pages/ui';
import { UserDetailPage, UsersPage } from '@/pages/users';
import { ROUTES } from '@/shared/config/routes';
import { DashboardLayout } from '@/widgets/layout';

import { AuthGuard } from './guards/AuthGuard';
import { GuestGuard } from './guards/GuestGuard';
import { RoleGuard } from './guards/RoleGuard';
import { navHandleMap, SUB_ROUTE_HANDLES } from './navConfig';
import type { CustomRoute } from './types';

const routeConfig: CustomRoute[] = [
  {
    element: <GuestGuard />,
    children: [{ path: ROUTES.LOGIN, element: <LoginPage />, handle: { noBreadcrumb: true } }],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        handle: { noBreadcrumb: true },
        children: [
          { index: true, element: <Navigate to={ROUTES.DASHBOARD} replace /> },
          {
            path: ROUTES.DASHBOARD,
            element: <DashboardPage />,
            handle: navHandleMap[ROUTES.DASHBOARD],
          },

          {
            element: <RoleGuard permission="users:view" />,
            children: [
              {
                path: ROUTES.USERS,
                element: <Outlet />,
                handle: navHandleMap[ROUTES.USERS],
                children: [
                  { index: true, element: <UsersPage /> },
                  {
                    path: ':id',
                    element: <UserDetailPage />,
                    handle: SUB_ROUTE_HANDLES[ROUTES.USER_DETAIL],
                  },
                ],
              },
            ],
          },

          { path: ROUTES.REPORTS, element: <ReportsPage />, handle: navHandleMap[ROUTES.REPORTS] },

          {
            path: ROUTES.UI,
            element: <UiLayout />,
            handle: navHandleMap[ROUTES.UI],
            children: [
              { index: true, element: <Navigate to={ROUTES.UI_COMPONENTS} replace /> },
              {
                path: 'components',
                element: <ComponentsPage />,
                handle: SUB_ROUTE_HANDLES[ROUTES.UI_COMPONENTS],
              },
              {
                path: 'icons',
                element: <IconsPage />,
                handle: SUB_ROUTE_HANDLES[ROUTES.UI_ICONS],
              },
            ],
          },

          {
            path: ROUTES.SETTINGS,
            element: <SettingsLayout />,
            handle: navHandleMap[ROUTES.SETTINGS],
            children: [
              { index: true, element: <Navigate to={ROUTES.SETTINGS_APPEARANCE} replace /> },
              {
                path: 'appearance',
                element: <AppearancePage />,
                handle: SUB_ROUTE_HANDLES[ROUTES.SETTINGS_APPEARANCE],
              },
              {
                path: 'profile',
                element: <ProfilePage />,
                handle: SUB_ROUTE_HANDLES[ROUTES.SETTINGS_PROFILE],
              },
              {
                path: 'security',
                element: <SecurityPage />,
                handle: SUB_ROUTE_HANDLES[ROUTES.SETTINGS_SECURITY],
              },
              {
                path: 'notifications',
                element: <NotificationsPage />,
                handle: SUB_ROUTE_HANDLES[ROUTES.SETTINGS_NOTIFICATIONS],
              },
              {
                element: <RoleGuard permission="roles:manage" />,
                children: [
                  {
                    path: 'roles',
                    element: <RolesPage />,
                    handle: SUB_ROUTE_HANDLES[ROUTES.SETTINGS_ROLES],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { path: ROUTES.FORBIDDEN, element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routeConfig);

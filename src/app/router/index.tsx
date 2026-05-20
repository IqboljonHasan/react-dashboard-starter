import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import { DashboardPage } from '@/pages/dashboard';
import { LoginPage } from '@/pages/login';
import { NotFoundPage } from '@/pages/not-found';
import { ReportsPage } from '@/pages/reports';
import {
  AppearancePage,
  NotificationsPage,
  ProfilePage,
  SecurityPage,
  SettingsLayout,
} from '@/pages/settings';
import { UserDetailPage, UsersPage } from '@/pages/users';
import { ROUTES } from '@/shared/config/routes';
import { DashboardLayout } from '@/widgets/layout';

import { AuthGuard } from './guards/AuthGuard';
import { GuestGuard } from './guards/GuestGuard';
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

          { path: ROUTES.REPORTS, element: <ReportsPage />, handle: navHandleMap[ROUTES.REPORTS] },

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
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routeConfig);

import {
  BarChartOutlined,
  BellOutlined,
  BgColorsOutlined,
  DashboardOutlined,
  LockOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { ROUTES } from '@/shared/config/routes';

import type { IRouteHandle } from './types';

export interface NavRoute {
  path: string;
  handle: IRouteHandle & Required<Pick<IRouteHandle, 'title' | 'icon'>>;
  children?: NavRoute[];
}

export const NAV_ROUTES: NavRoute[] = [
  {
    path: ROUTES.DASHBOARD,
    handle: { title: 'nav.dashboard', icon: <DashboardOutlined /> },
  },
  {
    path: ROUTES.USERS,
    handle: { title: 'nav.users', icon: <UserOutlined /> },
  },
  {
    path: ROUTES.REPORTS,
    handle: { title: 'nav.reports', icon: <BarChartOutlined /> },
  },
  {
    path: ROUTES.SETTINGS,
    handle: { title: 'nav.settings', icon: <SettingOutlined /> },
    children: [
      { path: ROUTES.SETTINGS_APPEARANCE, handle: { title: 'nav.settingsAppearance', icon: <BgColorsOutlined /> } },
      { path: ROUTES.SETTINGS_PROFILE, handle: { title: 'nav.settingsProfile', icon: <UserOutlined /> } },
      { path: ROUTES.SETTINGS_SECURITY, handle: { title: 'nav.settingsSecurity', icon: <LockOutlined /> } },
      { path: ROUTES.SETTINGS_NOTIFICATIONS, handle: { title: 'nav.settingsNotifications', icon: <BellOutlined /> } },
    ],
  },
];

export const navHandleMap = Object.fromEntries(
  NAV_ROUTES.map((r) => [r.path, r.handle]),
) as Record<string, NavRoute['handle']>;

export const SUB_ROUTE_HANDLES: Record<string, IRouteHandle> = {
  [ROUTES.USER_DETAIL]: { title: 'nav.userDetail' },
  [ROUTES.SETTINGS_APPEARANCE]: { title: 'nav.settingsAppearance' },
  [ROUTES.SETTINGS_PROFILE]: { title: 'nav.settingsProfile' },
  [ROUTES.SETTINGS_SECURITY]: { title: 'nav.settingsSecurity' },
  [ROUTES.SETTINGS_NOTIFICATIONS]: { title: 'nav.settingsNotifications' },
};

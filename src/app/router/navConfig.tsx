import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  BgColorsOutlined,
  DashboardOutlined,
  LockOutlined,
  SettingOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { ROUTES } from '@/shared/config/routes';

import type { RouteHandle } from './types';

export interface NavRoute {
  path: string;
  handle: RouteHandle & Required<Pick<RouteHandle, 'title' | 'icon'>>;
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
    path: ROUTES.UI,
    handle: { title: 'nav.ui', icon: <AppstoreOutlined /> },
    children: [
      {
        path: ROUTES.UI_COMPONENTS,
        handle: { title: 'nav.uiComponents', icon: <AppstoreOutlined /> },
      },
      {
        path: ROUTES.UI_ICONS,
        handle: { title: 'nav.uiIcons', icon: <SmileOutlined /> },
      },
    ],
  },
  {
    path: ROUTES.SETTINGS,
    handle: { title: 'nav.settings', icon: <SettingOutlined /> },
    children: [
      {
        path: ROUTES.SETTINGS_APPEARANCE,
        handle: { title: 'nav.settingsAppearance', icon: <BgColorsOutlined /> },
      },
      {
        path: ROUTES.SETTINGS_PROFILE,
        handle: { title: 'nav.settingsProfile', icon: <UserOutlined /> },
      },
      {
        path: ROUTES.SETTINGS_SECURITY,
        handle: { title: 'nav.settingsSecurity', icon: <LockOutlined /> },
      },
      {
        path: ROUTES.SETTINGS_NOTIFICATIONS,
        handle: { title: 'nav.settingsNotifications', icon: <BellOutlined /> },
      },
    ],
  },
];

export const navHandleMap = Object.fromEntries(NAV_ROUTES.map((r) => [r.path, r.handle])) as Record<
  string,
  NavRoute['handle']
>;

export const SUB_ROUTE_HANDLES: Record<string, RouteHandle> = {
  [ROUTES.USER_DETAIL]: { title: 'nav.userDetail' },
  [ROUTES.UI_COMPONENTS]: { title: 'nav.uiComponents' },
  [ROUTES.UI_ICONS]: { title: 'nav.uiIcons' },
  [ROUTES.SETTINGS_APPEARANCE]: { title: 'nav.settingsAppearance' },
  [ROUTES.SETTINGS_PROFILE]: { title: 'nav.settingsProfile' },
  [ROUTES.SETTINGS_SECURITY]: { title: 'nav.settingsSecurity' },
  [ROUTES.SETTINGS_NOTIFICATIONS]: { title: 'nav.settingsNotifications' },
};

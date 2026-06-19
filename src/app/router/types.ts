import type { ReactNode } from 'react';
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';
import type { Permission } from '@/entities/session';

export interface RouteHandle {
  /** i18n key used for sidebar label and breadcrumb text */
  title?: string;
  sidebarTitle?: string;
  breadcrumbTitle?: string;
  /** Sidebar icon */
  icon?: ReactNode;
  /** Exclude from sidebar nav */
  hideOnSidebar?: boolean;
  /** Hide from sidebar nav unless the current user has this permission */
  permission?: Permission;
  /** Exclude from breadcrumb trail */
  noBreadcrumb?: boolean;
  /** Render as non-clickable breadcrumb item */
  breadcrumbDisabled?: boolean;
  /** Render breadcrumb item as a dropdown of direct child routes */
  dropdownBreadcrumb?: boolean;
}

interface CustomNonIndexRoute extends Omit<NonIndexRouteObject, 'children'> {
  handle?: RouteHandle;
  children?: CustomRoute[];
}

interface CustomIndexRoute extends IndexRouteObject {
  handle?: RouteHandle;
}

export type CustomRoute = CustomIndexRoute | CustomNonIndexRoute;

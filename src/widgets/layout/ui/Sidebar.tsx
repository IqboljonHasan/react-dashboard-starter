import type { MenuProps } from 'antd';
import { Layout, Menu, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import type { NavRoute } from '@/app/router/navConfig';
import { NAV_ROUTES } from '@/app/router/navConfig';
import { useSettingsStore } from '@/entities/settings';
import { env } from '@/shared/config/env';

const { Sider } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function toMenuItems(
  routes: NavRoute[],
  t: (key: string) => string,
  navigate: (path: string) => void,
): MenuItem[] {
  return routes
    .filter((r) => !r.handle.hideOnSidebar)
    .map((r) => ({
      key: r.path,
      icon: r.handle.icon,
      label: t(r.handle.title),
      ...(r.children
        ? { children: toMenuItems(r.children, t, navigate) }
        : { onClick: () => navigate(r.path) }),
    }));
}

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();

  const menuItems = toMenuItems(NAV_ROUTES, t, navigate);

  const parentKeysForPath = useMemo(
    () => NAV_ROUTES.filter((r) => r.children && pathname.startsWith(r.path)).map((r) => r.path),
    [pathname],
  );

  const [openKeys, setOpenKeys] = useState<string[]>(parentKeysForPath);

  // Auto-open parent when navigating directly to a sub-route
  useEffect(() => {
    setOpenKeys((prev) => {
      const missing = parentKeysForPath.filter((k) => !prev.includes(k));
      return missing.length > 0 ? [...prev, ...missing] : prev;
    });
  }, [parentKeysForPath]);

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      width={256}
      collapsedWidth={80}
      style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
    >
      <div className="flex items-center justify-center h-16 px-4 border-b border-white/10">
        {!sidebarCollapsed ? (
          <Text strong className="text-base truncate text-white!">
            {env.appName}
          </Text>
        ) : (
          <span className="text-white text-xl font-bold">D</span>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        openKeys={sidebarCollapsed ? [] : openKeys}
        onOpenChange={setOpenKeys}
        items={menuItems}
        className="border-r-0 mt-2"
      />
    </Sider>
  );
}

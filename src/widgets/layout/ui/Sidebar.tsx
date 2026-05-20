import {
  BarChartOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSettingsStore } from '@/entities/settings';
import { env } from '@/shared/config/env';
import { ROUTES } from '@/shared/config/routes';

const { Sider } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
  { key: ROUTES.DASHBOARD, icon: <DashboardOutlined />, labelKey: 'nav.dashboard' },
  { key: ROUTES.USERS, icon: <UserOutlined />, labelKey: 'nav.users' },
  { key: ROUTES.REPORTS, icon: <BarChartOutlined />, labelKey: 'nav.reports' },
  { key: ROUTES.SETTINGS, icon: <SettingOutlined />, labelKey: 'nav.settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation('common');
  const { sidebarCollapsed, toggleSidebar } = useSettingsStore();

  const menuItems = NAV_ITEMS.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: t(item.labelKey),
    onClick: () => navigate(item.key),
  }));

  const selectedKey = `/${pathname.split('/')[1]}`;

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
          <Text strong className="text-white text-base truncate">
            {env.appName}
          </Text>
        ) : (
          <span className="text-white text-xl font-bold">D</span>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        className="border-r-0 mt-2"
      />
    </Sider>
  );
}

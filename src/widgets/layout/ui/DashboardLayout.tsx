import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import { useSettingsStore } from '@/entities/settings';
import { Breadcrumbs } from './Breadcrumbs';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const { Content } = Layout;

export function DashboardLayout() {
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed);

  return (
    <Layout className="min-h-screen bg-background">
      <Sidebar />
      <Layout
        style={{
          marginLeft: sidebarCollapsed ? 80 : 256,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Header />
        <Content className="m-6 p-6 bg-surface rounded-xl min-h-[calc(100vh-64px-48px)]">
          <Breadcrumbs />
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

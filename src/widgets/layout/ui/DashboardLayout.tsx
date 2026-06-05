import { Layout } from 'antd';
import { useState } from 'react';
import { ScrollRestoration, useLocation, useOutlet } from 'react-router-dom';

import { useSettingsStore } from '@/entities/settings';
import { PageTransition } from '@/shared/ui/PageTransition';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const { Content } = Layout;

/**
 * Freezes the routed element on mount so an exiting `PageTransition` copy keeps
 * rendering the previous page instead of re-rendering the live `<Outlet />` to
 * the new route (which would show the new page twice during the transition).
 */
function AnimatedOutlet() {
  const outlet = useOutlet();
  const [frozenOutlet] = useState(outlet);
  return <>{frozenOutlet}</>;
}

export function DashboardLayout() {
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const motionEnabled = useSettingsStore((s) => s.motionEnabled);
  const location = useLocation();

  return (
    <Layout className="min-h-screen bg-background">
      <ScrollRestoration />
      <Sidebar />
      <Layout
        style={{
          marginLeft: sidebarCollapsed ? 80 : 256,
          transition: 'margin-left 0.2s ease',
        }}
      >
        <Header />
        <Content className="p-6 min-h-[calc(100vh-64px-48px)]">
          <PageTransition transitionKey={location.pathname} enabled={motionEnabled}>
            <AnimatedOutlet />
          </PageTransition>
        </Content>
      </Layout>
    </Layout>
  );
}

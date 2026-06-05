import { RightOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Typography } from 'antd';
import { motion, useAnimationControls } from 'motion/react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import type { NavRoute } from '@/app/router/navConfig';
import { NAV_ROUTES } from '@/app/router/navConfig';
import { useSettingsStore } from '@/entities/settings';
import { env } from '@/shared/config/env';

const { Sider } = Layout;
const { Text } = Typography;

const BUTTON_SIZE = 28; // resting circle diameter (px)
const BUTTON_GROW = 56; // stretched pill width (px)
const ICON_SHIFT = (BUTTON_GROW - BUTTON_SIZE) / 2; // icon offset toward the leading edge

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
  const { sidebarCollapsed, toggleSidebar, motionEnabled } = useSettingsStore();
  const widthCtrl = useAnimationControls();
  const iconCtrl = useAnimationControls();

  const menuItems = toMenuItems(NAV_ROUTES, t, navigate);

  // Collapsing (expanded) → pill stretches right; opening (collapsed) → stretches left.
  const growX = sidebarCollapsed ? -(BUTTON_GROW - BUTTON_SIZE) : 0;
  // Arrow rides to the leading edge: right while collapsing, left while opening.
  const iconShift = sidebarCollapsed ? -ICON_SHIFT : ICON_SHIFT;
  // Arrow heading after toggle: collapsed points right (0deg), expanded points left (180deg).
  const targetRotate = sidebarCollapsed ? 180 : 0;

  // Mouse/touch press → stretch the button width outward and push the arrow to the edge.
  const handlePressStart = () => {
    if (!motionEnabled) return;
    void widthCtrl.start({
      width: BUTTON_GROW,
      x: growX,
      transition: { duration: 0.18, ease: 'easeOut' },
    });
    void iconCtrl.start({ x: iconShift, transition: { duration: 0.18, ease: 'easeOut' } });
  };

  // Release over the button → retract, toggle, then rotate the arrow once settled.
  const handlePressEnd = () => {
    if (motionEnabled) {
      void widthCtrl.start({
        width: BUTTON_SIZE,
        x: 0,
        transition: { duration: 0.22, ease: 'easeIn' },
      });
      void iconCtrl.start({
        x: 0,
        rotate: targetRotate,
        transition: {
          x: { duration: 0.22, ease: 'easeIn' },
          rotate: { duration: 0.3, delay: 0.2, ease: 'easeInOut' },
        },
      });
    } else {
      widthCtrl.set({ width: BUTTON_SIZE, x: 0 });
      iconCtrl.set({ x: 0, rotate: targetRotate });
    }
    toggleSidebar();
  };

  // Released off the button (or canceled) → retract without toggling.
  const handlePressCancel = () => {
    if (motionEnabled) {
      void widthCtrl.start({ width: BUTTON_SIZE, x: 0, transition: { duration: 0.18 } });
      void iconCtrl.start({ x: 0, transition: { duration: 0.18 } });
    }
  };

  // Keyboard activation: stretch out and back in one sweep, then rotate + toggle.
  const handleKeyToggle = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (motionEnabled) {
      void widthCtrl.start({
        width: [BUTTON_SIZE, BUTTON_GROW, BUTTON_SIZE],
        x: [0, growX, 0],
        transition: { duration: 0.4, ease: 'easeInOut' },
      });
      void iconCtrl.start({
        x: [0, iconShift, 0],
        rotate: targetRotate,
        transition: {
          x: { duration: 0.4, ease: 'easeInOut' },
          rotate: { duration: 0.3, delay: 0.4, ease: 'easeInOut' },
        },
      });
    } else {
      widthCtrl.set({ width: BUTTON_SIZE, x: 0 });
      iconCtrl.set({ x: 0, rotate: targetRotate });
    }
    toggleSidebar();
  };

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
      trigger={null}
      collapsed={sidebarCollapsed}
      width={256}
      collapsedWidth={80}
      style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
    >
      <motion.button
        type="button"
        onPointerDown={handlePressStart}
        onPointerUp={handlePressEnd}
        onPointerLeave={handlePressCancel}
        onKeyDown={handleKeyToggle}
        aria-label={t(sidebarCollapsed ? 'actions.expand' : 'actions.collapse')}
        title={t(sidebarCollapsed ? 'actions.expand' : 'actions.collapse')}
        initial={{ width: BUTTON_SIZE }}
        animate={widthCtrl}
        className="absolute left-full z-101 flex items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md transition-colors hover:text-primary"
        style={{
          top: '50%',
          height: BUTTON_SIZE,
          marginTop: -BUTTON_SIZE / 2,
          marginLeft: -BUTTON_SIZE / 2,
        }}
      >
        <motion.span
          className="inline-flex"
          animate={iconCtrl}
          initial={{ rotate: sidebarCollapsed ? 0 : 180 }}
        >
          <RightOutlined className="text-xs" />
        </motion.span>
      </motion.button>

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
        {...(!sidebarCollapsed && { openKeys, onOpenChange: setOpenKeys })}
        items={menuItems}
        className="border-r-0 mt-2"
      />
    </Sider>
  );
}

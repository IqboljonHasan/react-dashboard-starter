import {
  BellOutlined,
  DesktopOutlined,
  GlobalOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Badge, Button, Dropdown, Layout, Space, Tooltip, Typography } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSessionStore } from '@/entities/session';
import type { Language, Theme } from '@/entities/settings';
import { useSettingsStore } from '@/entities/settings';
import { ROUTES } from '@/shared/config/routes';
import { Breadcrumbs } from './Breadcrumbs';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'EN',
  uz: 'UZ',
};

const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const THEME_ICONS: Record<Theme, ReactNode> = {
  light: <SunOutlined />,
  dark: <MoonOutlined />,
  system: <DesktopOutlined />,
};

const THEME_CYCLE: Theme[] = ['light', 'dark', 'system'];

export function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const { user, logout } = useSessionStore();
  const { theme, language, setTheme, setLanguage } = useSettingsStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  const cycleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
    setTheme(next);
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('header.profile'),
      onClick: () => navigate(ROUTES.SETTINGS),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('header.logout'),
      danger: true,
      onClick: handleLogout,
    },
  ];

  const languageItems: MenuProps['items'] = [
    { key: 'en', label: 'English', onClick: () => handleLanguageChange('en') },
    { key: 'uz', label: "O'zbek", onClick: () => handleLanguageChange('uz') },
  ];

  return (
    <AntHeader
      className="sticky top-0 z-50 flex items-center justify-between px-6! border-b border-border shadow-sm"
      style={{ backgroundColor: 'var(--color-header)', height: 64 }}
    >
      <Space size="middle" className="min-w-0">
        {/* <Tooltip title={t('actions.back')}>
          <Button
            type="text"
            shape="circle"
            aria-label={t('actions.back')}
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          />
        </Tooltip> */}
        <Breadcrumbs />
      </Space>

      <Space size="middle">
        <Tooltip title={THEME_LABELS[theme]}>
          <Button
            type="text"
            shape="circle"
            aria-label={THEME_LABELS[theme]}
            icon={THEME_ICONS[theme]}
            onClick={cycleTheme}
            className="text-muted-foreground hover:text-foreground"
          />
        </Tooltip>

        <Dropdown menu={{ items: languageItems, selectedKeys: [language] }} placement="bottomRight">
          <Button>
            <GlobalOutlined className="text-lg" />
            <Text className="text-sm text-muted-foreground">{LANGUAGE_LABELS[language]}</Text>
          </Button>
          {/* <Space
            className=" cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="flex justify-center items-center gap-1 bg-muted px-2 py-1 rounded">
            </div>
          </Space> */}
        </Dropdown>

        <Badge count={3} size="small">
          <BellOutlined className="text-lg cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="cursor-pointer" size="small">
            <Avatar
              src={user?.avatarUrl}
              icon={!user?.avatarUrl ? <UserOutlined /> : undefined}
              // size="small"
            />
            <span className="hidden sm:flex flex-col leading-tight">
              <Text className="text-sm text-foreground">{user?.name || 'User'}</Text>
              {user?.role && (
                <Text className="text-xs text-muted-foreground capitalize">{user.role}</Text>
              )}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}

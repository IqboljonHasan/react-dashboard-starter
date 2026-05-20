import { BellOutlined, GlobalOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Badge, Dropdown, Layout, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSessionStore } from '@/entities/session';
import type { Language } from '@/entities/settings';
import { useSettingsStore } from '@/entities/settings';
import { ROUTES } from '@/shared/config/routes';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const { user, logout } = useSessionStore();
  const { setLanguage } = useSettingsStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    void i18n.changeLanguage(lang);
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
      className="sticky top-0 z-50 flex items-center justify-between px-6 border-b border-border shadow-sm"
      style={{ backgroundColor: 'var(--color-header)', height: 64 }}
    >
      <div />

      <Space size="middle">
        <Dropdown menu={{ items: languageItems }} placement="bottomRight">
          <GlobalOutlined className="text-lg cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
        </Dropdown>

        <Badge count={3} size="small">
          <BellOutlined className="text-lg cursor-pointer text-muted-foreground hover:text-foreground transition-colors" />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="cursor-pointer" size="small">
            <Avatar
              src={user?.avatarUrl}
              icon={!user?.avatarUrl ? <UserOutlined /> : undefined}
              size="small"
            />
            <Text className="hidden sm:inline text-foreground">{user?.name}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}

import { LogoutOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config/routes';

interface LogoutButtonProps {
  type?: 'text' | 'default' | 'primary' | 'dashed' | 'link';
}

export function LogoutButton({ type = 'text' }: LogoutButtonProps) {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const logout = useSessionStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <Button type={type} icon={<LogoutOutlined />} onClick={handleLogout} danger>
      {t('header.logout')}
    </Button>
  );
}

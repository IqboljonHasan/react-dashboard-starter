import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';

export function ForbiddenPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Result
        status="403"
        title="403"
        subTitle={t('forbidden.subtitle')}
        extra={
          <Button type="primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
            {t('forbidden.backHome')}
          </Button>
        }
      />
    </div>
  );
}

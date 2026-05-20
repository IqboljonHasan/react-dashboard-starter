import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { AppearanceForm } from '@/features/settings-form';
import { PageTitle } from '@/shared/ui/PageTitle';

const { Title } = Typography;

export function SettingsPage() {
  const { t } = useTranslation('settings');

  return (
    <div>
      <PageTitle title={t('page.title')} />
      <Title level={4} className="!mb-6 text-foreground">
        {t('page.title')}
      </Title>
      <AppearanceForm />
    </div>
  );
}

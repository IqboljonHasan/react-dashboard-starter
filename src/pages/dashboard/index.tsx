import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/shared/ui/PageTitle';
import { StatsOverview } from '@/widgets/stats-overview';

const { Title } = Typography;

export function DashboardPage() {
  const { t } = useTranslation('dashboard');

  return (
    <div>
      <PageTitle title={t('page.title')} />
      <Title level={4} className="mb-6! text-foreground">
        {t('page.title')}
      </Title>
      <StatsOverview />
    </div>
  );
}

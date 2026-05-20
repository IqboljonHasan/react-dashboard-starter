import { Empty, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/shared/ui/PageTitle';

const { Title } = Typography;

export function ReportsPage() {
  const { t } = useTranslation('common');

  return (
    <div>
      <PageTitle title="Reports" />
      <Title level={4} className="!mb-6 text-foreground">
        Reports
      </Title>
      <Empty description={t('status.empty')} />
    </div>
  );
}

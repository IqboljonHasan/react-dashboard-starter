import { PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/shared/ui/PageTitle';
import { UsersFilters, UsersTable } from '@/widgets/users-table';

const { Title } = Typography;

export function UsersPage() {
  const { t } = useTranslation('users');

  return (
    <div>
      <PageTitle title={t('page.title')} />
      <div className="flex items-center justify-between mb-6">
        <Title level={4} className="!mb-0 text-foreground">
          {t('page.title')}
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          {t('page.addUser')}
        </Button>
      </div>
      <UsersFilters />
      <UsersTable />
    </div>
  );
}

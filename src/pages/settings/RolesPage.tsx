import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/shared/ui/PageTitle';
import { PermissionsMatrix, UserRoleAssignment } from '@/widgets/role-permissions';

const { Title } = Typography;

export function RolesPage() {
  const { t } = useTranslation('settings');

  return (
    <div>
      <PageTitle title={t('roles.pageTitle')} />
      <Title level={4} className="mb-6 text-foreground">
        {t('roles.pageTitle')}
      </Title>
      <PermissionsMatrix />
      <UserRoleAssignment />
    </div>
  );
}

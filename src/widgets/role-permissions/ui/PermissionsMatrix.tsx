import { CheckCircleFilled, CloseCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Card, Table } from 'antd';
import { useTranslation } from 'react-i18next';

import { ALL_PERMISSIONS, ALL_ROLES, hasPermission, type Permission } from '@/entities/session';

interface MatrixRow {
  permission: Permission;
}

export function PermissionsMatrix() {
  const { t } = useTranslation('settings');
  const { t: tUsers } = useTranslation('users');

  const columns: TableProps<MatrixRow>['columns'] = [
    {
      title: t('roles.permission'),
      dataIndex: 'permission',
      key: 'permission',
      render: (permission: Permission) => t(`roles.permissions.${permission}`),
    },
    ...ALL_ROLES.map((role) => ({
      title: tUsers(`roles.${role}`),
      key: role,
      align: 'center' as const,
      render: (_: unknown, row: MatrixRow) =>
        hasPermission(role, row.permission) ? (
          <CheckCircleFilled className="text-success" />
        ) : (
          <CloseCircleOutlined className="text-muted-foreground" />
        ),
    })),
  ];

  return (
    <Card title={t('roles.matrixTitle')} className="mb-6">
      <Table<MatrixRow>
        columns={columns}
        dataSource={ALL_PERMISSIONS.map((permission) => ({ permission }))}
        rowKey="permission"
        pagination={false}
        size="small"
      />
    </Card>
  );
}

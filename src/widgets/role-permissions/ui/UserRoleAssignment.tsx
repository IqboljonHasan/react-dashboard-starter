import type { TableProps } from 'antd';
import { Card, Select, Space, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import { ALL_ROLES, useSessionStore } from '@/entities/session';
import type { User, UserRole } from '@/entities/user';
import { UserAvatar, useUsersQuery } from '@/entities/user';
import { useUpdateUser } from '@/features/user-update';

const { Text } = Typography;

export function UserRoleAssignment() {
  const { t } = useTranslation('settings');
  const { t: tUsers } = useTranslation('users');
  const currentUserId = useSessionStore((s) => s.user?.id);

  const { data, isFetching } = useUsersQuery({
    page: 1,
    pageSize: 100,
    search: '',
    role: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const { mutate: updateUser, isPending } = useUpdateUser();

  const columns: TableProps<User>['columns'] = [
    {
      title: t('roles.user'),
      key: 'user',
      render: (_, record) => (
        <Space>
          <UserAvatar avatarUrl={record.avatarUrl} name={record.name} size="small" />
          <div>
            <Text strong className="block leading-tight">
              {record.name}
            </Text>
            <Text className="text-muted-foreground text-xs">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: tUsers('table.role'),
      key: 'role',
      width: 200,
      render: (_, record) => (
        <Select<UserRole>
          value={record.role}
          className="w-full"
          disabled={record.id === currentUserId}
          loading={isPending}
          onChange={(role) => updateUser({ id: record.id, payload: { role } })}
          options={ALL_ROLES.map((role) => ({ value: role, label: tUsers(`roles.${role}`) }))}
        />
      ),
    },
  ];

  return (
    <Card title={t('roles.assignmentTitle')}>
      <Table<User>
        columns={columns}
        dataSource={data?.data}
        rowKey="id"
        loading={isFetching}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
}

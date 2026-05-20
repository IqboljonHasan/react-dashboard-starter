import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import type { TableProps } from 'antd';
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';
import { useTranslation } from 'react-i18next';
import type { User, UserRole, UserStatus } from '@/entities/user';
import { UserAvatar, userApi, userKeys } from '@/entities/user';
import { useDeleteUser } from '@/features/user-delete';
import dayjs from '@/shared/lib/dayjs';

const { Text } = Typography;

const STATUS_COLOR: Record<UserStatus, string> = {
  active: 'green',
  inactive: 'default',
  suspended: 'red',
};

const roleParser = parseAsStringEnum<UserRole>(['admin', 'manager', 'viewer']).withDefault(
  '' as UserRole,
);
const statusParser = parseAsStringEnum<UserStatus>(['active', 'inactive', 'suspended']).withDefault(
  '' as UserStatus,
);

export function UsersTable() {
  const { t } = useTranslation('users');

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(20));
  const [search] = useQueryState('search', parseAsString.withDefault(''));
  const [role] = useQueryState('role', roleParser);
  const [status] = useQueryState('status', statusParser);

  const { data, isFetching } = useQuery({
    queryKey: userKeys.list({
      page,
      pageSize,
      search,
      role,
      status,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    queryFn: () =>
      userApi.list({
        page,
        pageSize,
        search,
        role,
        status,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    placeholderData: (prev) => prev,
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const columns: TableProps<User>['columns'] = [
    {
      title: t('table.user'),
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
      title: t('table.role'),
      dataIndex: 'role',
      key: 'role',
      render: (r: UserRole) => <Tag>{t(`roles.${r}`)}</Tag>,
    },
    {
      title: t('table.status'),
      dataIndex: 'status',
      key: 'status',
      render: (s: UserStatus) => <Tag color={STATUS_COLOR[s]}>{t(`status.${s}`)}</Tag>,
    },
    {
      title: t('table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD MMM YYYY'),
    },
    {
      title: t('table.actions'),
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Popconfirm
            title={t('deleteConfirm.title')}
            description={t('deleteConfirm.description')}
            onConfirm={() => deleteUser(record.id)}
            okText={t('deleteConfirm.ok')}
            cancelText={t('deleteConfirm.cancel')}
            okButtonProps={{ danger: true, loading: isDeleting }}
          >
            <Button type="text" icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<User>
      columns={columns}
      dataSource={data?.data}
      rowKey="id"
      loading={isFetching}
      pagination={{
        current: page,
        pageSize,
        total: data?.total ?? 0,
        showSizeChanger: true,
        showTotal: (total, range) =>
          t('table.pagination', { start: range[0], end: range[1], total }),
        onChange: (p, ps) => {
          void setPage(p);
          void setPageSize(ps);
        },
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: 'max-content' }}
    />
  );
}

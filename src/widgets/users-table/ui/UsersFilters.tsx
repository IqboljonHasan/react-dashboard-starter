import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import { parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';
import { useTranslation } from 'react-i18next';

import type { UserRole, UserStatus } from '@/entities/user';

const roleParser = parseAsStringEnum<UserRole>(['admin', 'manager', 'viewer']).withDefault(
  '' as UserRole,
);
const statusParser = parseAsStringEnum<UserStatus>(['active', 'inactive', 'suspended']).withDefault(
  '' as UserStatus,
);

export function UsersFilters() {
  const { t } = useTranslation('users');

  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [role, setRole] = useQueryState('role', roleParser);
  const [status, setStatus] = useQueryState('status', statusParser);

  const handleClear = () => {
    void setSearch(null);
    void setRole(null);
    void setStatus(null);
  };

  const hasActiveFilters = search || role || status;

  return (
    <Row gutter={[12, 12]} className="mb-4">
      <Col xs={24} sm={12} md={8} lg={6}>
        <Input
          placeholder={t('filters.searchPlaceholder')}
          prefix={<SearchOutlined className="text-muted-foreground" />}
          value={search}
          onChange={(e) => void setSearch(e.target.value || null)}
          allowClear
        />
      </Col>
      <Col xs={24} sm={6} md={4} lg={3}>
        <Select
          className="w-full"
          placeholder={t('filters.rolePlaceholder')}
          value={role || undefined}
          onChange={(v) => void setRole(v ?? null)}
          allowClear
          options={[
            { value: 'admin', label: t('roles.admin') },
            { value: 'manager', label: t('roles.manager') },
            { value: 'viewer', label: t('roles.viewer') },
          ]}
        />
      </Col>
      <Col xs={24} sm={6} md={4} lg={3}>
        <Select
          className="w-full"
          placeholder={t('filters.statusPlaceholder')}
          value={status || undefined}
          onChange={(v) => void setStatus(v ?? null)}
          allowClear
          options={[
            { value: 'active', label: t('status.active') },
            { value: 'inactive', label: t('status.inactive') },
            { value: 'suspended', label: t('status.suspended') },
          ]}
        />
      </Col>
      {hasActiveFilters && (
        <Col>
          <Button icon={<ClearOutlined />} onClick={handleClear}>
            {t('filters.clear')}
          </Button>
        </Col>
      )}
    </Row>
  );
}

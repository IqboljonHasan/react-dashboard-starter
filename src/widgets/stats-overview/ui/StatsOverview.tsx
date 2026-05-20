import {
  ClockCircleOutlined,
  DollarOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';

import { statsApi, statsKeys } from '@/entities/dashboard-stats';
import { StatsCard } from './StatsCard';

export function StatsOverview() {
  const { t } = useTranslation('dashboard');
  const { data: stats, isLoading } = useQuery({
    queryKey: statsKeys.stats(),
    queryFn: statsApi.getStats,
    refetchInterval: 60_000,
  });

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <StatsCard
          title={t('stats.totalUsers')}
          value={stats?.totalUsers}
          prefix={<UserOutlined />}
          growthPercent={stats?.userGrowthPercent}
          loading={isLoading}
          color="var(--color-primary)"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatsCard
          title={t('stats.totalRevenue')}
          value={stats?.totalRevenue}
          prefix={<DollarOutlined />}
          formatter={(v) => `$${v.toLocaleString()}`}
          growthPercent={stats?.revenueGrowthPercent}
          loading={isLoading}
          color="var(--color-success)"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatsCard
          title={t('stats.activeProjects')}
          value={stats?.activeProjects}
          prefix={<ProjectOutlined />}
          loading={isLoading}
          color="#722ed1"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatsCard
          title={t('stats.pendingTasks')}
          value={stats?.pendingTasks}
          prefix={<ClockCircleOutlined />}
          loading={isLoading}
          color="var(--color-warning)"
        />
      </Col>
    </Row>
  );
}

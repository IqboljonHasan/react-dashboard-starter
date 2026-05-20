import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Skeleton, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value?: number;
  prefix?: ReactNode;
  suffix?: string;
  growthPercent?: number;
  formatter?: (value: number) => string;
  loading?: boolean;
  color?: string;
}

export function StatsCard({
  title,
  value,
  prefix,
  suffix,
  growthPercent,
  formatter,
  loading = false,
  color = 'var(--color-primary)',
}: StatsCardProps) {
  const isPositive = (growthPercent ?? 0) >= 0;

  return (
    <Card
      className="h-full shadow-sm hover:shadow-md transition-shadow bg-surface"
      bordered={false}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <Statistic
          title={<span className="text-muted-foreground text-sm font-medium">{title}</span>}
          value={value}
          formatter={formatter ? (val) => formatter(val as number) : undefined}
          prefix={
            <span style={{ color }} className="text-2xl">
              {prefix}
            </span>
          }
          suffix={suffix}
          valueStyle={{ color, fontWeight: 700, fontSize: 28 }}
        />
      )}
      {growthPercent !== undefined && !loading && (
        <div
          className={`mt-2 flex items-center text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}
        >
          {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span className="ml-1">{Math.abs(growthPercent).toFixed(1)}% vs last month</span>
        </div>
      )}
    </Card>
  );
}

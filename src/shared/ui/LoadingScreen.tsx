import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 40, color: 'var(--color-primary)' }} spin />}
        size="large"
      />
      <p className="text-muted-foreground text-sm animate-pulse">Loading...</p>
    </div>
  );
}

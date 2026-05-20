import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Back Home
          </Button>
        }
      />
    </div>
  );
}

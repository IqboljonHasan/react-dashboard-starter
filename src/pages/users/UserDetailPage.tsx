import { ArrowLeftOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Descriptions, Tag } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import { ROUTES } from '@/shared/config/routes';
import { PageTitle } from '@/shared/ui/PageTitle';

const ROLE_COLORS: Record<string, string> = {
  admin: 'red',
  manager: 'blue',
  viewer: 'default',
};

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <>
      <PageTitle title="User Detail" />
      <div className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.USERS)}>
          Back to users
        </Button>
      </div>
      <Card className="max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            size={72}
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`}
            icon={<UserOutlined />}
          />
          <div>
            <p className="text-lg font-semibold text-foreground">User #{id}</p>
            <Tag color={ROLE_COLORS['viewer']}>viewer</Tag>
          </div>
        </div>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item
            label={
              <>
                <UserOutlined className="mr-1" />
                Name
              </>
            }
          >
            User #{id}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <>
                <MailOutlined className="mr-1" />
                Email
              </>
            }
          >
            user{id}@example.com
          </Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={ROLE_COLORS['viewer']}>viewer</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color="success">Active</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
}

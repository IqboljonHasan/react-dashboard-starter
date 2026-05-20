import { SaveOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Form, Input } from 'antd';

import { useSessionStore } from '@/entities/session';
import { PageTitle } from '@/shared/ui/PageTitle';

export function ProfilePage() {
  const user = useSessionStore((s) => s.user);

  return (
    <>
      <PageTitle title="Profile" />
      <Card title="Profile" className="max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <Avatar
            size={64}
            src={user?.avatarUrl}
            icon={!user?.avatarUrl ? <UserOutlined /> : undefined}
          />
          <div>
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.role}</p>
          </div>
        </div>
        <Form layout="vertical" initialValues={{ name: user?.name, email: user?.email }}>
          <Form.Item name="name" label="Full name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email address" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Button type="primary" icon={<SaveOutlined />}>
            Save changes
          </Button>
        </Form>
      </Card>
    </>
  );
}

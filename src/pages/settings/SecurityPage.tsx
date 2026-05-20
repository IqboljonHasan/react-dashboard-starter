import { LockOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input } from 'antd';

import { PageTitle } from '@/shared/ui/PageTitle';

export function SecurityPage() {
  return (
    <>
      <PageTitle title="Security" />
      <Card title="Change password" className="max-w-lg">
        <Form layout="vertical">
          <Form.Item
            name="current"
            label="Current password"
            rules={[{ required: true }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="next"
            label="New password"
            rules={[{ required: true, min: 8 }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm new password"
            dependencies={['next']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('next') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Button type="primary">Update password</Button>
        </Form>
      </Card>
    </>
  );
}

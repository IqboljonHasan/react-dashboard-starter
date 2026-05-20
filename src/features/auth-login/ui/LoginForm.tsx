import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { LoginPayload } from '../api/loginApi';
import { useLoginMutation } from '../model/useLoginMutation';

const { Title, Text } = Typography;

export function LoginForm() {
  const { t } = useTranslation('auth');
  const { mutate: login, isPending } = useLoginMutation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-0" bordered={false}>
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <LockOutlined className="text-white text-xl" />
          </div>
          <Title level={3} className="!mb-1">
            {t('login.title')}
          </Title>
          <Text className="text-muted-foreground">{t('login.subtitle')}</Text>
        </div>

        <Form<LoginPayload> layout="vertical" size="large" onFinish={login} requiredMark={false}>
          <Form.Item
            name="email"
            label={t('login.emailLabel')}
            rules={[
              { required: true, message: t('login.emailRequired') },
              { type: 'email', message: t('login.emailInvalid') },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-muted-foreground" />}
              placeholder={t('login.emailPlaceholder')}
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('login.passwordLabel')}
            rules={[{ required: true, message: t('login.passwordRequired') }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-muted-foreground" />}
              placeholder={t('login.passwordPlaceholder')}
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className="!mb-0 mt-6">
            <Button type="primary" htmlType="submit" loading={isPending} block size="large">
              {t('login.submitButton')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

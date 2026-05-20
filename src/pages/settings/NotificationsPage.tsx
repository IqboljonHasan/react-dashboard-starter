import { Card, Divider, Switch, Typography } from 'antd';
import { useState } from 'react';

import { PageTitle } from '@/shared/ui/PageTitle';

const { Text } = Typography;

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

const SETTINGS: NotifSetting[] = [
  {
    id: 'email_activity',
    label: 'Email notifications',
    description: 'Receive emails for important account activity',
    defaultValue: true,
  },
  {
    id: 'push_alerts',
    label: 'Push alerts',
    description: 'Browser push notifications for real-time updates',
    defaultValue: false,
  },
  {
    id: 'weekly_digest',
    label: 'Weekly digest',
    description: 'A weekly summary of your dashboard activity',
    defaultValue: true,
  },
  {
    id: 'security_alerts',
    label: 'Security alerts',
    description: 'Get notified about sign-ins from new devices',
    defaultValue: true,
  },
];

export function NotificationsPage() {
  const [values, setValues] = useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.defaultValue])),
  );

  return (
    <>
      <PageTitle title="Notifications" />
      <Card title="Notification preferences" className="max-w-lg">
        {SETTINGS.map((setting, i) => (
          <div key={setting.id}>
            {i > 0 && <Divider className="!my-4" />}
            <div className="flex items-center justify-between gap-4">
              <div>
                <Text strong className="block text-foreground">
                  {setting.label}
                </Text>
                <Text className="text-sm text-muted-foreground">{setting.description}</Text>
              </div>
              <Switch
                checked={values[setting.id]}
                onChange={(checked) => setValues((v) => ({ ...v, [setting.id]: checked }))}
              />
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

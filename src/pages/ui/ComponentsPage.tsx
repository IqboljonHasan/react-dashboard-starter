import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Progress,
  Radio,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { useTranslation } from 'react-i18next';

import { PageTitle } from '@/shared/ui/PageTitle';

const { Title, Text, Paragraph } = Typography;

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <Card
      className="bg-surface border-border"
      title={<span className="text-foreground">{title}</span>}
    >
      {children}
    </Card>
  );
}

interface DemoRow {
  key: string;
  name: string;
  role: string;
  status: 'active' | 'invited';
}

const tableData: DemoRow[] = [
  { key: '1', name: 'Aziz Karimov', role: 'Admin', status: 'active' },
  { key: '2', name: 'Dilnoza Yusupova', role: 'Manager', status: 'active' },
  { key: '3', name: 'Sardor Aliyev', role: 'Viewer', status: 'invited' },
];

export function ComponentsPage() {
  const { t } = useTranslation('ui');

  return (
    <div>
      <PageTitle title={t('components.title')} />
      <Title level={4} className="mb-2! text-foreground">
        {t('components.title')}
      </Title>
      <Paragraph className="text-muted-foreground">{t('components.description')}</Paragraph>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section title={t('components.sections.buttons')}>
          <Space wrap>
            <Button type="primary">{t('components.actions.primary')}</Button>
            <Button>{t('components.actions.default')}</Button>
            <Button type="dashed">{t('components.actions.dashed')}</Button>
            <Button type="text">{t('components.actions.text')}</Button>
            <Button type="link">{t('components.actions.link')}</Button>
            <Button type="primary" danger>
              {t('components.actions.danger')}
            </Button>
            <Button type="primary" loading>
              {t('components.actions.loading')}
            </Button>
            <Button type="primary" disabled>
              {t('components.actions.disabled')}
            </Button>
          </Space>
        </Section>

        <Section title={t('components.sections.inputs')}>
          <Space direction="vertical" className="w-full" size="middle">
            <Input placeholder={t('components.placeholders.text')} />
            <Input.Password placeholder={t('components.placeholders.password')} />
            <Input.Search placeholder={t('components.placeholders.search')} enterButton />
            <Select
              className="w-full"
              defaultValue="admin"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'viewer', label: 'Viewer' },
              ]}
            />
            <DatePicker className="w-full" />
          </Space>
        </Section>

        <Section title={t('components.sections.selection')}>
          <Space direction="vertical" size="middle">
            <Space>
              <Switch defaultChecked />
              <Switch />
            </Space>
            <Checkbox.Group
              options={['React', 'TypeScript', 'Vite']}
              defaultValue={['React', 'Vite']}
            />
            <Radio.Group defaultValue="a">
              <Radio value="a">{t('components.actions.optionA')}</Radio>
              <Radio value="b">{t('components.actions.optionB')}</Radio>
              <Radio value="c">{t('components.actions.optionC')}</Radio>
            </Radio.Group>
            <Slider defaultValue={40} className="w-64" />
            <Rate defaultValue={4} />
          </Space>
        </Section>

        <Section title={t('components.sections.feedback')}>
          <Space direction="vertical" className="w-full" size="middle">
            <Alert message={t('components.alerts.success')} type="success" showIcon />
            <Alert message={t('components.alerts.info')} type="info" showIcon />
            <Alert message={t('components.alerts.warning')} type="warning" showIcon />
            <Alert message={t('components.alerts.error')} type="error" showIcon />
            <Progress percent={70} />
            <Progress percent={100} status="success" />
          </Space>
        </Section>

        <Section title={t('components.sections.dataDisplay')}>
          <Space direction="vertical" size="middle">
            <Space wrap>
              <Tag color="blue">Blue</Tag>
              <Tag color="green">Green</Tag>
              <Tag color="gold">Gold</Tag>
              <Tag color="red">Red</Tag>
              <Tag>Default</Tag>
            </Space>
            <Space size="large">
              <Badge count={5}>
                <Avatar shape="square">A</Avatar>
              </Badge>
              <Badge dot>
                <Avatar>B</Avatar>
              </Badge>
              <Avatar.Group>
                <Avatar>U1</Avatar>
                <Avatar style={{ backgroundColor: '#87d068' }}>U2</Avatar>
                <Avatar style={{ backgroundColor: '#1677ff' }}>U3</Avatar>
              </Avatar.Group>
            </Space>
            <Divider className="my-2!" />
            <Text className="text-muted-foreground">{t('components.dividerNote')}</Text>
          </Space>
        </Section>

        <Section title={t('components.sections.navigation')}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: t('components.tabs.overview'),
                children: <Text>Overview content</Text>,
              },
              {
                key: '2',
                label: t('components.tabs.activity'),
                children: <Text>Activity content</Text>,
              },
              {
                key: '3',
                label: t('components.tabs.settings'),
                children: <Text>Settings content</Text>,
              },
            ]}
          />
        </Section>
      </div>

      <Card
        className="bg-surface border-border mt-6"
        title={<span className="text-foreground">{t('components.sections.table')}</span>}
      >
        <Table<DemoRow>
          dataSource={tableData}
          pagination={false}
          columns={[
            { title: t('components.table.name'), dataIndex: 'name', key: 'name' },
            { title: t('components.table.role'), dataIndex: 'role', key: 'role' },
            {
              title: t('components.table.status'),
              dataIndex: 'status',
              key: 'status',
              render: (status: DemoRow['status']) => (
                <Tag color={status === 'active' ? 'green' : 'gold'}>
                  {t(`components.table.${status}`)}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

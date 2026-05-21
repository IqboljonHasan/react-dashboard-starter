import { DatabaseOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

import { queryClient } from '@/shared/api/queryClient';
import { useFakeDataStore } from '../model/fakeDataStore';

export function FakeDataToggle() {
  const { enabled, toggle } = useFakeDataStore();

  const handleToggle = () => {
    toggle();
    void queryClient.invalidateQueries();
  };

  return (
    <Tooltip title={enabled ? 'Disable fake data' : 'Enable fake data'} placement="right">
      <Button
        onClick={handleToggle}
        size="small"
        style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 9999 }}
        type={enabled ? 'primary' : 'default'}
        icon={<DatabaseOutlined />}
      >
        Fake{enabled ? ': ON' : ': OFF'}
      </Button>
    </Tooltip>
  );
}

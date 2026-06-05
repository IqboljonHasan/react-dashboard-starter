import { CheckOutlined } from '@ant-design/icons';
import { Divider, Modal, Segmented, Space, Switch, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

import type { ColorTheme, Language, Theme } from '@/entities/settings';
import { useSettingsStore } from '@/entities/settings';
import { queryClient } from '@/shared/api/queryClient';
import { THEME_PRESETS } from '@/shared/config/themePresets';
import { useFakeDataStore } from '@/shared/fake-data';

const { Text } = Typography;

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { t, i18n } = useTranslation('settings');
  const { theme, colorTheme, language, setTheme, setColorTheme, setLanguage } = useSettingsStore();
  const { enabled: fakeEnabled, toggle: toggleFake } = useFakeDataStore();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  const handleFakeToggle = () => {
    toggleFake();
    void queryClient.invalidateQueries();
  };

  return (
    <Modal title={t('page.title')} open={open} onCancel={onClose} footer={null} width={440}>
      <Space direction="vertical" size="large" className="w-full pt-2">
        <div>
          <Text className="block mb-2 text-muted-foreground">{t('fields.colorTheme')}</Text>
          <div className="flex gap-3">
            {THEME_PRESETS.map((preset) => {
              const selected = preset.id === colorTheme;
              return (
                <Tooltip key={preset.id} title={preset.label}>
                  <button
                    type="button"
                    aria-label={preset.label}
                    aria-pressed={selected}
                    onClick={() => setColorTheme(preset.id as ColorTheme)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform hover:scale-105"
                    style={{
                      backgroundColor: preset.primary,
                      borderColor: selected ? 'var(--color-foreground)' : 'transparent',
                    }}
                  >
                    {selected && <CheckOutlined style={{ color: '#fff' }} />}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        <div>
          <Text className="block mb-2 text-muted-foreground">{t('fields.theme')}</Text>
          <Segmented<Theme>
            block
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'light', label: t('theme.light') },
              { value: 'dark', label: t('theme.dark') },
              { value: 'system', label: t('theme.system') },
            ]}
          />
        </div>

        <div>
          <Text className="block mb-2 text-muted-foreground">{t('fields.language')}</Text>
          <Segmented<Language>
            block
            value={language}
            onChange={handleLanguageChange}
            options={[
              { value: 'en', label: 'English' },
              { value: 'uz', label: "O'zbek" },
            ]}
          />
        </div>

        <Divider className="my-0" />

        <div className="flex items-center justify-between">
          <div>
            <Text className="block text-foreground">{t('fields.fakeData')}</Text>
            <Text className="text-xs text-muted-foreground">{t('hints.fakeData')}</Text>
          </div>
          <Switch checked={fakeEnabled} onChange={handleFakeToggle} />
        </div>
      </Space>
    </Modal>
  );
}

import { Card, Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Language, Theme } from '@/entities/settings';
import { useSettingsStore } from '@/entities/settings';

export function AppearanceForm() {
  const { t, i18n } = useTranslation('settings');
  const { theme, language, setTheme, setLanguage } = useSettingsStore();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  return (
    <Card title={t('sections.appearance')} className="max-w-lg">
      <Form layout="vertical">
        <Form.Item label={t('fields.theme')}>
          <Select<Theme>
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'light', label: t('theme.light') },
              { value: 'dark', label: t('theme.dark') },
              { value: 'system', label: t('theme.system') },
            ]}
          />
        </Form.Item>
        <Form.Item label={t('fields.language')}>
          <Select<Language>
            value={language}
            onChange={handleLanguageChange}
            options={[
              { value: 'en', label: 'English' },
              { value: 'uz', label: "O'zbek" },
            ]}
          />
        </Form.Item>
      </Form>
    </Card>
  );
}

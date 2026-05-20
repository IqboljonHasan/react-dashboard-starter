import type { ThemeConfig } from 'antd';
import { theme as antdAlgorithm } from 'antd';

export const antdTheme: ThemeConfig = {
  cssVar: true,
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,
  },
  components: {
    Layout: {
      siderBg: '#001529',
      headerBg: '#ffffff',
      bodyBg: '#f5f7fa',
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
      darkItemSelectedBg: '#1677ff',
    },
    Table: {
      headerBg: '#fafafa',
      rowHoverBg: '#f0f6ff',
    },
    Card: {
      borderRadius: 12,
    },
  },
};

export const antdDarkTheme: ThemeConfig = {
  ...antdTheme,
  algorithm: antdAlgorithm.darkAlgorithm,
  components: {
    ...antdTheme.components,
    Layout: {
      siderBg: '#001529',
      headerBg: '#1a1a1a',
      bodyBg: '#0f0f0f',
    },
  },
};

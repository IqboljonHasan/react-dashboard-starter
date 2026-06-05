import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App as AntApp, theme as antdAlgorithm, ConfigProvider } from 'antd';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6';
import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { useSettingsStore } from '@/entities/settings';
import { SettingsButton } from '@/features/settings-form';
import { queryClient } from '@/shared/api/queryClient';
import { antdDarkTheme, antdTheme } from '@/shared/config/antdTheme';
import { getThemePreset } from '@/shared/config/themePresets';
import { LoadingScreen } from '@/shared/ui/LoadingScreen';
import { router } from '../router';

function ThemeSync() {
  const theme = useSettingsStore((s) => s.theme);
  const colorTheme = useSettingsStore((s) => s.colorTheme);
  const motionEnabled = useSettingsStore((s) => s.motionEnabled);

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', motionEnabled ? 'on' : 'off');
  }, [motionEnabled]);

  useEffect(() => {
    const preset = getThemePreset(colorTheme);
    const root = document.documentElement;
    root.style.setProperty('--color-primary', preset.primary);
    root.style.setProperty('--color-primary-hover', preset.primaryHover);
    root.style.setProperty('--color-primary-active', preset.primaryActive);
    root.style.setProperty('--color-ring', preset.primary);
  }, [colorTheme]);

  return null;
}

function AppProviders() {
  const theme = useSettingsStore((s) => s.theme);
  const colorTheme = useSettingsStore((s) => s.colorTheme);
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const preset = getThemePreset(colorTheme);
  const baseTheme = isDark
    ? { ...antdDarkTheme, algorithm: antdAlgorithm.darkAlgorithm }
    : antdTheme;
  const activeTheme = {
    ...baseTheme,
    token: { ...baseTheme.token, colorPrimary: preset.primary, colorInfo: preset.primary },
  };

  return (
    <ConfigProvider theme={activeTheme}>
      <AntApp>
        <ThemeSync />
        <NuqsAdapter>
          <Suspense fallback={<LoadingScreen />}>
            <RouterProvider router={router} />
          </Suspense>
        </NuqsAdapter>
        <SettingsButton />
      </AntApp>
    </ConfigProvider>
  );
}

export function RootProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

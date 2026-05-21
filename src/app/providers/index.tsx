import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App as AntApp, theme as antdAlgorithm, ConfigProvider } from 'antd';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6';
import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { useSettingsStore } from '@/entities/settings';
import { queryClient } from '@/shared/api/queryClient';
import { antdDarkTheme, antdTheme } from '@/shared/config/antdTheme';
import { FakeDataProvider } from '@/shared/fake-data';
import { LoadingScreen } from '@/shared/ui/LoadingScreen';
import { router } from '../router';

function ThemeSync() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [theme]);

  return null;
}

function AppProviders() {
  const theme = useSettingsStore((s) => s.theme);
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const activeTheme = isDark
    ? { ...antdDarkTheme, algorithm: antdAlgorithm.darkAlgorithm }
    : antdTheme;

  return (
    <ConfigProvider theme={activeTheme}>
      <AntApp>
        <ThemeSync />
        <NuqsAdapter>
          <Suspense fallback={<LoadingScreen />}>
            <RouterProvider router={router} />
          </Suspense>
        </NuqsAdapter>
        <FakeDataProvider />
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

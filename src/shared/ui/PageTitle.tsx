import { useEffect } from 'react';
import { env } from '@/shared/config/env';

interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  useEffect(() => {
    document.title = `${title} | ${env.appName}`;
    return () => {
      document.title = env.appName;
    };
  }, [title]);

  return null;
}

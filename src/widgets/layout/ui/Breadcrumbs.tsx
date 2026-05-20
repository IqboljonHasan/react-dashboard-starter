import { Breadcrumb } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useMatches } from 'react-router-dom';

import type { RouteHandle } from '@/app/router/types';

export function Breadcrumbs() {
  const matches = useMatches();
  const { t } = useTranslation('common');

  const crumbs = matches
    .filter((m) => {
      const handle = m.handle as RouteHandle | undefined;
      return handle?.title && !handle.noBreadcrumb;
    })
    .map((m) => {
      const handle = m.handle as RouteHandle;
      const label = t(handle.breadcrumbTitle || handle.title || m.pathname);
      return {
        title: handle.breadcrumbDisabled ? label : <Link to={m.pathname}>{label}</Link>,
      };
    });

  if (crumbs.length === 0) return null;

  return <Breadcrumb items={crumbs} className="mb-4" />;
}

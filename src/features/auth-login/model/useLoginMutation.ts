import { useMutation } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config/routes';
import { loginApi } from '../api/loginApi';

export function useLoginMutation() {
  const { message } = App.useApp();
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const { setTokens, setUser } = useSessionStore();

  return useMutation({
    mutationFn: loginApi.login,
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;
      navigate(from, { replace: true });
      message.success(t('login.success'));
    },
    onError: () => {
      message.error(t('login.error'));
    },
  });
}

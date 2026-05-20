import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';

import { userApi, userKeys } from '@/entities/user';

export function useDeleteUser() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation('users');

  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      message.success(t('deleteSuccess'));
    },
    onError: () => {
      message.error(t('deleteError'));
    },
  });
}

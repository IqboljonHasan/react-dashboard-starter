import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import type { User } from '@/entities/user';
import { userApi, userKeys } from '@/entities/user';
import { useFakeDataStore } from '@/shared/fake-data';

export function useCreateUser() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation('users');

  return useMutation({
    mutationFn: (payload: Omit<User, 'id' | 'createdAt'>) => {
      if (useFakeDataStore.getState().enabled) {
        return Promise.resolve<User>({
          ...payload,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        });
      }
      return userApi.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      message.success(t('createSuccess'));
    },
    onError: () => {
      message.error(t('createError'));
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import type { User } from '@/entities/user';
import { userApi, userKeys } from '@/entities/user';
import { useFakeDataStore } from '@/shared/fake-data';

interface UpdateUserVars {
  id: string;
  payload: Partial<User>;
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation('users');

  return useMutation({
    mutationFn: ({ id, payload }: UpdateUserVars) => {
      if (useFakeDataStore.getState().enabled) {
        const cached = qc.getQueryData<User>(userKeys.detail(id));
        return Promise.resolve<User>({ ...(cached ?? ({} as User)), ...payload, id });
      }
      return userApi.update(id, payload);
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.detail(id) });
      message.success(t('updateSuccess'));
    },
    onError: () => {
      message.error(t('updateError'));
    },
  });
}

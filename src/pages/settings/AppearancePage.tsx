import { AppearanceForm } from '@/features/settings-form';
import { PageTitle } from '@/shared/ui/PageTitle';

export function AppearancePage() {
  return (
    <>
      <PageTitle title="Appearance" />
      <AppearanceForm />
    </>
  );
}

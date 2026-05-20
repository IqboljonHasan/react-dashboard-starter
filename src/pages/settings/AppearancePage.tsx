import { PageTitle } from '@/shared/ui/PageTitle';
import { AppearanceForm } from '@/features/settings-form';

export function AppearancePage() {
  return (
    <>
      <PageTitle title="Appearance" />
      <AppearanceForm />
    </>
  );
}

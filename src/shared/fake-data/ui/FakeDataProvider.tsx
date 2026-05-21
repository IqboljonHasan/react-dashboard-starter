import { FakeDataToggle } from './FakeDataToggle';

export function FakeDataProvider() {
  if (!import.meta.env.DEV) return null;
  return <FakeDataToggle />;
}

/**
 * Color theme presets — the "accent" / brand color applied across AntD and the
 * semantic `--color-primary*` CSS variables. Independent of light/dark mode.
 * Add or tweak presets here; the settings modal and providers consume this list.
 */
export type ColorTheme = 'default' | 'violet' | 'emerald' | 'sunset';

export interface ThemePreset {
  id: ColorTheme;
  label: string;
  primary: string;
  primaryHover: string;
  primaryActive: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    label: 'Default Blue',
    primary: '#1677ff',
    primaryHover: '#4096ff',
    primaryActive: '#0958d9',
  },
  {
    id: 'violet',
    label: 'Violet',
    primary: '#722ed1',
    primaryHover: '#9254de',
    primaryActive: '#531dab',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    primary: '#10b981',
    primaryHover: '#34d399',
    primaryActive: '#059669',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    primary: '#fa541c',
    primaryHover: '#ff7a45',
    primaryActive: '#d4380d',
  },
];

export const DEFAULT_COLOR_THEME: ColorTheme = 'default';

export function getThemePreset(id: ColorTheme): ThemePreset {
  return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
}

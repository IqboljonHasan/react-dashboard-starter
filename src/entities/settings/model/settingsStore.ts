import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { type ColorTheme, DEFAULT_COLOR_THEME } from '@/shared/config/themePresets';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'uz';
export type { ColorTheme };

interface SettingsState {
  theme: Theme;
  colorTheme: ColorTheme;
  language: Language;
  sidebarCollapsed: boolean;
  motionEnabled: boolean;
  setTheme: (theme: Theme) => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMotionEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      colorTheme: DEFAULT_COLOR_THEME,
      language: 'uz',
      sidebarCollapsed: false,
      motionEnabled: true,
      setTheme: (theme) => set({ theme }),
      setColorTheme: (colorTheme) => set({ colorTheme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMotionEnabled: (motionEnabled) => set({ motionEnabled }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

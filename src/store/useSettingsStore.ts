import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  isFirstLaunch: boolean;
  defaultQrSize: number;
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFirstLaunch: (isFirst: boolean) => void;
  setDefaultQrSize: (size: number) => void;
  clearAllSettings: () => void;
}

const initialState = {
  theme: 'system' as const,
  isFirstLaunch: true,
  defaultQrSize: 1024,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTheme: (theme) => set({ theme }),
      setFirstLaunch: (isFirstLaunch) => set({ isFirstLaunch }),
      setDefaultQrSize: (defaultQrSize) => set({ defaultQrSize }),
      clearAllSettings: () => set(initialState),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

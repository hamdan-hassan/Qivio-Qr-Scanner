import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { lightColors, darkColors, Colors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography, Typography } from './typography';
import { shadows, Shadows } from './shadows';
import { gradients, Gradients } from './gradients';
import { useSettingsStore } from '../store/useSettingsStore';

export type Theme = {
  colors: Colors;
  spacing: Spacing;
  typography: Typography;
  shadows: Shadows;
  gradients: Gradients;
  isDark: boolean;
};

const defaultTheme: Theme = {
  colors: lightColors,
  spacing,
  typography,
  shadows,
  gradients,
  isDark: false,
};

const ThemeContext = createContext<{
  theme: Theme;
}>({
  theme: defaultTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme: themeType } = useSettingsStore();
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName | null | undefined>(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDark = 
    themeType === 'dark' || 
    (themeType === 'system' && systemColorScheme === 'dark');

  const theme: Theme = {
    colors: isDark ? darkColors : lightColors,
    spacing,
    typography,
    shadows,
    gradients,
    isDark,
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

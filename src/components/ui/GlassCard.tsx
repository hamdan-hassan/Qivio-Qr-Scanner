import React from 'react';
import { ViewProps, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../../theme';

export interface GlassCardProps extends ViewProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  blurType?: 'light' | 'dark' | 'xlight' | 'prominent' | 'regular' | 'chromeMaterial' | 'material' | 'thickMaterial' | 'thinMaterial' | 'ultraThinMaterial';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  padding = 'md',
  radius = 'md',
  onPress,
  blurType,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'sm': return theme.spacing.sm;
      case 'md': return theme.spacing.base;
      case 'lg': return theme.spacing.xl;
      default: return theme.spacing.base;
    }
  };

  const getRadius = () => {
    switch (radius) {
      case 'sm': return 8;
      case 'md': return 16;
      case 'lg': return 24;
      case 'xl': return 32;
      default: return 16;
    }
  };

  const actualBlurType = blurType || (theme.isDark ? 'dark' : 'light');

  const contentStyles: StyleProp<ViewStyle> = {
    padding: getPadding(),
  };

  const containerStyles: StyleProp<ViewStyle> = [
    styles.container,
    {
      borderRadius: getRadius(),
      borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={containerStyles} activeOpacity={0.7} {...(rest as any)}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={actualBlurType}
          blurAmount={10}
          reducedTransparencyFallbackColor={theme.colors.surfaceLight}
        />
        <BlurView style={contentStyles} blurType={actualBlurType} blurAmount={10}>
             {children}
        </BlurView>
      </TouchableOpacity>
    );
  }

  return (
    <BlurView
      style={containerStyles}
      blurType={actualBlurType}
      blurAmount={10}
      reducedTransparencyFallbackColor={theme.colors.surfaceLight}
      {...rest as any}
    >
      <BlurView style={contentStyles} blurType={actualBlurType} blurAmount={10}>
          {children}
      </BlurView>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

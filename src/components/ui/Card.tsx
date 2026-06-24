import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme';

export interface CardProps extends ViewProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  padding = 'md',
  radius = 'md',
  shadow = 'sm',
  onPress,
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

  const getShadow = () => {
    if (shadow === 'none') return {};
    return theme.shadows[shadow];
  };

  const cardStyles: StyleProp<ViewStyle> = [
    {
      backgroundColor: theme.colors.surface,
      padding: getPadding(),
      borderRadius: getRadius(),
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...getShadow(),
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={cardStyles} activeOpacity={0.7} {...(rest as any)}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} {...rest}>
      {children}
    </View>
  );
};

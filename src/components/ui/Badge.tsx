import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Typography } from './Typography';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  icon,
  style,
}) => {
  const theme = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'primary': return { bg: `${theme.colors.primary}20`, text: theme.colors.primary };
      case 'secondary': return { bg: theme.colors.surfaceLight, text: theme.colors.textSecondary };
      case 'success': return { bg: `${theme.colors.accent}20`, text: theme.colors.accent };
      case 'warning': return { bg: `${theme.colors.warning}20`, text: theme.colors.warning };
      case 'danger': return { bg: `${theme.colors.danger}20`, text: theme.colors.danger };
      case 'info': return { bg: `${theme.colors.cyan}20`, text: theme.colors.cyan };
      default: return { bg: `${theme.colors.primary}20`, text: theme.colors.primary };
    }
  };

  const colors = getColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }, style]}>
      {!!icon && <View style={styles.iconContainer}>{icon}</View>}
      <Typography variant="caption" weight="medium" color={colors.text}>
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
});

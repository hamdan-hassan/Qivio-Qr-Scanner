import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../../theme';

export type TypographyVariant = 
  | 'display'
  | 'heading'
  | 'title'
  | 'subtitle'
  | 'bodyLg'
  | 'body'
  | 'caption';

export interface CustomTypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<CustomTypographyProps> = ({
  variant = 'body',
  color,
  weight,
  align = 'left',
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();

  // Determine styles based on variant
  const fontSize = theme.typography.size[variant];
  const lineHeight = theme.typography.lineHeight[variant];
  
  // Default weights based on variant if not explicitly provided
  let defaultWeight: 'regular' | 'medium' | 'semiBold' | 'bold' = 'regular';
  if (variant === 'display' || variant === 'heading') defaultWeight = 'bold';
  if (variant === 'title' || variant === 'subtitle') defaultWeight = 'semiBold';
  
  const finalWeight = weight || defaultWeight;
  const fontFamily = theme.typography.family[finalWeight];

  return (
    <Text
      style={[
        {
          fontSize,
          lineHeight,
          fontFamily,
          color: color || theme.colors.text,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

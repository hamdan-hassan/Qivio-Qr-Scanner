import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../../theme';
import { TypographyVariant } from './Typography';

export interface AnimatedCounterProps {
  value: number;
  variant?: TypographyVariant;
  color?: string;
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  variant = 'title',
  color,
  weight = 'bold',
  prefix = '',
  suffix = '',
  duration = 1000,
}) => {
  const theme = useTheme();
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = currentValue;
    const endValue = value;
    const change = endValue - startValue;
    
    if (change === 0) return;

    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percent = Math.min(progress / duration, 1);
      
      // Easing function (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - percent, 4);
      
      setCurrentValue(Math.round(startValue + change * easeProgress));

      if (percent < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  const fontSize = theme.typography.size[variant];
  const fontFamily = theme.typography.family[weight];

  return (
    <Text
      style={[
        styles.text,
        {
          fontSize,
          fontFamily,
          color: color || theme.colors.text,
        },
      ]}
    >
      {prefix}{currentValue}{suffix}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    padding: 0,
    margin: 0,
  },
});

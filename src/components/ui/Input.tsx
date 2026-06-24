import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TextInputProps, 
  StyleSheet, 
  StyleProp, 
  ViewStyle 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Typography } from './Typography';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation for border color
  const focusAnim = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
    if (onBlur) onBlur(e);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    const borderColor = error 
      ? theme.colors.danger 
      : isFocused 
        ? theme.colors.primary 
        : theme.colors.border;
        
    return {
      borderColor,
    };
  });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {!!label && (
        <Typography 
          variant="body" 
          weight="medium" 
          color={theme.colors.textSecondary}
          style={styles.label}
        >
          {label}
        </Typography>
      )}
      
      <Animated.View 
        style={[
          styles.inputContainer,
          { backgroundColor: theme.colors.surfaceLight },
          animatedContainerStyle
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            { 
              color: theme.colors.text,
              fontFamily: theme.typography.family.regular,
              fontSize: theme.typography.size.bodyLg,
            },
            style
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </Animated.View>

      {!!error && (
        <Typography 
          variant="caption" 
          color={theme.colors.danger}
          style={styles.error}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
  },
  error: {
    marginTop: 6,
  },
});

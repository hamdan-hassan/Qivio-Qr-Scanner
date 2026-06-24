import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { IconButton } from '../ui/IconButton';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.surfaceLight,
          borderColor: isFocused ? theme.colors.primary : theme.colors.border,
        }
      ]}
    >
      <Icon name="search-outline" size={20} color={theme.colors.textSecondary} style={styles.icon} />
      
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        style={[
          styles.input, 
          { 
            color: theme.colors.text,
            fontFamily: theme.typography.family.regular,
            fontSize: theme.typography.size.bodyLg,
          }
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {!!value && (
        <IconButton 
          icon={<Icon name="close-circle" size={20} color={theme.colors.textSecondary} />}
          onPress={() => onChangeText('')}
          variant="ghost"
          size={32}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 8,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../theme';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
        <Icon name={icon} size={64} color={theme.colors.primary} />
      </View>
      
      <Typography variant="title" weight="bold" style={styles.title} align="center">
        {title}
      </Typography>
      
      <Typography 
        variant="bodyLg" 
        color={theme.colors.textSecondary} 
        style={styles.description}
        align="center"
      >
        {description}
      </Typography>
      
      {!!actionLabel && !!onAction && (
        <Button 
          title={actionLabel} 
          onPress={onAction} 
          variant="primary"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 300,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 32,
    lineHeight: 24,
  },
  actionButton: {
    minWidth: 160,
  },
});

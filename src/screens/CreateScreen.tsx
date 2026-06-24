import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, Card } from '../components/ui';

const generateOptions = [
  { id: 'url', title: 'Website URL', icon: 'link', color: '#6366F1', description: 'Link to a website or page', route: 'Generator', params: { type: 'url' } },
  { id: 'text', title: 'Plain Text', icon: 'document-text', color: '#8B5CF6', description: 'Any custom text message', route: 'Generator', params: { type: 'text' } },
  { id: 'wifi', title: 'WiFi Network', icon: 'wifi', color: '#10B981', description: 'Connect to WiFi without password', route: 'WifiBuilder' },
  { id: 'contact', title: 'Contact (vCard)', icon: 'id-card', color: '#F59E0B', description: 'Share your contact details', route: 'BusinessCard' },
  { id: 'email', title: 'Email Address', icon: 'mail', color: '#F43F5E', description: 'Pre-filled email message', route: 'Generator', params: { type: 'email' } },
  { id: 'phone', title: 'Phone Number', icon: 'call', color: '#06B6D4', description: 'Call or send SMS', route: 'Generator', params: { type: 'phone' } },
];

export const CreateScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
        <Typography variant="heading" weight="bold" style={styles.title}>
          Create
        </Typography>
        <Typography variant="bodyLg" color={theme.colors.textSecondary} style={styles.subtitle}>
          What would you like to generate today?
        </Typography>

        <View style={styles.grid}>
          {generateOptions.map((option) => (
            <Card 
              key={option.id} 
              padding="md" 
              style={styles.card}
              onPress={() => {
                if (option.params) {
                  navigation.navigate(option.route, option.params);
                } else {
                  navigation.navigate(option.route);
                }
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${option.color}20` }]}>
                <Icon name={option.icon} size={28} color={option.color} />
              </View>
              <Typography variant="bodyLg" weight="semiBold" style={{ marginTop: 12 }}>
                {option.title}
              </Typography>
              <Typography variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
                {option.description}
              </Typography>
            </Card>
          ))}
        </View>
        
        <View style={{ height: 100 }} />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginTop: 16,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

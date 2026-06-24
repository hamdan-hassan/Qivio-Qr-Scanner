import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, Card, IconButton } from '../components/ui';



const CATEGORIES = ['Business', 'Restaurant', 'Events', 'Social', 'Personal'];

const TEMPLATES = [
  { id: '1', category: 'Business', title: 'Company Portfolio', description: 'Link to your company website', type: 'url', icon: 'briefcase', color: '#6366F1' },
  { id: '2', category: 'Business', title: 'Digital Business Card', description: 'Share your contact details', type: 'contact', icon: 'id-card', color: '#8B5CF6' },
  { id: '3', category: 'Restaurant', title: 'Digital Menu', description: 'Link to your PDF or online menu', type: 'url', icon: 'restaurant', color: '#F43F5E' },
  { id: '4', category: 'Restaurant', title: 'Guest WiFi', description: 'Let customers connect easily', type: 'wifi', icon: 'wifi', color: '#10B981' },
  { id: '5', category: 'Events', title: 'Event Details', description: 'Share time and location', type: 'text', icon: 'calendar', color: '#F59E0B' },
  { id: '6', category: 'Events', title: 'RSVP Link', description: 'Direct guests to your form', type: 'url', icon: 'mail-open', color: '#06B6D4' },
  { id: '7', category: 'Social', title: 'Instagram Profile', description: 'Gain more followers', type: 'url', icon: 'logo-instagram', color: '#EC4899' },
  { id: '8', category: 'Social', title: 'Linktree / Bio', description: 'All your links in one place', type: 'url', icon: 'share-social', color: '#8B5CF6' },
  { id: '9', category: 'Personal', title: 'Personal Contact', description: 'Share your phone and email', type: 'contact', icon: 'person', color: '#10B981' },
  { id: '10', category: 'Personal', title: 'Message Me', description: 'Pre-filled SMS or WhatsApp', type: 'phone', icon: 'chatbubble', color: '#6366F1' },
];

export const TemplatesScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const [activeCategory, setActiveCategory] = useState(0);

  const filteredTemplates = TEMPLATES.filter(t => t.category === CATEGORIES[activeCategory]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'bottom', 'left']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <IconButton 
          icon={<Icon name="arrow-back" size={24} color={theme.colors.text} />} 
          onPress={() => navigation.goBack()} 
        />
        <Typography variant="subtitle" weight="semiBold">Templates</Typography>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.categoriesWrapper, { borderColor: theme.colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {CATEGORIES.map((cat, index) => {
            const isActive = activeCategory === index;
            return (
              <TouchableOpacity 
                key={cat} 
                style={[
                  styles.categoryPill, 
                  { 
                    backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceLight,
                    borderColor: isActive ? theme.colors.primary : theme.colors.border
                  }
                ]}
                onPress={() => setActiveCategory(index)}
              >
                <Typography variant="body" weight={isActive ? 'bold' : 'medium'} color={isActive ? '#FFF' : theme.colors.text}>
                  {cat}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            padding="md" 
            style={styles.templateCard}
            onPress={() => navigation.navigate(template.type === 'contact' ? 'BusinessCard' : template.type === 'wifi' ? 'WifiBuilder' : 'Generator', { type: template.type })}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${template.color}15` }]}>
              <Icon name={template.icon} size={28} color={template.color} />
            </View>
            <View style={styles.textContent}>
              <Typography variant="bodyLg" weight="semiBold">{template.title}</Typography>
              <Typography variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
                {template.description}
              </Typography>
            </View>
            <Icon name="chevron-forward" size={20} color={theme.colors.border} />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  categoriesWrapper: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
});

import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, Card, SegmentedControl } from '../components/ui';
import { useSettingsStore } from '../store/useSettingsStore';
import { useHistoryStore } from '../store';

const SETTING_ITEM_HEIGHT = 56;

// ... Section, SettingRow, Divider unchanged ...

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <Typography variant="caption" weight="bold" color={theme.colors.primary} style={styles.sectionTitle}>
        {title.toUpperCase()}
      </Typography>
      <Card padding="none" style={styles.sectionCard}>
        {children}
      </Card>
    </View>
  );
};

const SettingRow = ({ icon, title, value, onPress, isDestructive = false, showChevron = true, children }: any) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      style={styles.settingRow} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconBox, { backgroundColor: isDestructive ? `${theme.colors.danger}15` : theme.colors.surfaceLight }]}>
          <Icon name={icon} size={20} color={isDestructive ? theme.colors.danger : theme.colors.textSecondary} />
        </View>
        <Typography variant="bodyLg" color={isDestructive ? theme.colors.danger : theme.colors.text}>
          {title}
        </Typography>
      </View>
      <View style={styles.settingRight}>
        {value ? <Typography variant="body" color={theme.colors.textSecondary} style={{ marginRight: 8 }}>{value}</Typography> : null}
        {children}
        {showChevron && onPress && <Icon name="chevron-forward" size={20} color={theme.colors.border} />}
      </View>
    </TouchableOpacity>
  );
};

const Divider = () => {
  const theme = useTheme();
  return <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />;
};

export const SettingsScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  
  const { theme: currentTheme, setTheme, clearAllSettings } = useSettingsStore();
  const { clearHistory } = useHistoryStore();

  const handleChangeTheme = (idx: number) => {
    setTheme(idx === 0 ? 'light' : idx === 1 ? 'dark' : 'system');
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all scanned and generated QR codes? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          clearHistory();
          Alert.alert('History Cleared', 'Your scan and generation history has been deleted.');
        }},
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete EVERYTHING: history, collections, settings, and achievements. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Everything', style: 'destructive', onPress: () => {
          clearHistory();
          clearAllSettings();
          Alert.alert('Data Cleared', 'All app data has been reset to defaults.');
        }},
      ]
    );
  };

  const openLink = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'right', 'left']}>
      <View style={styles.header}>
        <Typography variant="heading" weight="bold">Settings</Typography>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        
        <Section title="Appearance">
          <View style={[styles.settingRow, { height: 'auto', paddingVertical: 16 }]}>
            <View style={{ flex: 1 }}>
              <Typography variant="bodyLg" style={{ marginBottom: 12 }}>Theme</Typography>
              <SegmentedControl 
                tabs={['Light', 'Dark', 'System']} 
                selectedIndex={currentTheme === 'light' ? 0 : currentTheme === 'dark' ? 1 : 2}
                onChange={handleChangeTheme}
              />
            </View>
          </View>
        </Section>

        <Section title="Privacy & Data">
          <SettingRow 
            icon="trash-bin-outline" 
            title="Clear Scan History" 
            isDestructive 
            onPress={handleClearHistory} 
          />
          <Divider />
          <SettingRow 
            icon="warning-outline" 
            title="Reset All Data" 
            isDestructive 
            onPress={handleClearAllData} 
          />
        </Section>

        <Section title="About">
          <SettingRow icon="information-circle-outline" title="Version" value="1.0.0" showChevron={false} />
          <Divider />
          <SettingRow icon="star-outline" title="Rate App" onPress={() => openLink(Platform.OS === 'ios' ? 'https://apps.apple.com/app/idYOUR_APP_ID' : 'https://play.google.com/store/apps/details?id=com.qivio')} />
          <Divider />
          <SettingRow icon="mail-outline" title="Contact Support" onPress={() => openLink('mailto:hassanmohammad922@gmail.com')} />
        </Section>

        <View style={styles.footer}>
          <Typography variant="caption" color={theme.colors.textSecondary} align="center">
            Qivio © 2026
          </Typography>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionCard: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: SETTING_ITEM_HEIGHT,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  divider: {
    height: 1,
    marginLeft: 64, // Align with text
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
});

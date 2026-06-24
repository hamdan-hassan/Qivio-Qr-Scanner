import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme';
import { Typography, AnimatedCounter } from '../components/ui';
import { useHistoryStore } from '../store';
import { BannerAd } from '../components/ads/BannerAd';

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { getScans, getGenerations, items } = useHistoryStore();
  
  const totalScans = items.filter(i => i.type === 'scan').length;
  const totalGenerated = items.filter(i => i.type === 'generate').length;
  
  const recentHistory = [...getScans(), ...getGenerations()]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const quickActions = [
    { title: 'Scan QR', icon: 'scan', route: 'Scanner', colors: theme.gradients.primary },
    { title: 'Generate QR', icon: 'qr-code', route: 'Create', colors: theme.gradients.accent },
    { title: 'Business Card', icon: 'id-card', route: 'BusinessCard', colors: theme.gradients.ocean },
    { title: 'WiFi Builder', icon: 'wifi', route: 'WifiBuilder', colors: theme.gradients.neon },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'left']}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top + 16, 24) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View />
          <TouchableOpacity 
            style={[styles.notificationBtn, { backgroundColor: theme.colors.surface }]} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="settings-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.statCardWrapper} onPress={() => navigation.navigate('History')}>
            <LinearGradient
              colors={theme.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconWrapper}>
                <Icon name="scan-outline" size={24} color="#FFF" />
              </View>
              <View style={styles.statTextWrapper}>
                <AnimatedCounter value={totalScans} variant="display" color="#FFF" weight="bold" />
                <Typography variant="body" color="rgba(255,255,255,0.8)" weight="medium">Scans</Typography>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity activeOpacity={0.8} style={styles.statCardWrapper} onPress={() => navigation.navigate('History')}>
            <LinearGradient
              colors={theme.gradients.accent}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <View style={styles.statIconWrapper}>
                <Icon name="qr-code-outline" size={24} color="#FFF" />
              </View>
              <View style={styles.statTextWrapper}>
                <AnimatedCounter value={totalGenerated} variant="display" color="#FFF" weight="bold" />
                <Typography variant="body" color="rgba(255,255,255,0.8)" weight="medium">Generated</Typography>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Typography variant="title" weight="bold">Quick Actions</Typography>
        </View>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(action.route)}
            >
              <LinearGradient
                colors={action.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionIconContainer}
              >
                <Icon name={action.icon} size={28} color="#FFF" />
              </LinearGradient>
              <Typography variant="caption" weight="semiBold" style={styles.actionTitle} align="center">
                {action.title}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Typography variant="title" weight="bold">Recent Activity</Typography>
          <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.seeAllBtn}>
            <Typography variant="body" color={theme.colors.primary} weight="semiBold">See All</Typography>
          </TouchableOpacity>
        </View>
        
        <View style={styles.historyContainer}>
          {recentHistory.length > 0 ? (
            recentHistory.map((item) => {
              const isScan = item.type === 'scan';
              const iconColor = isScan ? theme.colors.primary : theme.colors.accent;
              const bgColor = isScan ? `${theme.colors.primary}15` : `${theme.colors.accent}15`;
              
              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={[styles.historyCard, { backgroundColor: theme.colors.surface }]} 
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('ScanResult', { data: item.data, type: item.qrType })}
                >
                  <View style={[styles.historyIcon, { backgroundColor: bgColor }]}>
                    <Icon name={isScan ? 'scan' : 'qr-code'} size={22} color={iconColor} />
                  </View>
                  <View style={styles.historyContent}>
                    <Typography variant="bodyLg" weight="semiBold" numberOfLines={1}>
                      {item.title || item.data}
                    </Typography>
                    <Typography variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
                      {item.qrType.toUpperCase()}  •  {new Date(item.timestamp).toLocaleDateString()}
                    </Typography>
                  </View>
                  <View style={styles.chevron}>
                    <Icon name="chevron-forward" size={20} color={theme.colors.border} />
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIconWrapper, { backgroundColor: theme.colors.surface }]}>
                <Icon name="planet-outline" size={48} color={theme.colors.border} />
              </View>
              <Typography variant="bodyLg" weight="semiBold" color={theme.colors.text} style={{ marginTop: 16 }}>
                It's quiet here...
              </Typography>
              <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: 8 }} align="center">
                Scan or generate your first QR code to see activity.
              </Typography>
            </View>
          )}
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
      <BannerAd />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 16,
  },
  statCardWrapper: {
    flex: 1,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  statCard: {
    borderRadius: 24,
    padding: 20,
    height: 140,
    justifyContent: 'space-between',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextWrapper: {
    gap: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  seeAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 12,
  },
  historyContainer: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
  },
  chevron: {
    marginLeft: 8,
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
});

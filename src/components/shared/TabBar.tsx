import React from 'react';
import { View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../../theme';
import { Typography } from '../ui/Typography';

export const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabWidth = width / state.routes.length;

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(state.index * tabWidth + tabWidth / 2 - 20, { damping: 20, stiffness: 200 }) }
      ],
    };
  });

  const getIconName = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'Home': return isFocused ? 'home' : 'home-outline';
      case 'Scanner': return isFocused ? 'scan' : 'scan-outline';
      case 'Studio': return isFocused ? 'grid' : 'grid-outline';
      case 'Settings': return isFocused ? 'settings' : 'settings-outline';
      default: return 'help';
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'Home': return 'Home';
      case 'Scanner': return 'Scan';
      case 'Studio': return 'Studio';
      case 'Settings': return 'Settings';
      default: return '';
    }
  };

  const renderBackground = () => {
    if (theme.isDark) {
      return (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={20}
        />
      );
    }
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.surface }]} />;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 16 }]}>
      {renderBackground()}
      
      {/* Top Border */}
      <View style={[styles.topBorder, { backgroundColor: theme.colors.border }]} />
      
      {/* Active Indicator */}
      <Animated.View 
        style={[
          styles.indicator, 
          { backgroundColor: theme.colors.primary, top: 0 },
          animatedIndicatorStyle
        ]} 
      />

      <View style={styles.tabsRow}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === 'Create') {
            return (
              <TouchableOpacity
                key={route.key}
                activeOpacity={0.8}
                onPress={onPress}
                style={styles.fabContainer}
              >
                <LinearGradient
                  colors={theme.gradients.primary}
                  style={[styles.fab, theme.shadows.glow(theme.colors.primary)]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="add" size={32} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.6}
              onPress={onPress}
              style={styles.tab}
            >
              <Icon 
                name={getIconName(route.name, isFocused)} 
                size={24} 
                color={isFocused ? theme.colors.primary : theme.colors.textSecondary} 
                style={{ marginBottom: 4 }}
              />
              <Typography 
                variant="caption" 
                weight={isFocused ? 'medium' : 'regular'}
                color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
              >
                {getLabel(route.name)}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  topBorder: {
    height: 1,
    width: '100%',
    opacity: 0.5,
  },
  indicator: {
    position: 'absolute',
    width: 40,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    zIndex: 10,
  },
  tabsRow: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30, // Make it float above the bar
  },
});

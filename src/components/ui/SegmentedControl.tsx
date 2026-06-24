import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../theme';
import { Typography } from './Typography';

export interface SegmentedControlProps {
  tabs: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  tabs,
  selectedIndex,
  onChange,
}) => {
  const theme = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  const tabWidth = containerWidth / tabs.length;

  useEffect(() => {
    if (tabWidth > 0) {
      translateX.value = withSpring(selectedIndex * tabWidth, {
        damping: 20,
        stiffness: 150,
      });
    }
  }, [selectedIndex, tabWidth, translateX]);

  const onLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: tabWidth,
    };
  });

  return (
    <View 
      style={[styles.container, { backgroundColor: theme.colors.surfaceLight }]} 
      onLayout={onLayout}
    >
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: theme.colors.surface, ...theme.shadows.sm },
            indicatorStyle,
          ]}
        />
      )}
      {tabs.map((tab, index) => {
        const isActive = selectedIndex === index;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => onChange(index)}
            activeOpacity={0.7}
          >
            <Typography
              variant="body"
              weight={isActive ? 'semiBold' : 'medium'}
              color={isActive ? theme.colors.text : theme.colors.textSecondary}
            >
              {tab}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    padding: 2,
    position: 'relative',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    top: 2,
    left: 2,
    borderRadius: 6,
    zIndex: 0,
  },
});

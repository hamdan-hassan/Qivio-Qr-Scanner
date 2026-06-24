import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { useTheme } from '../../theme';

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
}

export interface BottomSheetProps {
  children: React.ReactNode;
  height?: number;
  onClose?: () => void;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, height, onClose }, ref) => {
    const { height: SCREEN_HEIGHT } = useWindowDimensions();
    const sheetHeight = height || SCREEN_HEIGHT * 0.6;
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    
    const translateY = useSharedValue(sheetHeight);
    const opacity = useSharedValue(0);

    const open = () => {
      setVisible(true);
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    };

    const close = () => {
      translateY.value = withSpring(sheetHeight, { damping: 20, stiffness: 200 });
      opacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setVisible)(false);
        if (onClose) runOnJS(onClose)();
      });
    };

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    const onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
      if (event.nativeEvent.translationY > 0) {
        translateY.value = event.nativeEvent.translationY;
      }
    };

    const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
      if (event.nativeEvent.state === 5) { // State.END
        if (event.nativeEvent.translationY > sheetHeight / 3 || event.nativeEvent.velocityY > 1000) {
          close();
        } else {
          translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
        }
      }
    };

    const animatedSheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const animatedBackdropStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    if (!visible) return null;

    return (
      <Modal transparent visible={visible} animationType="none" onRequestClose={close}>
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
        </TouchableWithoutFeedback>
        
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
          <Animated.View 
            style={[
              styles.sheet, 
              { 
                height: sheetHeight, backgroundColor: theme.colors.surface,
                paddingBottom: theme.spacing.xl,
              }, 
              animatedSheetStyle
            ]}
          >
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
            </View>
            <View style={styles.content}>
              {children}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

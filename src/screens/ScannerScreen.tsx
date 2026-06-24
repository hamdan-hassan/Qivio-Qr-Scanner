import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useBarcodeScannerOutput } from 'react-native-vision-camera-barcode-scanner';
import { launchImageLibrary } from 'react-native-image-picker';
import RNQRGenerator from 'rn-qr-generator';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, IconButton, Button } from '../components/ui';
import { useHistoryStore } from '../store';
import { useInterstitialAd } from '../features/ads/useInterstitialAd';

export const ScannerScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  const { showAdIfReady } = useInterstitialAd();

  const [torchEnabled, setTorchEnabled] = useState(false);

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  
  const { addItem } = useHistoryStore();

  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Turn off torch when leaving screen
  useEffect(() => {
    if (!isFocused) {
      setTorchEnabled(false);
    }
  }, [isFocused]);

  const output = useBarcodeScannerOutput({
    barcodeFormats: ['qr-code', 'ean-13', 'ean-8', 'upc-e', 'upc-a', 'code-128'],
    onError: (error) => console.error(error),
    onBarcodeScanned: (codes) => {
      if (scanned || codes.length === 0) return;
      
      const code = codes[0];
      if (!code.rawValue) return;
      
      setScanned(true);
      
      // Save to history
      addItem({
        type: 'scan',
        qrType: code.format,
        data: code.rawValue,
      });
      
      // Navigate to result and show ad if ready
      showAdIfReady();
      navigation.navigate('ScanResult', { data: code.rawValue, type: code.format });
      
      // Reset scan flag after navigation
      setTimeout(() => setScanned(false), 2000);
    }
  });

  const handleGalleryScan = async () => {
    try {
      // Turn off torch before opening gallery
      setTorchEnabled(false);
      const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
      
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (!uri) return;
        
        const response = await RNQRGenerator.detect({ uri });
        if (response.values && response.values.length > 0) {
          const value = response.values[0];
          
          addItem({
            type: 'scan',
            qrType: 'qr-code',
            data: value,
          });
          
          showAdIfReady();
          navigation.navigate('ScanResult', { data: value, type: 'qr-code' });
        } else {
          Alert.alert('No QR Code Found', 'We could not detect any QR code or barcode in the selected image.');
        }
      }
    } catch (error) {
      console.error('Gallery scan error:', error);
      Alert.alert('Error', 'Failed to process the image.');
    }
  };

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Icon name="camera-outline" size={64} color={theme.colors.textSecondary} />
        <Typography variant="heading" weight="bold" style={{ marginTop: 24, marginBottom: 8 }}>
          Camera Access Required
        </Typography>
        <Typography variant="body" color={theme.colors.textSecondary} align="center" style={{ paddingHorizontal: 40, marginBottom: 32 }}>
          Qivio needs access to your camera to scan QR codes and barcodes.
        </Typography>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Typography variant="body">No camera device found</Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          outputs={[output]}
          torchMode={torchEnabled && device.hasTorch ? 'on' : 'off'}
          enableNativeZoomGesture={true}
        />
      )}
      
      {/* Dark overlay with cutout */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={[styles.focusedContainer, { width: width * 0.7, height: width * 0.7 }]}>
            {/* Corner brackets */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
        <View style={styles.unfocusedContainer} />
      </View>

      {/* Controls */}
      <View style={[styles.topControls, { top: Math.max(insets.top, 20) }]}>
        <Typography variant="subtitle" weight="semiBold" color="#FFF">
          Scan Code
        </Typography>
      </View>
      
      <View style={styles.bottomControls}>
        <IconButton 
          icon={<Icon name="image-outline" size={24} color="#FFF" />} 
          onPress={handleGalleryScan}
          variant="surface"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
        {device.hasTorch && (
          <IconButton 
            icon={<Icon name={torchEnabled ? "flash" : "flash-off"} size={24} color="#FFF" />} 
            onPress={() => setTorchEnabled(!torchEnabled)}
            variant="surface"
            style={{ backgroundColor: torchEnabled ? theme.colors.primary : 'rgba(0,0,0,0.5)' }}
          />
        )}
        <IconButton 
          icon={<Icon name="close" size={24} color="#FFF" />} 
          onPress={() => navigation.navigate('Home')}
          variant="surface"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
      </View>
    </View>
  );
};

const overlayColor = 'rgba(0,0,0,0.6)'; // darken the background

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  middleContainer: {
    flexDirection: 'row',
  },
  focusedContainer: {
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFF', // Or primary color
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  topControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 120, // Above tab bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 40,
  },
});

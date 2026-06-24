import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCodeStyled from '../components/QRCodeStyled';
import { captureRef } from 'react-native-view-shot';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTheme } from '../theme';
import { Typography, Button, IconButton, Card } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useExport } from '../features/export/useExport';
import { useInterstitialAd } from '../features/ads/useInterstitialAd';

type DesignerRouteProp = RouteProp<RootStackParamList, 'Designer'>;

export const DesignerScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<DesignerRouteProp>();
  const { data } = route.params as any;
  const insets = useSafeAreaInsets();
  
  const viewRef = useRef<View>(null);
  const { exportAsPDF, shareImage } = useExport();
  const { showAdIfReady } = useInterstitialAd();

  const [qrColor, setQrColor] = useState('#000000');
  const [qrLogo, setQrLogo] = useState<string | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let rafId: number;
    const timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(() => {
        setIsReady(true);
      });
    }, 150);
    
    return () => {
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleStateChange = (setter: any, value: any) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      requestAnimationFrame(() => {
        setter(value);
        setIsProcessing(false);
      });
    }, 50);
  };

  const handlePickLogo = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    if (result.assets && result.assets.length > 0) {
      handleStateChange(setQrLogo, result.assets[0].uri || null);
    }
  };

  const handleExportPDF = async () => {
    if (viewRef.current) {
      try {
        const base64 = await captureRef(viewRef, { format: 'png', quality: 1, result: 'base64' });
        showAdIfReady();
        await exportAsPDF(base64, 'Qivio QR Code');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSavePDF = async () => {
    if (viewRef.current) {
      try {
        const base64 = await captureRef(viewRef, { format: 'png', quality: 1, result: 'base64' });
        showAdIfReady();
        await exportAsPDF(base64, 'Qivio QR Code', 'save');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleShareImage = async () => {
    if (viewRef.current) {
      try {
        const base64 = await captureRef(viewRef, { format: 'png', quality: 1, result: 'base64' });
        showAdIfReady();
        await shareImage(base64);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'bottom', 'left']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <IconButton 
          icon={<Icon name="arrow-back" size={24} color={theme.colors.text} />} 
          onPress={() => navigation.goBack()} 
        />
        <Typography variant="subtitle" weight="semiBold">Designer</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card padding="lg" style={styles.previewCard}>
          <View ref={viewRef} collapsable={false} style={{ padding: 16, backgroundColor: '#FFFFFF' }}>
            {(!isReady || isProcessing) ? (
              <View style={{ width: 200, height: 200, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : (
              <QRCodeStyled
                data={data || 'https://qivio.app'}
                size={200}
                color={qrColor}
                logo={qrLogo ? { href: { uri: qrLogo }, hidePieces: true, padding: 4 } : undefined}
              />
            )}
          </View>
        </Card>

        <View style={styles.customizationSection}>
          <Typography variant="body" weight="semiBold" style={{ marginBottom: 8 }}>Foreground Color</Typography>
          <View style={styles.colorButtons}>
            {['#000000', '#2563EB', '#DC2626', '#16A34A', '#D97706'].map(colorHex => (
              <TouchableOpacity 
                key={colorHex} 
                style={[styles.colorSwatch, { backgroundColor: colorHex, borderWidth: qrColor === colorHex ? 2 : 0, borderColor: theme.colors.primary }]} 
                onPress={() => handleStateChange(setQrColor, colorHex)}
              />
            ))}
          </View>

          <Typography variant="body" weight="semiBold" style={{ marginTop: 16, marginBottom: 8 }}>Logo</Typography>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button 
              title={qrLogo ? 'Change Logo' : 'Select Logo'} 
              variant="secondary" 
              onPress={handlePickLogo} 
              icon={<Icon name="image-outline" size={20} color={theme.colors.primary} />} 
              style={{ flex: 1 }}
            />
            {qrLogo && (
              <Button 
                title="Remove" 
                variant="secondary" 
                onPress={() => handleStateChange(setQrLogo, null)} 
                icon={<Icon name="trash-outline" size={20} color={theme.colors.danger} />} 
              />
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Button 
            title="Export as PDF" 
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleExportPDF}
            icon={<Icon name="document-text-outline" size={20} color="#FFF" />}
            style={{ marginBottom: 16 }}
          />

          <Button 
            title="Save PDF" 
            variant="secondary"
            size="lg"
            fullWidth
            onPress={handleSavePDF}
            icon={<Icon name="download-outline" size={20} color={theme.colors.primary} />}
            style={{ marginBottom: 16 }}
          />
          
          <Button 
            title="Share Image" 
            variant="secondary"
            size="lg"
            fullWidth
            onPress={handleShareImage}
            icon={<Icon name="share-outline" size={20} color={theme.colors.text} />}
          />
        </View>
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
  content: {
    padding: 24,
  },
  previewCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  customizationSection: {
    marginBottom: 24,
  },
  colorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  actionsContainer: {
    marginTop: 8,
  },
});

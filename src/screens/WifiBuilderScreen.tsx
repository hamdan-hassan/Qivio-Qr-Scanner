import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, Input, Button, IconButton, Card, SegmentedControl } from '../components/ui';

export const WifiBuilderScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState(0); // 0: WPA/WPA2, 1: WEP, 2: None
  const encryptionOptions = ['WPA/WPA2', 'WEP', 'None'];

  const [isHidden, setIsHidden] = useState(false);

  const qrData = React.useMemo(() => {
    const encType = encryption === 0 ? 'WPA' : encryption === 1 ? 'WEP' : 'nopass';
    const hiddenStr = isHidden ? 'true' : 'false';
    return `WIFI:T:${encType};S:${ssid};P:${password};H:${hiddenStr};;`;
  }, [ssid, password, encryption, isHidden]);

  const isValid = ssid.trim().length > 0 && (encryption === 2 || password.length > 0);

  const handleCreate = () => {
    navigation.navigate('Designer', { data: qrData });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'bottom', 'left']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
          <IconButton 
            icon={<Icon name="arrow-back" size={24} color={theme.colors.text} />} 
            onPress={() => navigation.goBack()} 
          />
          <Typography variant="subtitle" weight="semiBold">WiFi Builder</Typography>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Card padding="lg" style={[styles.previewCard, { borderColor: theme.colors.border }]} shadow="none">
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.accent}15` }]}>
              <Icon name="wifi" size={48} color={theme.colors.accent} />
            </View>
            <Typography variant="heading" weight="bold" style={{ marginTop: 16 }}>
              {ssid || 'Network Name'}
            </Typography>
            <Typography variant="body" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
              {encryption === 2 ? 'Open Network' : `Secured with ${encryptionOptions[encryption]}`}
            </Typography>
            {encryption !== 2 && (
              <View style={[styles.passwordPill, { backgroundColor: theme.colors.surfaceLight }]}>
                <Icon name="lock-closed" size={14} color={theme.colors.textSecondary} />
                <Typography variant="caption" color={theme.colors.textSecondary} style={{ marginLeft: 6 }}>
                  {password ? '••••••••' : 'Password Required'}
                </Typography>
              </View>
            )}
          </Card>

          <View style={styles.formContainer}>
            <Input 
              label="Network Name (SSID)" 
              placeholder="e.g. Home_Network" 
              value={ssid} 
              onChangeText={setSsid}
              leftIcon={<Icon name="wifi" size={20} color={theme.colors.textSecondary} />}
            />
            
            <View style={{ marginBottom: 16 }}>
              <Typography variant="body" weight="medium" color={theme.colors.textSecondary} style={{ marginBottom: 8 }}>
                Security Type
              </Typography>
              <SegmentedControl 
                tabs={encryptionOptions} 
                selectedIndex={encryption} 
                onChange={setEncryption} 
              />
            </View>
            
            {encryption !== 2 && (
              <Input 
                label="Password" 
                placeholder="Network password" 
                value={password} 
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Icon name="key" size={20} color={theme.colors.textSecondary} />}
              />
            )}

            <View style={styles.toggleRow}>
              <View style={{ flex: 1, marginRight: 16 }}>
                <Typography variant="bodyLg" weight="medium">Hidden Network</Typography>
                <Typography variant="caption" color={theme.colors.textSecondary}>
                  Check this if your network is not broadcasting its SSID
                </Typography>
              </View>
              <Button 
                title={isHidden ? 'Yes' : 'No'}
                variant={isHidden ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setIsHidden(!isHidden)}
              />
            </View>
          </View>

          <Button 
            title="Generate QR" 
            variant="gradient"
            size="lg"
            fullWidth
            disabled={!isValid}
            onPress={handleCreate}
            icon={<Icon name="qr-code-outline" size={20} color="#FFF" />}
            style={{ marginTop: 32 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 32,
    borderWidth: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  formContainer: {
    // Form spacing handled by Input component margins
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
});

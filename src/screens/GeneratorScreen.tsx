import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../theme';
import { Typography, Input, Button, IconButton, Card, SegmentedControl } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { useHistoryStore } from '../store';

type GeneratorRouteProp = RouteProp<RootStackParamList, 'Generator'>;

export const GeneratorScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<GeneratorRouteProp>();
  const { type } = route.params;
  const insets = useSafeAreaInsets();
  const { addItem } = useHistoryStore();

  // Form states
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  
  // WiFi
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState(0); // 0: WPA/WPA2, 1: WEP, 2: None
  const encryptionOptions = ['WPA/WPA2', 'WEP', 'None'];

  // Contact
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  const generateQRData = () => {
    switch (type) {
      case 'url':
        return url;
      case 'text':
        return text || ' ';
      case 'wifi':
        const encType = encryption === 0 ? 'WPA' : encryption === 1 ? 'WEP' : 'nopass';
        return `WIFI:T:${encType};S:${ssid};P:${password};;`;
      case 'contact':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${lastName};${firstName};;;\nFN:${firstName} ${lastName}\nTEL;TYPE=CELL:${phone}\nEMAIL:${email}\nEND:VCARD`;
      case 'email':
        return `mailto:${email}`;
      case 'phone':
        return `TEL:${phone}`;
      default:
        return ' ';
    }
  };

  const qrData = generateQRData();
  const isDataValid = qrData.length > 10; // Basic validation

  const handleCreate = () => {
    addItem({
      type: 'generate',
      qrType: type,
      data: qrData,
      title: getTitle(),
    });
    navigation.navigate('Designer', { data: qrData, type });
  };

  const renderForm = () => {
    switch (type) {
      case 'url':
        return (
          <Input 
            label="Website URL" 
            placeholder="https://example.com" 
            value={url} 
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
            leftIcon={<Icon name="link" size={20} color={theme.colors.textSecondary} />}
          />
        );
      case 'text':
        return (
          <Input 
            label="Message" 
            placeholder="Enter any text here" 
            value={text} 
            onChangeText={setText}
            multiline
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        );
      case 'wifi':
        return (
          <View>
            <Input 
              label="Network Name (SSID)" 
              placeholder="e.g. Home_Network" 
              value={ssid} 
              onChangeText={setSsid}
              leftIcon={<Icon name="wifi" size={20} color={theme.colors.textSecondary} />}
            />
            <View style={{ marginBottom: 16 }}>
              <Typography variant="body" weight="medium" color={theme.colors.textSecondary} style={{ marginBottom: 8 }}>
                Security
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
                leftIcon={<Icon name="lock-closed" size={20} color={theme.colors.textSecondary} />}
              />
            )}
          </View>
        );
      case 'contact':
        return (
          <View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Input 
                label="First Name" 
                placeholder="John" 
                value={firstName} 
                onChangeText={setFirstName}
                containerStyle={{ flex: 1 }}
              />
              <Input 
                label="Last Name" 
                placeholder="Doe" 
                value={lastName} 
                onChangeText={setLastName}
                containerStyle={{ flex: 1 }}
              />
            </View>
            <Input 
              label="Phone" 
              placeholder="+1 234 567 8900" 
              value={phone} 
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Icon name="call" size={20} color={theme.colors.textSecondary} />}
            />
            <Input 
              label="Email" 
              placeholder="john@example.com" 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Icon name="mail" size={20} color={theme.colors.textSecondary} />}
            />
          </View>
        );
      case 'email':
        return (
          <Input 
            label="Email Address" 
            placeholder="someone@example.com" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Icon name="mail" size={20} color={theme.colors.textSecondary} />}
          />
        );
      case 'phone':
        return (
          <Input 
            label="Phone Number" 
            placeholder="+1 234 567 8900" 
            value={phone} 
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={<Icon name="call" size={20} color={theme.colors.textSecondary} />}
          />
        );
      default:
        return <Typography>Unknown Type</Typography>;
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'url': return 'Website URL';
      case 'text': return 'Plain Text';
      case 'wifi': return 'WiFi Network';
      case 'contact': return 'Contact Card';
      case 'email': return 'Email Address';
      case 'phone': return 'Phone Number';
      default: return 'Generate QR';
    }
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
          <Typography variant="subtitle" weight="semiBold">{getTitle()}</Typography>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Card padding="lg" style={styles.previewCard}>
            <View style={styles.qrContainer}>
              {qrData.trim() ? (
                <QRCode
                  value={qrData}
                  size={180}
                  color={theme.colors.text}
                  backgroundColor="transparent"
                />
              ) : (
                <View style={[styles.placeholderQr, { borderColor: theme.colors.border }]}>
                  <Icon name="qr-code-outline" size={64} color={theme.colors.border} />
                </View>
              )}
            </View>
            <Typography variant="caption" color={theme.colors.textSecondary} align="center" style={{ marginTop: 16 }}>
              Live Preview
            </Typography>
          </Card>

          <View style={styles.formContainer}>
            {renderForm()}
          </View>

          <Button 
            title="Design & Export" 
            variant="gradient"
            size="lg"
            fullWidth
            disabled={!isDataValid}
            onPress={handleCreate}
            icon={<Icon name="color-palette-outline" size={20} color="#FFF" />}
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
  },
  qrContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderQr: {
    width: 180,
    height: 180,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    // Form styles handled by components
  },
});

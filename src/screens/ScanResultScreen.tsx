import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Linking, Share, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, Card, Button, IconButton } from '../components/ui';
import { RootStackParamList } from '../navigation/types';
import { parseVCard, ParsedVCard } from '../utils/vcardParser';
import { BannerAd } from '../components/ads/BannerAd';

type ScanResultRouteProp = RouteProp<RootStackParamList, 'ScanResult'>;

export const ScanResultScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<ScanResultRouteProp>();
  const { data, type } = route.params;
  const insets = useSafeAreaInsets();

  const parsedContent = useMemo(() => {
    // Simple parsing logic. In a real app, this would use a robust parser for vCard, WiFi, etc.
    let title = 'Text';
    let icon = 'document-text-outline';
    let color = theme.colors.primary;
    let action = { label: 'Copy Text', icon: 'copy-outline', onPress: () => {} }; // Default
    let vcard: ParsedVCard | null = null;
    
    if (data.startsWith('BEGIN:VCARD')) {
      title = 'Contact';
      icon = 'person-outline';
      color = theme.colors.primary;
      vcard = parseVCard(data);
      action = { 
        label: 'Call Contact', 
        icon: 'call-outline', 
        onPress: () => {
          if (vcard?.phone) {
            Linking.openURL(`tel:${vcard.phone}`).catch(() => Alert.alert('Notice', 'Could not open phone app'));
          } else {
            Alert.alert('Notice', 'No phone number available');
          }
        } 
      };
    } else if (data.startsWith('http://') || data.startsWith('https://')) {
      title = 'URL';
      icon = 'link-outline';
      color = theme.colors.cyan;
      action = { label: 'Open Link', icon: 'open-outline', onPress: () => Linking.openURL(data).catch(() => Alert.alert('Error', 'Could not open URL')) };
    } else if (data.startsWith('WIFI:')) {
      title = 'WiFi Network';
      icon = 'wifi-outline';
      color = theme.colors.warning;
      // WiFi join is complex on iOS/Android, might need a specific library. Placeholder action for now.
      action = { label: 'Copy Password', icon: 'key-outline', onPress: () => {} };
    } else if (data.startsWith('MATMSG:') || data.startsWith('mailto:')) {
      title = 'Email';
      icon = 'mail-outline';
      color = theme.colors.danger;
      action = { label: 'Send Email', icon: 'send-outline', onPress: () => Linking.openURL(data) };
    } else if (data.startsWith('TEL:')) {
      title = 'Phone Number';
      icon = 'call-outline';
      color = theme.colors.accent;
      action = { label: 'Call', icon: 'call-outline', onPress: () => Linking.openURL(data) };
    }

    return { title, icon, color, action, vcard };
  }, [data, theme]);

  const handleShare = async () => {
    try {
      let messageToShare = data;
      
      if (parsedContent.vcard) {
        const vc = parsedContent.vcard;
        const lines = ['Contact Details:'];
        if (vc.fullName) lines.push(`Name: ${vc.fullName}`);
        if (vc.title) lines.push(`Title: ${vc.title}`);
        if (vc.org) lines.push(`Company: ${vc.org}`);
        if (vc.phone) lines.push(`Phone: ${vc.phone}`);
        if (vc.email) lines.push(`Email: ${vc.email}`);
        if (vc.url) lines.push(`Website: ${vc.url}`);
        if (vc.address) lines.push(`Address: ${vc.address}`);
        messageToShare = lines.join('\n');
      } else if (data.startsWith('WIFI:')) {
        const ssidMatch = data.match(/S:(.*?);/);
        const passMatch = data.match(/P:(.*?);/);
        
        const lines = ['WiFi Network Details:'];
        if (ssidMatch && ssidMatch[1]) lines.push(`Network Name: ${ssidMatch[1]}`);
        if (passMatch && passMatch[1]) lines.push(`Password: ${passMatch[1]}`);
        messageToShare = lines.join('\n');
      } else if (data.startsWith('MATMSG:')) {
        const toMatch = data.match(/TO:(.*?);/);
        const subMatch = data.match(/SUB:(.*?);/);
        const bodyMatch = data.match(/BODY:(.*?);/);
        
        const lines = ['Email Details:'];
        if (toMatch && toMatch[1]) lines.push(`To: ${toMatch[1]}`);
        if (subMatch && subMatch[1]) lines.push(`Subject: ${subMatch[1]}`);
        if (bodyMatch && bodyMatch[1]) lines.push(`Body: ${bodyMatch[1]}`);
        messageToShare = lines.join('\n');
      }

      await Share.share({
        message: messageToShare,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'bottom', 'left']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <IconButton 
          icon={<Icon name="arrow-back" size={24} color={theme.colors.text} />} 
          onPress={() => navigation.goBack()} 
        />
        <Typography variant="subtitle" weight="semiBold">Scan Result</Typography>
        <IconButton 
          icon={<Icon name="share-outline" size={24} color={theme.colors.text} />} 
          onPress={handleShare} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: `${parsedContent.color}20` }]}>
            <Icon name={parsedContent.icon} size={48} color={parsedContent.color} />
          </View>
          <Typography variant="heading" weight="bold" style={{ marginTop: 16 }}>
            {parsedContent.title}
          </Typography>
          <Typography variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
            Format: {type.toUpperCase()}
          </Typography>
        </View>

        {parsedContent.vcard ? (
          <Card padding="none" style={[styles.dataCard, { overflow: 'hidden' }]}>
            <View style={{ padding: 24, backgroundColor: theme.colors.primary }}>
              <Typography variant="title" weight="bold" color="#FFF">
                {parsedContent.vcard.fullName || 'Contact Name'}
              </Typography>
              {(!!parsedContent.vcard.title || !!parsedContent.vcard.org) && (
                <Typography variant="body" color="rgba(255,255,255,0.8)" style={{ marginTop: 4 }}>
                  {parsedContent.vcard.title} {parsedContent.vcard.org ? `@ ${parsedContent.vcard.org}` : ''}
                </Typography>
              )}
            </View>
            <View style={{ padding: 24 }}>
              {!!parsedContent.vcard.phone && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Icon name="call" size={20} color={theme.colors.primary} />
                  <Typography variant="bodyLg" style={{ marginLeft: 16 }}>{parsedContent.vcard.phone}</Typography>
                </View>
              )}
              {!!parsedContent.vcard.email && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Icon name="mail" size={20} color={theme.colors.primary} />
                  <Typography variant="bodyLg" style={{ marginLeft: 16 }}>{parsedContent.vcard.email}</Typography>
                </View>
              )}
              {!!parsedContent.vcard.url && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <Icon name="globe" size={20} color={theme.colors.primary} />
                  <Typography variant="bodyLg" style={{ marginLeft: 16 }}>{parsedContent.vcard.url}</Typography>
                </View>
              )}
              {!!parsedContent.vcard.address && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Icon name="location" size={20} color={theme.colors.primary} />
                  <Typography variant="bodyLg" style={{ marginLeft: 16 }}>{parsedContent.vcard.address}</Typography>
                </View>
              )}
            </View>
          </Card>
        ) : (
          <Card padding="lg" style={styles.dataCard}>
            <ScrollView style={{ maxHeight: 200 }}>
              <Typography variant="bodyLg" style={{ lineHeight: 28 }}>
                {data}
              </Typography>
            </ScrollView>
          </Card>
        )}

        <View style={styles.actionsContainer}>
          <Button 
            title={parsedContent.action.label}
            icon={<Icon name={parsedContent.action.icon} size={20} color="#FFF" />}
            onPress={parsedContent.action.onPress}
            size="lg"
            variant="gradient"
            fullWidth
            style={{ marginBottom: 16 }}
          />
          
          <Button 
            title="Search Web"
            icon={<Icon name="search-outline" size={20} color={theme.colors.text} />}
            onPress={() => Linking.openURL(`https://google.com/search?q=${encodeURIComponent(data)}`)}
            variant="secondary"
            size="lg"
            fullWidth
          />
        </View>
      </ScrollView>
      <BannerAd />
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
  iconContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataCard: {
    marginBottom: 32,
  },
  actionsContainer: {
    marginTop: 'auto',
  },
});

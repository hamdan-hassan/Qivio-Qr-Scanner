import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, Input, Button, IconButton, Card } from '../components/ui';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid URL').or(z.literal('')).optional(),
  address: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const BusinessCardScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { control, handleSubmit, watch, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      position: '',
      phone: '',
      email: '',
      website: '',
      address: '',
    }
  });

  const formValues = watch();

  const qrData = useMemo(() => {
    const { firstName, lastName, company, position, phone, email, website, address } = formValues;
    let vcard = `BEGIN:VCARD\nVERSION:3.0\n`;
    if (lastName || firstName) vcard += `N:${lastName || ''};${firstName || ''};;;\n`;
    if (firstName || lastName) vcard += `FN:${firstName || ''} ${lastName || ''}\n`.trim() + '\n';
    if (company) vcard += `ORG:${company}\n`;
    if (position) vcard += `TITLE:${position}\n`;
    if (phone) vcard += `TEL;TYPE=CELL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (website) vcard += `URL:${website}\n`;
    if (address) vcard += `ADR:;;${address};;;;\n`;
    vcard += `END:VCARD`;
    return vcard;
  }, [formValues]);

  const handleCreate = () => {
    navigation.navigate('Designer', { data: qrData, type: 'contact' });
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
          <Typography variant="subtitle" weight="semiBold">Business Card</Typography>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Live Preview Card */}
          <Card padding="none" style={[styles.previewCard, { backgroundColor: theme.colors.surfaceLight }]}>
            <View style={[styles.previewHeader, { backgroundColor: theme.colors.primary }]}>
              <Typography variant="title" weight="bold" color="#FFF">
                {formValues.firstName || formValues.lastName ? `${formValues.firstName} ${formValues.lastName}` : 'Your Name'}
              </Typography>
              <Typography variant="body" color="rgba(255,255,255,0.8)" style={{ marginTop: 4 }}>
                {formValues.position || 'Job Title'} {formValues.company ? `@ ${formValues.company}` : ''}
              </Typography>
            </View>
            <View style={styles.previewBody}>
              <View style={styles.previewRow}>
                <Icon name="call" size={16} color={theme.colors.primary} />
                <Typography variant="body" color={theme.colors.textSecondary} style={styles.previewText} numberOfLines={1}>
                  {formValues.phone || '+1 234 567 8900'}
                </Typography>
              </View>
              <View style={styles.previewRow}>
                <Icon name="mail" size={16} color={theme.colors.primary} />
                <Typography variant="body" color={theme.colors.textSecondary} style={styles.previewText} numberOfLines={1}>
                  {formValues.email || 'email@example.com'}
                </Typography>
              </View>
              {(!!formValues.website || !!formValues.address) && (
                <View style={styles.previewRow}>
                  <Icon name="globe" size={16} color={theme.colors.primary} />
                  <Typography variant="body" color={theme.colors.textSecondary} style={styles.previewText} numberOfLines={1}>
                    {formValues.website || formValues.address}
                  </Typography>
                </View>
              )}
            </View>
          </Card>

          <View style={styles.formContainer}>
            <View style={styles.row}>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input 
                    label="First Name *"
                    placeholder="John"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.firstName?.message}
                    containerStyle={styles.flexHalf}
                  />
                )}
              />
              <View style={{ width: 16 }} />
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input 
                    label="Last Name *"
                    placeholder="Doe"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.lastName?.message}
                    containerStyle={styles.flexHalf}
                  />
                )}
              />
            </View>

            <View style={styles.row}>
              <Controller
                control={control}
                name="company"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input 
                    label="Company"
                    placeholder="Acme Corp"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.company?.message}
                    containerStyle={styles.flexHalf}
                  />
                )}
              />
              <View style={{ width: 16 }} />
              <Controller
                control={control}
                name="position"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input 
                    label="Position"
                    placeholder="CEO"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.position?.message}
                    containerStyle={styles.flexHalf}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                  label="Phone Number *"
                  placeholder="+1 234 567 8900"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.phone?.message}
                  leftIcon={<Icon name="call" size={20} color={theme.colors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                  label="Email Address *"
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Icon name="mail" size={20} color={theme.colors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="website"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                  label="Website"
                  placeholder="https://example.com"
                  keyboardType="url"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.website?.message}
                  leftIcon={<Icon name="globe" size={20} color={theme.colors.textSecondary} />}
                />
              )}
            />

            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                  label="Address"
                  placeholder="123 Main St, City"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.address?.message}
                  leftIcon={<Icon name="location" size={20} color={theme.colors.textSecondary} />}
                />
              )}
            />
          </View>

          <Button 
            title="Generate QR" 
            variant="gradient"
            size="lg"
            fullWidth
            disabled={!isValid}
            onPress={handleSubmit(handleCreate)}
            icon={<Icon name="qr-code-outline" size={20} color="#FFF" />}
            style={{ marginTop: 24 }}
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
    marginBottom: 32,
    overflow: 'hidden',
  },
  previewHeader: {
    padding: 24,
  },
  previewBody: {
    padding: 24,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewText: {
    marginLeft: 12,
    flex: 1,
  },
  formContainer: {
    // Spacer
  },
  row: {
    flexDirection: 'row',
  },
  flexHalf: {
    flex: 1,
  },
});

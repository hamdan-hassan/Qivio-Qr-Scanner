import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd as RNGBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// The Google Mobile Ads library provides TestIds.BANNER which we MUST use for development.
// You will replace this with your actual Ad Unit ID before publishing.
const adUnitId = __DEV__ ? TestIds.BANNER : (Platform.OS === 'ios' ? 'ca-app-pub-xxxxxxxx/yyyyyyyy' : 'ca-app-pub-4478899815710413/1782146641');

export const BannerAd = () => {
  return (
    <View style={styles.container}>
      <RNGBannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // Typically needed for GDPR compliance
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner Ad failed to load: ', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
});

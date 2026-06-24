import { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { storage } from '../../store/mmkvStorage';
const AD_COUNTER_KEY = 'ad_counter';
const SHOW_AD_EVERY_N_TIMES = 3;

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : (Platform.OS === 'ios' ? 'ca-app-pub-xxxxxxxx/yyyyyyyy' : 'ca-app-pub-4478899815710413/9368992620');

// Create a single instance to pre-load
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const useInterstitialAd = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoaded(false);
      // Pre-load the next ad
      interstitial.load();
    });

    // Start loading right away if not already loaded
    if (!loaded) {
      interstitial.load();
    }

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, [loaded]);

  const showAdIfReady = () => {
    // Increment counter
    const currentCount = storage.getNumber(AD_COUNTER_KEY) || 0;
    const nextCount = currentCount + 1;
    storage.set(AD_COUNTER_KEY, nextCount);

    if (nextCount % SHOW_AD_EVERY_N_TIMES === 0) {
      if (loaded) {
        interstitial.show();
      }
    }
  };

  return { showAdIfReady, loaded };
};

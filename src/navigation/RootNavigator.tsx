import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Navigators
import { TabNavigator } from './TabNavigator';

// Implemented Screens
import { ScanResultScreen } from '../screens/ScanResultScreen';
import { GeneratorScreen } from '../screens/GeneratorScreen';
import { DesignerScreen } from '../screens/DesignerScreen';
import { BusinessCardScreen } from '../screens/BusinessCardScreen';
import { WifiBuilderScreen } from '../screens/WifiBuilderScreen';
import { TemplatesScreen } from '../screens/TemplatesScreen';
import { HistoryScreen } from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ScanResult" component={ScanResultScreen} />
      <Stack.Screen name="Generator" component={GeneratorScreen} />
      <Stack.Screen name="Designer" component={DesignerScreen} />
      <Stack.Screen name="BusinessCard" component={BusinessCardScreen} />
      <Stack.Screen name="WifiBuilder" component={WifiBuilderScreen} />
      <Stack.Screen name="Templates" component={TemplatesScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
};

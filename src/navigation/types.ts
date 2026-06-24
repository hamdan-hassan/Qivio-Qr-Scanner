import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigatorScreenParams, CompositeScreenProps } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Scanner: undefined;
  Create: undefined;
  Studio: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  ScanResult: { data: string; type: string };
  Generator: { type: string };
  Designer: { data: string; currentStyle?: any };
  BusinessCard: undefined;
  WifiBuilder: undefined;
  Templates: undefined;
  History: undefined;
  Settings: undefined;
};

// Hook types for screens
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >;

// Global type for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

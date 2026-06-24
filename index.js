/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Suppress the known "Camera is not active" error from react-native-vision-camera's
// internal torch hook (useTorchModeUpdater) which calls setTorchMode without .catch()
// during camera startup/teardown transitions on Android.
LogBox.ignoreLogs([
  'Camera is not active',
  'There is a new enableTorch being set'
]);

const originalHandler = global.ErrorUtils?.getGlobalHandler();
if (global.ErrorUtils) {
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    const errorMsg = error?.message || '';
    if (!isFatal && (errorMsg.includes('Camera is not active') || errorMsg.includes('There is a new enableTorch being set'))) {
      return; // Suppress this non-fatal camera error
    }
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

AppRegistry.registerComponent(appName, () => App);

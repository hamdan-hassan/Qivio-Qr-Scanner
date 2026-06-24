import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

// Initialize MMKV instance
export const storage = createMMKV({
  id: 'qivio-storage',
  encryptionKey: 'qivio-secure-key' // Optional: encrypt data
});

// Adapter for Zustand persist middleware
export const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';

export type HistoryItemType = 'scan' | 'generate';

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  qrType: string; // 'url', 'text', 'wifi', etc.
  data: string;
  parsedData?: any; // Parsed vcard, wifi object, etc.
  timestamp: number;
  isFavorite: boolean;
  title?: string; // Optional user-assigned title
}

interface HistoryState {
  items: HistoryItem[];
  
  // Actions
  addItem: (item: Omit<HistoryItem, 'id' | 'timestamp' | 'isFavorite'>) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateItemTitle: (id: string, title: string) => void;
  clearHistory: () => void;
  
  // Getters
  getFavorites: () => HistoryItem[];
  getScans: () => HistoryItem[];
  getGenerations: () => HistoryItem[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: Math.random().toString(36).substring(2, 15),
          timestamp: Date.now(),
          isFavorite: false,
        };
        
        set((state) => ({
          items: [newItem, ...state.items]
        }));
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },
      
      toggleFavorite: (id) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
          )
        }));
      },
      
      updateItemTitle: (id, title) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === id ? { ...item, title } : item
          )
        }));
      },
      
      clearHistory: () => set({ items: [] }),
      
      getFavorites: () => get().items.filter(i => i.isFavorite),
      getScans: () => get().items.filter(i => i.type === 'scan'),
      getGenerations: () => get().items.filter(i => i.type === 'generate'),
    }),
    {
      name: 'history-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

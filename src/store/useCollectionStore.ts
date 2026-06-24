import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';

export interface Collection {
  id: string;
  name: string;
  color: string;
  icon: string;
  qrIds: string[]; // IDs from HistoryStore
  createdAt: number;
}

interface CollectionState {
  collections: Collection[];
  
  // Actions
  addCollection: (name: string, color: string, icon: string) => void;
  updateCollection: (id: string, updates: Partial<Omit<Collection, 'id' | 'createdAt'>>) => void;
  deleteCollection: (id: string) => void;
  addQrToCollection: (collectionId: string, qrId: string) => void;
  removeQrFromCollection: (collectionId: string, qrId: string) => void;
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      collections: [],
      
      addCollection: (name, color, icon) => {
        const newCollection: Collection = {
          id: Math.random().toString(36).substring(2, 15),
          name,
          color,
          icon,
          qrIds: [],
          createdAt: Date.now(),
        };
        
        set((state) => ({
          collections: [...state.collections, newCollection]
        }));
      },
      
      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },
      
      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter(c => c.id !== id)
        }));
      },
      
      addQrToCollection: (collectionId, qrId) => {
        set((state) => ({
          collections: state.collections.map(c => 
            c.id === collectionId && !c.qrIds.includes(qrId)
              ? { ...c, qrIds: [...c.qrIds, qrId] }
              : c
          )
        }));
      },
      
      removeQrFromCollection: (collectionId, qrId) => {
        set((state) => ({
          collections: state.collections.map(c => 
            c.id === collectionId
              ? { ...c, qrIds: c.qrIds.filter(id => id !== qrId) }
              : c
          )
        }));
      },
    }),
    {
      name: 'collection-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);

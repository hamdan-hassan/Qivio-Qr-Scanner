import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, SegmentedControl, IconButton, Input, Button, BottomSheet, BottomSheetRef } from '../components/ui';
import { SearchBar } from '../components/shared/SearchBar';
import { EmptyState } from '../components/shared/EmptyState';
import { useCollectionStore, useHistoryStore, Collection, HistoryItem } from '../store';
import { BannerAd } from '../components/ads/BannerAd';



export const StudioScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const { collections } = useCollectionStore();
  const { items } = useHistoryStore();
  
  const [activeTab, setActiveTab] = useState(0); // 0: Collections, 1: All QRs
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const collectionSheetRef = React.useRef<BottomSheetRef>(null);
  const [selectedQRForCollection, setSelectedQRForCollection] = useState<string | null>(null);

  const savedQRs = React.useMemo(() => {
    let result = items;
    if (searchQuery.trim() !== '') {
      const lower = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.data.toLowerCase().includes(lower) || 
        (i.title && i.title.toLowerCase().includes(lower))
      );
    }
    return result.sort((a, b) => b.timestamp - a.timestamp);
  }, [items, searchQuery]);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const paginatedQRs = React.useMemo(() => {
    return savedQRs.slice(0, page * PAGE_SIZE);
  }, [savedQRs, page]);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, items.length]);

  const handleLoadMore = () => {
    if (page * PAGE_SIZE < savedQRs.length) {
      setPage(prev => prev + 1);
    }
  };

  const filteredCollections = React.useMemo(() => {
    if (searchQuery.trim() === '') return collections;
    return collections.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [collections, searchQuery]);

  const renderCollection = ({ item }: { item: Collection }) => (
    <TouchableOpacity 
      style={[
        styles.collectionCard, 
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
      ]}
      activeOpacity={0.7}
      onPress={() => {}}
    >
      <View style={[styles.collectionIcon, { backgroundColor: `${item.color}15` }]}>
        <Icon name={item.icon || 'folder'} size={32} color={item.color} />
      </View>
      <Typography variant="bodyLg" weight="semiBold" style={{ marginTop: 12 }}>
        {item.name}
      </Typography>
      <Typography variant="caption" color={theme.colors.textSecondary} style={{ marginTop: 4 }}>
        {item.qrIds.length} items
      </Typography>
    </TouchableOpacity>
  );

  const renderQRItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity 
      style={[styles.qrItem, { backgroundColor: theme.colors.surface }]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Designer', { data: item.data, type: item.qrType })}
    >
      <View style={[styles.qrIconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
        <Icon name="qr-code" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.qrItemContent}>
        <Typography variant="bodyLg" weight="semiBold" numberOfLines={1}>
          {item.title || item.data}
        </Typography>
        <Typography variant="caption" color={theme.colors.textSecondary} style={{ textTransform: 'uppercase', marginTop: 4 }}>
          {item.qrType} • {new Date(item.timestamp).toLocaleDateString()}
        </Typography>
      </View>
      <TouchableOpacity 
        onPress={() => {
          setSelectedQRForCollection(item.id);
          collectionSheetRef.current?.open();
        }}
        style={{ padding: 8, marginRight: 4 }}
      >
        <Icon name="add-circle-outline" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      <Icon name="chevron-forward" size={20} color={theme.colors.border} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'bottom', 'left']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Typography variant="heading" weight="bold" style={{ marginLeft: 8 }}>Studio</Typography>
        <IconButton 
          icon={<Icon name="add" size={24} color={theme.colors.text} />} 
          onPress={() => setModalVisible(true)} 
        />
      </View>

      <View style={[styles.controlsContainer, { borderColor: theme.colors.border }]}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={activeTab === 0 ? "Search collections..." : "Search QR codes..."}
        />
        <SegmentedControl 
          tabs={['Collections', 'All QRs']}
          selectedIndex={activeTab}
          onChange={setActiveTab}
        />
      </View>

      <View style={styles.listContainer}>
        {activeTab === 0 ? (
          filteredCollections.length === 0 ? (
            <EmptyState 
              icon="folder-open-outline"
              title="No Collections"
              description="Create a collection to organize your QR codes."
              actionLabel="New Collection"
              onAction={() => setModalVisible(true)}
            />
          ) : (
            <FlashList
              data={filteredCollections}
              renderItem={renderCollection}
              keyExtractor={item => item.id}
              numColumns={2}
              // @ts-ignore
              estimatedItemSize={150}
              key="collections-list"
              contentContainerStyle={styles.gridContent}
            />
          )
        ) : (
          savedQRs.length === 0 ? (
            <EmptyState 
              icon="qr-code-outline"
              title="No Generated QRs"
              description="QR codes you create will appear here."
              actionLabel="Create QR"
              onAction={() => navigation.navigate('Create')}
            />
          ) : (
            <FlashList
              data={paginatedQRs}
              renderItem={renderQRItem}
              keyExtractor={item => item.id}
              // @ts-ignore
              estimatedItemSize={100}
              key="qrs-list"
              contentContainerStyle={styles.listContent}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />
          )
        )}
      </View>

      <BottomSheet ref={collectionSheetRef} height={400}>
        <Typography variant="title" weight="bold" style={{ marginBottom: 16 }}>Add to Collection</Typography>
        {collections.length === 0 ? (
          <Typography variant="body" color={theme.colors.textSecondary}>You have no collections.</Typography>
        ) : (
          <ScrollView>
            {collections.map(c => (
              <TouchableOpacity
                key={c.id}
                style={[styles.collectionSheetItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => {
                  if (selectedQRForCollection) {
                    useCollectionStore.getState().addQrToCollection(c.id, selectedQRForCollection);
                  }
                  collectionSheetRef.current?.close();
                }}
              >
                <View style={[styles.collectionIconSmall, { backgroundColor: `${c.color}15` }]}>
                  <Icon name={c.icon || 'folder'} size={20} color={c.color} />
                </View>
                <Typography variant="bodyLg" weight="medium" style={{ flex: 1, marginLeft: 12 }}>{c.name}</Typography>
                {c.qrIds.includes(selectedQRForCollection || '') && (
                  <Icon name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </BottomSheet>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Typography variant="title" weight="bold" style={{ marginBottom: 16 }}>New Collection</Typography>
            <Input
              label="Collection Name"
              placeholder="e.g. Work, Social, Wi-Fi"
              value={newCollectionName}
              onChangeText={setNewCollectionName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Button 
                title="Cancel" 
                variant="secondary" 
                onPress={() => {
                  setModalVisible(false);
                  setNewCollectionName('');
                }} 
                style={{ flex: 1, marginRight: 8 }} 
              />
              <Button 
                title="Create" 
                variant="primary" 
                onPress={() => {
                  if (newCollectionName.trim()) {
                    useCollectionStore.getState().addCollection(newCollectionName.trim(), '#6366F1', 'folder');
                    setModalVisible(false);
                    setNewCollectionName('');
                  }
                }} 
                disabled={!newCollectionName.trim()}
                style={{ flex: 1, marginLeft: 8 }} 
              />
            </View>
          </View>
        </View>
      </Modal>
      <BannerAd />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  controlsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  listContainer: {
    flex: 1,
  },
  gridContent: {
    padding: 12,
    paddingBottom: 100, // Tab bar clearance
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  collectionCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  collectionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  qrIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  qrItemContent: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
  },
  collectionSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  collectionIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { Typography, IconButton, SegmentedControl } from '../components/ui';
import { SearchBar } from '../components/shared/SearchBar';
import { EmptyState } from '../components/shared/EmptyState';
import { useHistoryStore, HistoryItem } from '../store';
import { BannerAd } from '../components/ads/BannerAd';

export const HistoryScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  const { items, removeItem, clearHistory } = useHistoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(0); // 0: All, 1: Scans, 2: Created
  
  const filteredItems = useMemo(() => {
    let result = items;
    
    // Filter by type
    if (filterType === 1) {
      result = result.filter(item => item.type === 'scan');
    } else if (filterType === 2) {
      result = result.filter(item => item.type === 'generate');
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.data.toLowerCase().includes(lowerQuery) || 
        (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
        item.qrType.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Sort newest first
    return result.sort((a, b) => b.timestamp - a.timestamp);
  }, [items, searchQuery, filterType]);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(0, page * PAGE_SIZE);
  }, [filteredItems, page]);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, filterType, items.length]);

  const handleLoadMore = () => {
    if (page * PAGE_SIZE < filteredItems.length) {
      setPage(prev => prev + 1);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive', 
          onPress: () => clearHistory() 
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const isScan = item.type === 'scan';
    const date = new Date(item.timestamp).toLocaleDateString();
    const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const iconColor = isScan ? theme.colors.primary : theme.colors.accent;
    const bgColor = isScan ? `${theme.colors.primary}15` : `${theme.colors.accent}15`;

    return (
      <TouchableOpacity 
        style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}
        activeOpacity={0.7}
        onPress={() => navigation.navigate(isScan ? 'ScanResult' : 'Designer', { data: item.data, type: item.qrType })}
      >
        <View style={[styles.itemIcon, { backgroundColor: bgColor }]}>
          <Icon name={isScan ? 'scan' : 'qr-code'} size={24} color={iconColor} />
        </View>
        
        <View style={styles.itemContent}>
          <Typography variant="bodyLg" weight="semiBold" numberOfLines={1}>
            {item.title || item.data}
          </Typography>
          <View style={styles.itemMeta}>
            <Typography variant="caption" color={theme.colors.textSecondary} style={{ textTransform: 'uppercase' }}>
              {item.qrType}
            </Typography>
            <View style={[styles.dot, { backgroundColor: theme.colors.border }]} />
            <Typography variant="caption" color={theme.colors.textSecondary}>
              {date} {time}
            </Typography>
          </View>
        </View>
        
        <View style={styles.itemActions}>
          <IconButton 
            icon={<Icon name="trash-outline" size={22} color={theme.colors.danger} />}
            onPress={() => removeItem(item.id)}
            variant="ghost"
            size={32}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['right', 'bottom', 'left']}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <IconButton 
          icon={<Icon name="arrow-back" size={24} color={theme.colors.text} />} 
          onPress={() => navigation.goBack()} 
        />
        <Typography variant="subtitle" weight="semiBold">History</Typography>
        <IconButton 
          icon={<Icon name="trash-bin-outline" size={24} color={items.length > 0 ? theme.colors.danger : theme.colors.textSecondary} />} 
          onPress={handleClearAll}
          disabled={items.length === 0}
        />
      </View>
      
      <View style={{ paddingHorizontal: 16 }}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search history..."
        />
        <SegmentedControl 
          tabs={['All', 'Scans', 'Created']}
          selectedIndex={filterType}
          onChange={setFilterType}
        />
      </View>

      <View style={styles.listContainer}>
        {items.length === 0 ? (
          <EmptyState 
            icon="time-outline"
            title="No History Yet"
            description="Your scanned and generated QR codes will appear here."
            actionLabel="Scan QR"
            onAction={() => navigation.navigate('Scanner')}
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState 
            icon="search-outline"
            title="No Results Found"
            description="Try adjusting your search or filters."
            actionLabel="Clear Filters"
            onAction={() => { setSearchQuery(''); setFilterType(0); }}
          />
        ) : (
          <FlashList
            data={paginatedItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            // @ts-expect-error FlashList typings have an issue with React 19
            estimatedItemSize={80}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
      </View>
      <BannerAd />
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
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

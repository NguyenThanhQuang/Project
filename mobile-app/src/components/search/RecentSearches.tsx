import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecentSearch {
  from: string;
  to: string;
  timestamp: number;
}

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSearchSelect: (from: string, to: string) => void;
  onClearAll: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({
  searches,
  onSearchSelect,
  onClearAll,
}) => {
  if (searches.length === 0) {
    return null;
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="time" size={20} color="#666" />
          <Text style={styles.title}>Tìm kiếm gần đây</Text>
        </View>
        <TouchableOpacity onPress={onClearAll} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {searches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.searchItem}
            onPress={() => onSearchSelect(search.from, search.to)}
          >
            <View style={styles.searchContent}>
              <View style={styles.routeInfo}>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={14} color="#4CAF50" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {search.from}
                  </Text>
                </View>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#F44336" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {search.to}
                  </Text>
                </View>
              </View>
              <Text style={styles.timeText}>
                {formatTimeAgo(search.timestamp)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  scrollContent: {
    paddingRight: 20,
  },
  searchItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContent: {
    gap: 8,
  },
  routeInfo: {
    gap: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default RecentSearches;

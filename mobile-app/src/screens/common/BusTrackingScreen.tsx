import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface BusLocation {
  id: string;
  busNumber: string;
  route: string;
  from: string;
  to: string;
  currentLocation: string;
  estimatedArrival: string;
  status: 'on-time' | 'delayed' | 'early';
  delay: number; // minutes
  nextStop: string;
  distance: number; // km
}

const BusTrackingScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [buses, setBuses] = useState<BusLocation[]>([]);
  const [filteredBuses, setFilteredBuses] = useState<BusLocation[]>([]);

  useEffect(() => {
    loadBusData();
  }, []);

  useEffect(() => {
    filterBuses();
  }, [searchQuery, selectedRoute, buses]);

  const loadBusData = async () => {
    // Mock data
    const mockBuses: BusLocation[] = [
      {
        id: '1',
        busNumber: 'BT001',
        route: 'Hà Nội - TP. Hồ Chí Minh',
        from: 'Hà Nội',
        to: 'TP. Hồ Chí Minh',
        currentLocation: 'Nghệ An',
        estimatedArrival: '20:00',
        status: 'on-time',
        delay: 0,
        nextStop: 'Hà Tĩnh',
        distance: 150,
      },
      {
        id: '2',
        busNumber: 'BT002',
        route: 'Hà Nội - Đà Nẵng',
        from: 'Hà Nội',
        to: 'Đà Nẵng',
        currentLocation: 'Thanh Hóa',
        estimatedArrival: '21:30',
        status: 'delayed',
        delay: 15,
        nextStop: 'Ninh Bình',
        distance: 80,
      },
      {
        id: '3',
        busNumber: 'BT003',
        route: 'TP. Hồ Chí Minh - Đà Lạt',
        from: 'TP. Hồ Chí Minh',
        to: 'Đà Lạt',
        currentLocation: 'Bình Thuận',
        estimatedArrival: '12:00',
        status: 'early',
        delay: -10,
        nextStop: 'Ninh Thuận',
        distance: 120,
      },
    ];
    setBuses(mockBuses);
  };

  const filterBuses = () => {
    let filtered = buses;
    
    if (searchQuery) {
      filtered = filtered.filter(bus => 
        bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bus.route.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedRoute) {
      filtered = filtered.filter(bus => bus.route === selectedRoute);
    }
    
    setFilteredBuses(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return '#4caf50';
      case 'delayed':
        return '#f44336';
      case 'early':
        return '#2196f3';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'Đúng giờ';
      case 'delayed':
        return 'Trễ giờ';
      case 'early':
        return 'Sớm giờ';
      default:
        return 'Không xác định';
    }
  };

  const handleRefresh = () => {
    loadBusData();
    Alert.alert('Thông báo', 'Đã cập nhật thông tin xe buýt');
  };

  const handleBusPress = (bus: BusLocation) => {
    Alert.alert(
      `Xe buýt ${bus.busNumber}`,
      `Tuyến: ${bus.route}\nVị trí hiện tại: ${bus.currentLocation}\nĐiểm dừng tiếp theo: ${bus.nextStop}\nThời gian đến: ${bus.estimatedArrival}\nTrạng thái: ${getStatusText(bus.status)}${bus.delay !== 0 ? `\n${bus.delay > 0 ? 'Trễ' : 'Sớm'}: ${Math.abs(bus.delay)} phút` : ''}`,
      [{ text: 'OK' }]
    );
  };

  const routes = ['Tất cả', 'Hà Nội - TP. Hồ Chí Minh', 'Hà Nội - Đà Nẵng', 'TP. Hồ Chí Minh - Đà Lạt'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1976d2', '#42a5f5']} style={styles.header}>
        <Text style={styles.headerTitle}>Theo dõi xe buýt</Text>
        <Text style={styles.headerSubtitle}>Tìm kiếm và theo dõi vị trí xe buýt</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm xe buýt hoặc tuyến đường..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Route Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Lọc theo tuyến đường:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.routeFilter}>
            {routes.map((route, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.routeChip,
                  selectedRoute === route && styles.routeChipSelected
                ]}
                onPress={() => setSelectedRoute(route === 'Tất cả' ? '' : route)}
              >
                <Text style={[
                  styles.routeChipText,
                  selectedRoute === route && styles.routeChipTextSelected
                ]}>
                  {route}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bus List */}
        <View style={styles.busListSection}>
          <Text style={styles.sectionTitle}>
            Xe buýt đang hoạt động ({filteredBuses.length})
          </Text>
          
          {filteredBuses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bus-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Không tìm thấy xe buýt nào</Text>
            </View>
          ) : (
            filteredBuses.map((bus) => (
              <TouchableOpacity
                key={bus.id}
                style={styles.busCard}
                onPress={() => handleBusPress(bus)}
              >
                <View style={styles.busHeader}>
                  <View style={styles.busInfo}>
                    <Text style={styles.busNumber}>{bus.busNumber}</Text>
                    <Text style={styles.busRoute}>{bus.route}</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(bus.status) }]} />
                    <Text style={styles.statusText}>{getStatusText(bus.status)}</Text>
                  </View>
                </View>
                
                <View style={styles.busDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#0077be" />
                    <Text style={styles.detailText}>Vị trí hiện tại: {bus.currentLocation}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#ff9800" />
                    <Text style={styles.detailText}>Thời gian đến: {bus.estimatedArrival}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="flag" size={16} color="#4caf50" />
                    <Text style={styles.detailText}>Điểm dừng tiếp theo: {bus.nextStop}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="navigate" size={16} color="#9c27b0" />
                    <Text style={styles.detailText}>Khoảng cách: {bus.distance} km</Text>
                  </View>
                </View>
                
                {bus.delay !== 0 && (
                  <View style={styles.delayInfo}>
                    <Ionicons 
                      name={bus.delay > 0 ? "time" : "checkmark-circle"} 
                      size={16} 
                      color={bus.delay > 0 ? "#f44336" : "#4caf50"} 
                    />
                    <Text style={[styles.delayText, { color: bus.delay > 0 ? "#f44336" : "#4caf50" }]}>
                      {bus.delay > 0 ? `Trễ ${bus.delay} phút` : `Sớm ${Math.abs(bus.delay)} phút`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: '#1976d2',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  comingSoon: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    flex: 1,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  refreshButton: {
    padding: 10,
  },
  filterSection: {
    marginBottom: 15,
    width: '100%',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  routeFilter: {
    flexDirection: 'row',
  },
  routeChip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  routeChipSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  routeChipText: {
    fontSize: 14,
    color: '#333',
  },
  routeChipTextSelected: {
    color: 'white',
  },
  busListSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  busCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  busInfo: {
    flex: 1,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  busRoute: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  busDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  delayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  delayText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
});

export default BusTrackingScreen;

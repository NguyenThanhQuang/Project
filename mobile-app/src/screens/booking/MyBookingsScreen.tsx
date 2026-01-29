import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface Booking {
  id: string;
  tripId: string;
  from: string;
  to: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  company: string;
  seats: string[];
  passengers: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  bookingDate: string;
  qrCode?: string;
}

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockBookings: Booking[] = [
        {
          id: '1',
          tripId: 'trip1',
          from: 'Hà Nội',
          to: 'TP. Hồ Chí Minh',
          date: '15/08/2025',
          departureTime: '08:00',
          arrivalTime: '20:00',
          company: 'Phương Trang',
          seats: ['A1', 'A2'],
          passengers: 2,
          totalPrice: 900000,
          status: 'confirmed',
          bookingDate: '10/08/2025',
          qrCode: 'QR123456',
        },
        {
          id: '2',
          tripId: 'trip2',
          from: 'Hà Nội',
          to: 'Đà Nẵng',
          date: '20/08/2025',
          departureTime: '09:00',
          arrivalTime: '21:00',
          company: 'Mai Linh',
          seats: ['B3'],
          passengers: 1,
          totalPrice: 280000,
          status: 'pending',
          bookingDate: '12/08/2025',
        },
        {
          id: '3',
          tripId: 'trip3',
          from: 'TP. Hồ Chí Minh',
          to: 'Đà Lạt',
          date: '25/07/2025',
          departureTime: '07:00',
          arrivalTime: '12:00',
          company: 'Thành Bưởi',
          seats: ['C5'],
          passengers: 1,
          totalPrice: 180000,
          status: 'completed',
          bookingDate: '20/07/2025',
        },
        {
          id: '4',
          tripId: 'trip4',
          from: 'Hà Nội',
          to: 'Hải Phòng',
          date: '30/07/2025',
          departureTime: '14:00',
          arrivalTime: '16:00',
          company: 'Phương Trang',
          seats: ['D2'],
          passengers: 1,
          totalPrice: 80000,
          status: 'cancelled',
          bookingDate: '25/07/2025',
        },
      ];
      
      setBookings(mockBookings);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách vé. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleBookingAction = (booking: Booking, action: string) => {
    switch (action) {
      case 'view':
        // Navigate to booking details
        break;
      case 'cancel':
        Alert.alert(
          'Hủy vé',
          'Bạn có chắc chắn muốn hủy vé này?',
          [
            { text: 'Không', style: 'cancel' },
            { 
              text: 'Có', 
              onPress: () => cancelBooking(booking.id),
              style: 'destructive'
            },
          ]
        );
        break;
      case 'download':
        // Download ticket
        Alert.alert('Thông báo', 'Tính năng tải vé đang được phát triển');
        break;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      ));
      
      Alert.alert('Thành công', 'Vé đã được hủy thành công');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể hủy vé. Vui lòng thử lại.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      case 'completed':
        return '#2196f3';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      case 'completed':
        return 'Hoàn thành';
      default:
        return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      default:
        return 'help-circle';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#0077be', '#004c8b']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Vé của tôi</Text>
          <Text style={styles.headerSubtitle}>Quản lý tất cả vé đã đặt</Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
              Sắp tới
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
              Hoàn thành
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cancelled' && styles.tabActive]}
            onPress={() => setActiveTab('cancelled')}
          >
            <Text style={[styles.tabText, activeTab === 'cancelled' && styles.tabTextActive]}>
              Đã hủy
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ticket" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'all' ? 'Chưa có vé nào' : `Chưa có vé ${getStatusText(activeTab).toLowerCase()}`}
            </Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'all' 
                ? 'Hãy đặt vé để bắt đầu hành trình của bạn'
                : 'Các vé sẽ xuất hiện ở đây khi có thay đổi trạng thái'
              }
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              {/* Header */}
              <View style={styles.bookingHeader}>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeText}>{booking.from} → {booking.to}</Text>
                  <Text style={styles.dateText}>{booking.date}</Text>
                </View>
                
                <View style={styles.statusContainer}>
                  <Ionicons 
                    name={getStatusIcon(booking.status) as any} 
                    size={20} 
                    color={getStatusColor(booking.status)} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                    {getStatusText(booking.status)}
                  </Text>
                </View>
              </View>

              {/* Trip Details */}
              <View style={styles.tripDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {booking.departureTime} - {booking.arrivalTime}
                    </Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="business" size={16} color="#666" />
                    <Text style={styles.detailText}>{booking.company}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="people" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {booking.passengers} hành khách
                    </Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="person" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      Ghế: {booking.seats.join(', ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      Đặt vé: {booking.bookingDate}
                    </Text>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Ionicons name="card" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {formatPrice(booking.totalPrice)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleBookingAction(booking, 'view')}
                >
                  <Ionicons name="eye" size={16} color="#0077be" />
                  <Text style={styles.actionButtonText}>Xem chi tiết</Text>
                </TouchableOpacity>

                {booking.status === 'confirmed' && (
                  <>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleBookingAction(booking, 'download')}
                    >
                      <Ionicons name="download" size={16} color="#4caf50" />
                      <Text style={[styles.actionButtonText, { color: '#4caf50' }]}>
                        Tải vé
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleBookingAction(booking, 'cancel')}
                    >
                      <Ionicons name="close" size={16} color="#f44336" />
                      <Text style={[styles.actionButtonText, { color: '#f44336' }]}>
                        Hủy vé
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {booking.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleBookingAction(booking, 'cancel')}
                  >
                    <Ionicons name="close" size={16} color="#f44336" />
                    <Text style={[styles.actionButtonText, { color: '#f44336' }]}>
                      Hủy vé
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafb',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
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
  tabsContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  tabActive: {
    backgroundColor: '#0077be',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    padding: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  bookingCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a2332',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tripDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#1a2332',
    marginLeft: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#0077be',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default MyBookingsScreen;

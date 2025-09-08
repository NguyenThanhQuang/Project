import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface UserPoints {
  current: number;
  total: number;
  nextTierPoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

interface Voucher {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  pointsCost: number;
  validUntil: string;
  minOrderAmount: number;
  maxDiscount?: number;
  category: 'discount' | 'upgrade' | 'service';
  available: number;
  used?: boolean;
}

interface PointHistory {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
  tripId?: string;
}

const LoyaltyProgramScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const userPoints: UserPoints = {
    current: 2450,
    total: 8750,
    nextTierPoints: 10000,
    tier: 'Silver',
  };

  const availableVouchers: Voucher[] = [
    {
      id: 'v1',
      title: 'Giảm 15% tổng giá trị',
      description: 'Áp dụng cho tất cả tuyến đường',
      discount: 15,
      discountType: 'percentage',
      pointsCost: 500,
      validUntil: '2024-02-28',
      minOrderAmount: 200000,
      maxDiscount: 50000,
      category: 'discount',
      available: 100,
    },
    {
      id: 'v2',
      title: 'Miễn phí nâng cấp ghế VIP',
      description: 'Nâng cấp từ ghế thường lên ghế VIP miễn phí',
      discount: 100,
      discountType: 'fixed',
      pointsCost: 800,
      validUntil: '2024-03-15',
      minOrderAmount: 0,
      category: 'upgrade',
      available: 50,
    },
    {
      id: 'v3',
      title: 'Giảm 20% cho chuyến xe đầu tiên',
      description: 'Áp dụng cho người dùng mới',
      discount: 20,
      discountType: 'percentage',
      pointsCost: 300,
      validUntil: '2024-04-01',
      minOrderAmount: 100000,
      maxDiscount: 100000,
      category: 'discount',
      available: 200,
    },
  ];

  const pointHistory: PointHistory[] = [
    {
      id: '1',
      type: 'earn',
      amount: 150,
      description: 'Đặt vé Hà Nội - TP.HCM',
      date: '2024-01-15',
      tripId: 'trip1',
    },
    {
      id: '2',
      type: 'spend',
      amount: -500,
      description: 'Đổi voucher giảm 15%',
      date: '2024-01-10',
    },
    {
      id: '3',
      type: 'earn',
      amount: 200,
      description: 'Đặt vé TP.HCM - Đà Nẵng',
      date: '2024-01-08',
      tripId: 'trip2',
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return '#cd7f32';
      case 'Silver':
        return '#c0c0c0';
      case 'Gold':
        return '#ffd700';
      case 'Platinum':
        return '#e5e4e2';
      default:
        return '#666';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'medal';
      case 'Silver':
        return 'medal';
      case 'Gold':
        return 'medal';
      case 'Platinum':
        return 'diamond';
      default:
        return 'star';
    }
  };

  const handleRedeemVoucher = (voucher: Voucher) => {
    if (userPoints.current < voucher.pointsCost) {
      Alert.alert('Không đủ điểm', 'Bạn cần có đủ điểm để đổi voucher này');
      return;
    }
    
    setSelectedVoucher(voucher);
    Alert.alert(
      'Xác nhận đổi voucher',
      `Bạn có muốn đổi ${voucher.pointsCost} điểm để lấy voucher "${voucher.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đồng ý', onPress: () => confirmRedeem(voucher) },
      ]
    );
  };

  const confirmRedeem = (voucher: Voucher) => {
    Alert.alert('Thành công', `Bạn đã đổi thành công voucher "${voucher.title}"`);
    // TODO: Call API to redeem voucher
  };

  const renderPointsCard = () => (
    <LinearGradient
      colors={['#0077be', '#004c8b']}
      style={styles.pointsCard}
    >
      <View style={styles.pointsHeader}>
        <Ionicons 
          name={getTierIcon(userPoints.tier) as any} 
          size={40} 
          color={getTierColor(userPoints.tier)} 
        />
        <View style={styles.pointsInfo}>
          <Text style={styles.tierText}>{userPoints.tier}</Text>
          <Text style={styles.pointsText}>{userPoints.current.toLocaleString()} điểm</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(userPoints.current / userPoints.nextTierPoints) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Còn {userPoints.nextTierPoints - userPoints.current} điểm để lên {userPoints.tier === 'Bronze' ? 'Silver' : userPoints.tier === 'Silver' ? 'Gold' : 'Platinum'}
        </Text>
      </View>
    </LinearGradient>
  );

  const renderVouchers = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Voucher có sẵn</Text>
      {availableVouchers.map((voucher) => (
        <View key={voucher.id} style={styles.voucherCard}>
          <View style={styles.voucherHeader}>
            <View style={styles.voucherIcon}>
              <Ionicons name="gift" size={24} color="#0077be" />
            </View>
            <View style={styles.voucherInfo}>
              <Text style={styles.voucherTitle}>{voucher.title}</Text>
              <Text style={styles.voucherDescription}>{voucher.description}</Text>
              <Text style={styles.voucherValid}>
                Có hiệu lực đến: {voucher.validUntil}
              </Text>
            </View>
          </View>
          
          <View style={styles.voucherDetails}>
            <View style={styles.voucherDetail}>
              <Text style={styles.detailLabel}>Giảm giá:</Text>
              <Text style={styles.detailValue}>
                {voucher.discountType === 'percentage' ? `${voucher.discount}%` : `${voucher.discount.toLocaleString()}đ`}
              </Text>
            </View>
            <View style={styles.voucherDetail}>
              <Text style={styles.detailLabel}>Điểm cần:</Text>
              <Text style={styles.detailValue}>{voucher.pointsCost} điểm</Text>
            </View>
            <View style={styles.voucherDetail}>
              <Text style={styles.detailLabel}>Giá tối thiểu:</Text>
              <Text style={styles.detailValue}>{voucher.minOrderAmount.toLocaleString()}đ</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.redeemButton,
              userPoints.current < voucher.pointsCost && styles.redeemButtonDisabled
            ]}
            onPress={() => handleRedeemVoucher(voucher)}
            disabled={userPoints.current < voucher.pointsCost}
          >
            <Text style={styles.redeemButtonText}>
              {userPoints.current < voucher.pointsCost ? 'Không đủ điểm' : 'Đổi voucher'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderPointHistory = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Lịch sử điểm</Text>
      {pointHistory.map((history) => (
        <View key={history.id} style={styles.historyCard}>
          <View style={styles.historyIcon}>
            <Ionicons 
              name={history.type === 'earn' ? 'add-circle' : 'remove-circle'} 
              size={24} 
              color={history.type === 'earn' ? '#4caf50' : '#f44336'} 
            />
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.historyDescription}>{history.description}</Text>
            <Text style={styles.historyDate}>{history.date}</Text>
          </View>
          <Text style={[
            styles.historyAmount,
            { color: history.type === 'earn' ? '#4caf50' : '#f44336' }
          ]}>
            {history.type === 'earn' ? '+' : ''}{history.amount} điểm
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chương trình khách hàng thân thiết</Text>
        <Text style={styles.headerSubtitle}>Tích điểm và đổi voucher hấp dẫn</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderPointsCard()}
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 0 && styles.tabActive]}
            onPress={() => setActiveTab(0)}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.tabTextActive]}>
              Voucher
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 1 && styles.tabActive]}
            onPress={() => setActiveTab(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.tabTextActive]}>
              Lịch sử
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 0 ? renderVouchers() : renderPointHistory()}
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
    backgroundColor: '#0077be',
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
  pointsCard: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsInfo: {
    marginLeft: 16,
    flex: 1,
  },
  tierText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  pointsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffa726',
    borderRadius: 4,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#0077be',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: 'white',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  voucherCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  voucherHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  voucherIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  voucherInfo: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  voucherDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  voucherValid: {
    fontSize: 12,
    color: '#999',
  },
  voucherDetails: {
    marginBottom: 16,
  },
  voucherDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  redeemButton: {
    backgroundColor: '#0077be',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: '#ccc',
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyIcon: {
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoyaltyProgramScreen;

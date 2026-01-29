import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ROUTES, ICONS, COLORS } from "../../theme";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../store/index-store";
import { tripAdminService } from "../../services/tripAdminService";

const { width, height } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useSelector((state: RootState) => state.auth);

  // State for today's trips
  const [todayTrips, setTodayTrips] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(false);

  const handleSearchTrips = () => {
    // Navigate to SearchTrips tab
    navigation.navigate(ROUTES.SearchTrips as never);
  };

  const handleMyBookings = () => {
    // Navigate to MyBookings tab
    navigation.navigate(ROUTES.MyBookings as never);
  };

  const handleBusTracking = () => {
    // Navigate to BusTracking tab
    navigation.navigate(ROUTES.BusTracking as never);
  };

  const handleProfile = () => {
    // Navigate to Profile tab
    navigation.navigate(ROUTES.Profile as never);
  };

  const handleSupport = () => {
    // TODO: Navigate to support screen
    Alert.alert("Thông báo", "Tính năng hỗ trợ sẽ sớm có mặt!");
  };

  const handleRoutePress = (routeName: string) => {
    // Navigate to search trips with route pre-filled
    navigation.navigate(ROUTES.SearchTrips as never);
  };

  // Fetch today's trips
  const fetchTodayTrips = async () => {
    try {
      setLoadingTrips(true);
      const today = new Date();
      const todayString = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Get trips for today
      const trips = await tripAdminService.getTripsByDate(todayString);
      setTodayTrips(trips || []);
    } catch (error) {
      console.error("Error fetching today trips:", error);
      // Set empty array on error
      setTodayTrips([]);
    } finally {
      setLoadingTrips(false);
    }
  };

  // Load today's trips on component mount
  useEffect(() => {
    fetchTodayTrips();
  }, []);

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle trip selection
  const handleTripSelect = (trip: any) => {
    // Navigate to trip details
    navigation.navigate("TripDetails" as never, { tripId: trip._id } as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0077be" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingTrips}
            onRefresh={fetchTodayTrips}
            colors={["#0077be"]}
            tintColor="#0077be"
          />
        }
      >
        {/* Header */}
        <LinearGradient colors={["#0077be", "#005a8b"]} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>
                Chào mừng trở lại, {user?.name || "Bạn"}!
              </Text>
              <Text style={styles.subtitleText}>
                Khám phá chuyến xe phù hợp với bạn
              </Text>
            </View>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={handleProfile}
            >
              <Ionicons
                name="person-circle"
                size={width * 0.12}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleSearchTrips}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="search" size={width * 0.06} color="#0077be" />
            </View>
            <Text style={styles.actionText}>Tìm chuyến xe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleMyBookings}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="bookmark" size={width * 0.06} color="#4caf50" />
            </View>
            <Text style={styles.actionText}>Vé của tôi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleBusTracking}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="location" size={width * 0.06} color="#ff9800" />
            </View>
            <Text style={styles.actionText}>Theo dõi xe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleSupport}>
            <View style={styles.actionIcon}>
              <Ionicons
                name="help-circle"
                size={width * 0.06}
                color="#9c27b0"
              />
            </View>
            <Text style={styles.actionText}>Hỗ trợ</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Routes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tuyến đường phổ biến</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.routeCard}
              onPress={() => handleRoutePress("Hà Nội → TP. HCM")}
            >
              <View style={styles.routeIcon}>
                <Ionicons name="bus" size={width * 0.08} color="#0077be" />
              </View>
              <Text style={styles.routeText}>Hà Nội → TP. HCM</Text>
              <Text style={styles.routePrice}>Từ 500.000đ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.routeCard}
              onPress={() => handleRoutePress("TP. HCM → Đà Nẵng")}
            >
              <View style={styles.routeIcon}>
                <Ionicons name="bus" size={width * 0.08} color="#4caf50" />
              </View>
              <Text style={styles.routeText}>TP. HCM → Đà Nẵng</Text>
              <Text style={styles.routePrice}>Từ 300.000đ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.routeCard}
              onPress={() => handleRoutePress("Đà Nẵng → Hà Nội")}
            >
              <View style={styles.routeIcon}>
                <Ionicons name="bus" size={width * 0.08} color="#ff9800" />
              </View>
              <Text style={styles.routeText}>Đà Nẵng → Hà Nội</Text>
              <Text style={styles.routePrice}>Từ 400.000đ</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Today's Available Trips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Chuyến xe hôm nay</Text>
              <Text style={styles.sectionSubtitle}>
                {todayTrips.length > 0
                  ? `${todayTrips.length} chuyến xe có sẵn`
                  : "Không có chuyến xe nào"}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={fetchTodayTrips}
                style={styles.refreshButton}
              >
                <Ionicons name="refresh" size={20} color="#0077be" />
              </TouchableOpacity>
              {todayTrips.length > 0 && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={handleSearchTrips}
                >
                  <Text style={styles.viewAllText}>Xem tất cả</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {loadingTrips ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0077be" />
              <Text style={styles.loadingText}>Đang tải chuyến xe...</Text>
            </View>
          ) : todayTrips.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {todayTrips.map((trip, index) => (
                <TouchableOpacity
                  key={trip._id || index}
                  style={styles.tripCard}
                  onPress={() => handleTripSelect(trip)}
                >
                  <View style={styles.tripHeader}>
                    <View style={styles.tripRoute}>
                      <Text style={styles.tripFrom}>
                        {trip.route?.fromLocationId?.name || "Điểm đi"}
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color="#0077be"
                      />
                      <Text style={styles.tripTo}>
                        {trip.route?.toLocationId?.name || "Điểm đến"}
                      </Text>
                    </View>
                    <View style={styles.tripStatus}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              trip.status === "scheduled"
                                ? "#4caf50"
                                : "#ff9800",
                          },
                        ]}
                      >
                        <Text style={styles.statusText}>
                          {trip.status === "scheduled"
                            ? "Sẵn sàng"
                            : "Đang di chuyển"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.tripDetails}>
                    <View style={styles.tripInfo}>
                      <Ionicons name="time" size={14} color="#666" />
                      <Text style={styles.tripTime}>
                        Khởi hành: {formatTime(trip.departureTime)}
                      </Text>
                    </View>
                    <View style={styles.tripInfo}>
                      <Ionicons name="bus" size={14} color="#666" />
                      <Text style={styles.tripCompany}>
                        {trip.companyId?.name || "Nhà xe"}
                      </Text>
                    </View>
                    <View style={styles.tripInfo}>
                      <Ionicons name="people" size={14} color="#666" />
                      <Text style={styles.tripSeats}>
                        Còn {trip.availableSeats || 0} ghế trống
                      </Text>
                    </View>
                    {trip.vehicleId?.type && (
                      <View style={styles.tripInfo}>
                        <Ionicons name="car" size={14} color="#666" />
                        <Text style={styles.tripVehicle}>
                          {trip.vehicleId.type}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.tripFooter}>
                    <Text style={styles.tripPrice}>
                      {trip.price
                        ? `${trip.price.toLocaleString("vi-VN")}đ`
                        : "Liên hệ"}
                    </Text>
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => handleTripSelect(trip)}
                    >
                      <Text style={styles.bookButtonText}>Đặt vé</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="bus-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                Không có chuyến xe nào hôm nay
              </Text>
              <Text style={styles.emptySubtext}>
                Hãy thử tìm kiếm chuyến xe khác
              </Text>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearchTrips}
              >
                <Text style={styles.searchButtonText}>Tìm chuyến xe</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đặt vé gần đây</Text>
          <TouchableOpacity
            style={styles.bookingCard}
            onPress={handleMyBookings}
          >
            <View style={styles.bookingHeader}>
              <Ionicons name="bus" size={width * 0.06} color="#0077be" />
              <Text style={styles.bookingRoute}>Hà Nội → TP. HCM</Text>
            </View>
            <Text style={styles.bookingDate}>Ngày 15/12/2024</Text>
            <Text style={styles.bookingStatus}>Đã xác nhận</Text>
          </TouchableOpacity>
        </View>

        {/* Promotions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Khuyến mãi</Text>
          <TouchableOpacity style={styles.promotionCard}>
            <LinearGradient
              colors={["#ff6b6b", "#ee5a52"]}
              style={styles.promotionGradient}
            >
              <View style={styles.promotionContent}>
                <Text style={styles.promotionTitle}>Giảm 20%</Text>
                <Text style={styles.promotionSubtitle}>
                  Cho chuyến xe đầu tiên
                </Text>
                <Text style={styles.promotionCode}>Mã: WELCOME20</Text>
              </View>
              <Ionicons name="gift" size={width * 0.12} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: height * 0.05,
    paddingBottom: height * 0.04,
    paddingHorizontal: width * 0.05,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.9)",
  },
  profileIcon: {
    marginLeft: 16,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    paddingBottom: height * 0.02,
  },
  actionCard: {
    width: (width - width * 0.15) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    padding: width * 0.04,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionText: {
    fontSize: width * 0.035,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: width * 0.05,
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.02,
  },
  routeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: width * 0.04,
    marginRight: 16,
    width: width * 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeIcon: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  routeText: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  routePrice: {
    fontSize: width * 0.035,
    color: "#0077be",
    fontWeight: "600",
  },
  bookingCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: width * 0.04,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bookingRoute: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  bookingDate: {
    fontSize: width * 0.035,
    color: "#666",
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: width * 0.035,
    color: "#4caf50",
    fontWeight: "600",
  },
  promotionCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  promotionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: width * 0.05,
  },
  promotionContent: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  promotionSubtitle: {
    fontSize: width * 0.04,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  promotionCode: {
    fontSize: width * 0.035,
    color: "white",
    fontWeight: "600",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  // Today's trips styles
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  sectionSubtitle: {
    fontSize: width * 0.035,
    color: "#666",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f0f8ff",
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#0077be",
  },
  viewAllText: {
    color: "white",
    fontSize: width * 0.03,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: height * 0.04,
  },
  loadingText: {
    marginTop: 12,
    fontSize: width * 0.04,
    color: "#666",
  },
  tripCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: width * 0.04,
    marginRight: 16,
    width: width * 0.75,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tripRoute: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  tripFrom: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  tripTo: {
    fontSize: width * 0.04,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  tripStatus: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: width * 0.03,
    color: "white",
    fontWeight: "600",
  },
  tripDetails: {
    marginBottom: 16,
  },
  tripInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tripTime: {
    fontSize: width * 0.035,
    color: "#666",
    marginLeft: 8,
  },
  tripCompany: {
    fontSize: width * 0.035,
    color: "#666",
    marginLeft: 8,
  },
  tripSeats: {
    fontSize: width * 0.035,
    color: "#666",
    marginLeft: 8,
  },
  tripVehicle: {
    fontSize: width * 0.035,
    color: "#666",
    marginLeft: 8,
  },
  tripFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tripPrice: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#0077be",
  },
  bookButton: {
    backgroundColor: "#0077be",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookButtonText: {
    color: "white",
    fontSize: width * 0.035,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: height * 0.04,
  },
  emptyText: {
    fontSize: width * 0.045,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: width * 0.035,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "#0077be",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 16,
  },
  searchButtonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
});

export default HomeScreen;

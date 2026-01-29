import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { bookingService } from "../../services/user/bookingService";
import type { Trip } from "../../types/index-types";

type BookingCheckoutRouteProp = RouteProp<
  {
    BookingCheckout: {
      trip: Trip;
      selectedSeats: string[];
      totalAmount: number;
    };
  },
  "BookingCheckout"
>;

interface PassengerInfo {
  name: string;
  phone: string;
  email: string;
  idNumber: string;
}

const BookingCheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<BookingCheckoutRouteProp>();
  const { trip, selectedSeats, totalAmount } = route.params;

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Debug logging
  console.log("BookingCheckoutScreen - Route params:", route.params);
  console.log("BookingCheckoutScreen - Trip:", trip);
  console.log("BookingCheckoutScreen - SelectedSeats:", selectedSeats);
  console.log("BookingCheckoutScreen - TotalAmount:", totalAmount);

  // Validate trip data
  if (!trip) {
    console.error("BookingCheckoutScreen - Trip is undefined!");
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={["#1976d2", "#1565c0"]} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Lỗi</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#f44336" />
          <Text style={styles.errorText}>
            Không thể tải thông tin chuyến xe
          </Text>
          <Text style={styles.errorSubtext}>
            Trip data: {JSON.stringify(route.params)}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const [loading, setLoading] = useState(false);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Initialize passengers array based on selected seats
  React.useEffect(() => {
    const initialPassengers = selectedSeats.map((seatNumber) => ({
      name: "",
      phone: "",
      email: "",
      idNumber: "",
    }));
    setPassengers(initialPassengers);
  }, [selectedSeats]);

  // Check authentication status on component mount
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const AsyncStorage =
          require("@react-native-async-storage/async-storage").default;
        const token = await AsyncStorage.getItem("accessToken");
        const userData = await AsyncStorage.getItem("user");

        if (token && userData) {
          setIsAuthenticated(true);
          setUserInfo(JSON.parse(userData));
          console.log("🔐 User is authenticated:", JSON.parse(userData));
        } else {
          setIsAuthenticated(false);
          console.log("👤 User is guest");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const updatePassenger = (
    index: number,
    field: keyof PassengerInfo,
    value: string
  ) => {
    const newPassengers = [...passengers];
    newPassengers[index] = { ...newPassengers[index], [field]: value };
    setPassengers(newPassengers);
  };

  const updateContactInfo = (
    field: keyof typeof contactInfo,
    value: string
  ) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Validate contact info (only for guest users)
    if (!isAuthenticated) {
      if (!contactInfo.name.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập tên người liên hệ");
        return false;
      }
      if (!contactInfo.phone.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập số điện thoại liên hệ");
        return false;
      }
    }

    // Validate passenger info
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      if (!passenger.name.trim()) {
        Alert.alert("Lỗi", `Vui lòng nhập tên hành khách ${i + 1}`);
        return false;
      }
      if (!passenger.phone.trim()) {
        Alert.alert("Lỗi", `Vui lòng nhập số điện thoại hành khách ${i + 1}`);
        return false;
      }
      if (!passenger.idNumber.trim()) {
        Alert.alert("Lỗi", `Vui lòng nhập CMND/CCCD hành khách ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleCreateBooking = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Step 1: Hold seats (create hold booking)
      const booking = await bookingService.createHold({
        tripId: trip._id,
        passengers: passengers.map((p, idx) => ({
          name: p.name.trim(),
          phone: p.phone.trim(),
          email: p.email.trim() || undefined,
          idNumber: p.idNumber.trim() || undefined,
          seatNumber: selectedSeats[idx],
        })),
        contactName: isAuthenticated ? userInfo.name : contactInfo.name.trim(),
        contactPhone: isAuthenticated
          ? userInfo.phone
          : contactInfo.phone.trim(),
        contactEmail: isAuthenticated
          ? userInfo.email
          : contactInfo.email.trim() || undefined,
      });

      const successMessage = isAuthenticated
        ? `Đặt vé thành công!\nMã đặt vé: ${booking._id}\nVui lòng thanh toán để hoàn tất đặt vé.\n\n💡 Là khách hàng thân thiết, bạn có thể xem lịch sử đặt vé trong tài khoản.`
        : `Đặt vé thành công!\nMã đặt vé: ${booking._id}\nVui lòng thanh toán để hoàn tất đặt vé.\n\n💡 Đăng ký tài khoản để được hưởng ưu đãi khách hàng thân thiết!`;

      Alert.alert("Đặt vé thành công!", successMessage, [
        {
          text: "Thanh toán ngay",
          onPress: () => handlePayment(booking._id),
        },
        {
          text: isAuthenticated ? "Xem vé của tôi" : "Đăng ký tài khoản",
          onPress: () => {
            if (isAuthenticated) {
              navigation.navigate("MyBookings" as never);
            } else {
              // Navigate to registration/login
              Alert.alert(
                "Đăng ký tài khoản",
                "Bạn có muốn đăng ký tài khoản để được hưởng ưu đãi khách hàng thân thiết không?",
                [
                  { text: "Để sau", style: "cancel" },
                  {
                    text: "Đăng ký ngay",
                    onPress: () => navigation.navigate("Login" as never),
                  },
                ]
              );
            }
          },
        },
      ]);
    } catch (error: any) {
      console.error("Error creating booking:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể đặt vé. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId: string) => {
    try {
      setLoading(true);
      // Step 2: Confirm payment (mock) to complete booking
      await bookingService.confirmPaymentMock(bookingId);
      Alert.alert(
        "Thanh toán thành công!",
        "Vé của bạn đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!",
        [
          {
            text: "Xem vé của tôi",
            onPress: () => navigation.navigate("MyBookings" as never),
          },
        ]
      );
    } catch (error: any) {
      console.error("Error processing payment:", error);
      Alert.alert("Lỗi", error.message || "Không thể xử lý thanh toán");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#1976d2", "#1565c0"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xác nhận đặt vé</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Summary */}
        <View style={styles.tripSummaryCard}>
          <Text style={styles.cardTitle}>Thông tin chuyến xe</Text>

          <View style={styles.routeInfo}>
            <View style={styles.locationItem}>
              <View style={styles.locationIcon}>
                <Ionicons name="location" size={16} color="#1976d2" />
              </View>
              <Text style={styles.locationText}>
                {trip.route?.fromLocationId?.name || trip.from || "Điểm đi"} →{" "}
                {trip.route?.toLocationId?.name || trip.to || "Điểm đến"}
              </Text>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ngày đi:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(trip.departureTime)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Giờ khởi hành:</Text>
                <Text style={styles.detailValue}>
                  {formatTime(trip.departureTime)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nhà xe:</Text>
                <Text style={styles.detailValue}>
                  {trip.companyId?.name || trip.company?.name || "Nhà xe"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ghế đã chọn:</Text>
                <Text style={styles.detailValue}>
                  {selectedSeats.join(", ")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.contactCard}>
          <Text style={styles.cardTitle}>
            {isAuthenticated
              ? "🔐 Thông tin tài khoản"
              : "👤 Thông tin liên hệ"}
          </Text>
          <Text style={styles.cardSubtitle}>
            {isAuthenticated
              ? "Thông tin từ tài khoản của bạn sẽ được sử dụng"
              : "Thông tin này sẽ được sử dụng để liên lạc về vé"}
          </Text>

          {/* Show user info if authenticated */}
          {isAuthenticated && userInfo && (
            <View style={styles.userInfoBox}>
              <View style={styles.userInfoRow}>
                <Ionicons name="person" size={16} color="#1976d2" />
                <Text style={styles.userInfoText}>{userInfo.name}</Text>
              </View>
              <View style={styles.userInfoRow}>
                <Ionicons name="call" size={16} color="#1976d2" />
                <Text style={styles.userInfoText}>{userInfo.phone}</Text>
              </View>
              {userInfo.email && (
                <View style={styles.userInfoRow}>
                  <Ionicons name="mail" size={16} color="#1976d2" />
                  <Text style={styles.userInfoText}>{userInfo.email}</Text>
                </View>
              )}
              <Text style={styles.userInfoNote}>
                ✅ Thông tin từ tài khoản của bạn
              </Text>
            </View>
          )}

          {/* Only show contact form for guest users */}
          {!isAuthenticated && (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên *</Text>
                <TextInput
                  style={styles.textInput}
                  value={contactInfo.name}
                  onChangeText={(text) => updateContactInfo("name", text)}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại *</Text>
                <TextInput
                  style={styles.textInput}
                  value={contactInfo.phone}
                  onChangeText={(text) => updateContactInfo("phone", text)}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={contactInfo.email}
                  onChangeText={(text) => updateContactInfo("email", text)}
                  placeholder="Nhập email (không bắt buộc)"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </>
          )}
        </View>

        {/* Passenger Information */}
        <View style={styles.passengersCard}>
          <Text style={styles.cardTitle}>
            Thông tin hành khách ({selectedSeats.length} người)
          </Text>
          <Text style={styles.cardSubtitle}>
            Vui lòng nhập đầy đủ thông tin cho từng hành khách
          </Text>

          {passengers.map((passenger, index) => (
            <View key={index} style={styles.passengerSection}>
              <Text style={styles.passengerTitle}>
                Hành khách {index + 1} - Ghế {selectedSeats[index]}
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Họ và tên *</Text>
                <TextInput
                  style={styles.textInput}
                  value={passenger.name}
                  onChangeText={(text) => updatePassenger(index, "name", text)}
                  placeholder="Nhập họ và tên"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số điện thoại *</Text>
                <TextInput
                  style={styles.textInput}
                  value={passenger.phone}
                  onChangeText={(text) => updatePassenger(index, "phone", text)}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CMND/CCCD *</Text>
                <TextInput
                  style={styles.textInput}
                  value={passenger.idNumber}
                  onChangeText={(text) =>
                    updatePassenger(index, "idNumber", text)
                  }
                  placeholder="Nhập số CMND/CCCD"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={passenger.email}
                  onChangeText={(text) => updatePassenger(index, "email", text)}
                  placeholder="Nhập email (không bắt buộc)"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <Text style={styles.cardTitle}>Tóm tắt giá</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Giá vé x {selectedSeats.length}:
            </Text>
            <Text style={styles.priceValue}>
              {formatPrice(trip.price * selectedSeats.length)}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí dịch vụ:</Text>
            <Text style={styles.priceValue}>{formatPrice(0)}</Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.termsCard}>
          <Text style={styles.cardTitle}>Điều khoản và điều kiện</Text>
          <Text style={styles.termsText}>
            Bằng việc đặt vé, bạn đồng ý với các điều khoản và điều kiện của
            chúng tôi. Vé đã đặt không thể hoàn lại hoặc thay đổi sau khi thanh
            toán.
          </Text>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            loading && styles.confirmButtonDisabled,
          ]}
          onPress={handleCreateBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="checkmark-circle" size={20} color="white" />
          )}
          <Text style={styles.confirmButtonText}>
            {loading ? "Đang xử lý..." : "Xác nhận đặt vé"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    flex: 1,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tripSummaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passengersCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  termsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },
  routeInfo: {
    marginBottom: 15,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  tripDetails: {
    marginLeft: 26,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  passengerSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e91e63",
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "monospace",
  },
  retryButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // User info styles
  userInfoBox: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#1976d2",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  },
  userInfoNote: {
    fontSize: 12,
    color: "#1976d2",
    marginTop: 8,
    fontStyle: "italic",
  },
});

export default BookingCheckoutScreen;

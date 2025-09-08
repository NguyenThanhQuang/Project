import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

interface Trip {
  id: string;
  company: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seats: number;
  vehicleType: string;
  amenities: string[];
  from: string;
  to: string;
  date: string;
  departureLocation: string;
  arrivalLocation: string;
}

type BookingRouteProp = RouteProp<
  {
    Booking: {
      trip: Trip;
      selectedSeats: number[];
      passengers: number;
    };
  },
  "Booking"
>;

interface PassengerInfo {
  name: string;
  phone: string;
  idCard: string;
}

const BookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<BookingRouteProp>();
  const { trip, selectedSeats, passengers } = route.params;

  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo[]>(
    Array(passengers)
      .fill(null)
      .map(() => ({
        name: "",
        phone: "",
        idCard: "",
      }))
  );

  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const totalPrice = trip.price * passengers;

  const handleInputChange = (
    index: number,
    field: keyof PassengerInfo,
    value: string
  ) => {
    const newPassengerInfo = [...passengerInfo];
    newPassengerInfo[index] = { ...newPassengerInfo[index], [field]: value };
    setPassengerInfo(newPassengerInfo);
  };

  const handleContactChange = (
    field: keyof typeof contactInfo,
    value: string
  ) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // Check passenger info
    for (let i = 0; i < passengers; i++) {
      const passenger = passengerInfo[i];
      if (
        !passenger.name.trim() ||
        !passenger.phone.trim() ||
        !passenger.idCard.trim()
      ) {
        Alert.alert(
          "Lỗi",
          `Vui lòng điền đầy đủ thông tin hành khách ${i + 1}`
        );
        return false;
      }
    }

    // Check contact info
    if (!contactInfo.name.trim() || !contactInfo.phone.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin liên hệ");
      return false;
    }

    return true;
  };

  const handleConfirmBooking = () => {
    if (!validateForm()) return;

    Alert.alert(
      "Xác nhận đặt vé",
      `Bạn có chắc chắn muốn đặt ${passengers} vé với tổng tiền ${totalPrice.toLocaleString(
        "vi-VN"
      )}đ?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => {
            // TODO: Call API to create booking
            Alert.alert(
              "Thành công!",
              "Vé đã được đặt thành công. Chúng tôi sẽ gửi thông tin chi tiết qua email.",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("MyBookings"),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#0077be", "#005a8b"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đặt vé</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Summary */}
        <View style={styles.tripSummary}>
          <Text style={styles.sectionTitle}>Thông tin chuyến xe</Text>
          <View style={styles.tripInfo}>
            <View style={styles.routeInfo}>
              <View style={styles.locationItem}>
                <Ionicons name="location" size={20} color="#0077be" />
                <Text style={styles.locationText}>{trip.from}</Text>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.locationItem}>
                <Ionicons name="location" size={20} color="#e74c3c" />
                <Text style={styles.locationText}>{trip.to}</Text>
              </View>
            </View>
            <View style={styles.tripDetails}>
              <Text style={styles.tripText}>Ngày: {trip.date}</Text>
              <Text style={styles.tripText}>
                Giờ khởi hành: {trip.departureTime}
              </Text>
              <Text style={styles.tripText}>Công ty: {trip.company}</Text>
              <Text style={styles.tripText}>
                Ghế đã chọn: {selectedSeats.join(", ")}
              </Text>
            </View>
          </View>
        </View>

        {/* Passenger Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin hành khách</Text>
          {passengerInfo.map((passenger, index) => (
            <View key={index} style={styles.passengerCard}>
              <Text style={styles.passengerTitle}>Hành khách {index + 1}</Text>
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={passenger.name}
                onChangeText={(value) =>
                  handleInputChange(index, "name", value)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={passenger.phone}
                onChangeText={(value) =>
                  handleInputChange(index, "phone", value)
                }
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="CMND/CCCD"
                value={passenger.idCard}
                onChangeText={(value) =>
                  handleInputChange(index, "idCard", value)
                }
              />
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          <View style={styles.contactCard}>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên người liên hệ"
              value={contactInfo.name}
              onChangeText={(value) => handleContactChange("name", value)}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={contactInfo.phone}
              onChangeText={(value) => handleContactChange("phone", value)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Email (không bắt buộc)"
              value={contactInfo.email}
              onChangeText={(value) => handleContactChange("email", value)}
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={styles.paymentCard}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "cash" && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <Ionicons
                name="cash"
                size={24}
                color={paymentMethod === "cash" ? "#0077be" : "#666"}
              />
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === "cash" && styles.paymentTextSelected,
                ]}
              >
                Thanh toán tiền mặt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "card" && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod("card")}
            >
              <Ionicons
                name="card"
                size={24}
                color={paymentMethod === "card" ? "#0077be" : "#666"}
              />
              <Text
                style={[
                  styles.paymentText,
                  paymentMethod === "card" && styles.paymentTextSelected,
                ]}
              >
                Thẻ tín dụng/ghi nợ
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.sectionTitle}>Tổng thanh toán</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giá vé x {passengers}</Text>
            <Text style={styles.priceValue}>
              {trip.price.toLocaleString("vi-VN")}đ
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí dịch vụ</Text>
            <Text style={styles.priceValue}>0đ</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {totalPrice.toLocaleString("vi-VN")}đ
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.confirmButtonText}>Xác nhận đặt vé</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafb",
  },
  header: {
    paddingTop: StatusBar.currentHeight,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  tripSummary: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a2332",
    marginBottom: 15,
  },
  tripInfo: {
    marginBottom: 15,
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#666",
  },
  routeLine: {
    width: 1,
    height: 20,
    backgroundColor: "#ccc",
    marginHorizontal: 10,
  },
  tripDetails: {
    marginTop: 10,
  },
  tripText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passengerCard: {
    marginBottom: 15,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a2332",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  contactCard: {
    marginBottom: 15,
  },
  paymentCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  paymentOption: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
  },
  paymentOptionSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "#0077be",
  },
  paymentText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  paymentTextSelected: {
    color: "#0077be",
    fontWeight: "bold",
  },
  priceSummary: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    color: "#666",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a2332",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a2332",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0077be",
  },
  confirmButton: {
    backgroundColor: "#0077be",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BookingScreen;

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Trip } from "../../types/index-types";

interface BookingSummaryProps {
  trip: Trip;
  selectedSeats: string[];
  totalAmount: number;
  onConfirm: () => void;
  loading?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  trip,
  selectedSeats,
  totalAmount,
  onConfirm,
  loading = false,
}) => {
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const seatPrice = trip.price;
  const seatsCount = selectedSeats.length;
  const subtotal = seatPrice * seatsCount;
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const finalTotal = subtotal + serviceFee;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tổng quan đặt vé</Text>

      {/* Trip Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin chuyến đi</Text>

        <View style={styles.tripInfo}>
          <View style={styles.routeInfo}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={20} color="#4CAF50" />
              <View style={styles.locationText}>
                <Text style={styles.locationName}>
                  {trip.route?.fromLocationId?.name || "Điểm đi"}
                </Text>
                <Text style={styles.locationProvince}>
                  {trip.route?.fromLocationId?.province}
                </Text>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-down" size={24} color="#666" />
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color="#F44336" />
              <View style={styles.locationText}>
                <Text style={styles.locationName}>
                  {trip.route?.toLocationId?.name || "Điểm đến"}
                </Text>
                <Text style={styles.locationProvince}>
                  {trip.route?.toLocationId?.province}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.detailLabel}>Giờ đi:</Text>
              <Text style={styles.detailValue}>
                {formatTime(trip.departureTime)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.detailLabel}>Giờ đến:</Text>
              <Text style={styles.detailValue}>
                {formatTime(trip.expectedArrivalTime)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.detailLabel}>Ngày đi:</Text>
              <Text style={styles.detailValue}>
                {formatDate(trip.departureTime)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="business" size={16} color="#666" />
              <Text style={styles.detailLabel}>Hãng xe:</Text>
              <Text style={styles.detailValue}>
                {trip.companyId?.name || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Seat Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ghế đã chọn</Text>

        <View style={styles.seatsContainer}>
          {selectedSeats.map((seatNumber) => (
            <View key={seatNumber} style={styles.seatItem}>
              <Ionicons name="car" size={16} color="#007AFF" />
              <Text style={styles.seatNumber}>Ghế {seatNumber}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.seatsCount}>Tổng cộng: {seatsCount} ghế</Text>
      </View>

      {/* Price Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết giá</Text>

        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giá vé/ghế:</Text>
            <Text style={styles.priceValue}>{formatPrice(seatPrice)}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Số ghế:</Text>
            <Text style={styles.priceValue}>{seatsCount}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí dịch vụ (5%):</Text>
            <Text style={styles.priceValue}>{formatPrice(serviceFee)}</Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
          </View>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
        onPress={onConfirm}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.confirmButtonText}>Đang xử lý...</Text>
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.confirmButtonText}>
              Xác nhận đặt vé ({formatPrice(finalTotal)})
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Terms */}
      <Text style={styles.terms}>
        Bằng việc nhấn "Xác nhận đặt vé", bạn đồng ý với các điều khoản và điều
        kiện của chúng tôi.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    margin: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  tripInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
  },
  routeInfo: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  locationProvince: {
    fontSize: 14,
    color: "#666",
  },
  arrowContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  tripDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  seatsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  seatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  seatNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginLeft: 6,
  },
  seatsCount: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
  priceBreakdown: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
    borderTopColor: "#ddd",
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
    fontWeight: "700",
    color: "#007AFF",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  terms: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default BookingSummary;

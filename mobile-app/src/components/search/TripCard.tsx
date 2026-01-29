import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Trip, TripCardProps } from "../../types/index-types";

const { width } = Dimensions.get("window");

const TripCard: React.FC<TripCardProps> = ({ trip, onPress, onBookNow }) => {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      case "completed":
        return "#2196F3";
      default:
        return "#FF9800";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(trip)}>
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Ionicons name="business" size={20} color="#007AFF" />
          <Text style={styles.companyName}>{trip.company?.name || "N/A"}</Text>
        </View>
        {trip.status && (
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(trip.status) },
            ]}
          >
            <Text style={styles.statusText}>{trip.status}</Text>
          </View>
        )}
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.locationRow}>
          <View style={styles.locationItem}>
            <Ionicons name="location" size={16} color="#4CAF50" />
            <Text style={styles.locationText}>
              {trip.route?.fromLocationId?.name || trip.from}
            </Text>
          </View>
          <View style={styles.locationItem}>
            <Ionicons name="location-outline" size={16} color="#F44336" />
            <Text style={styles.locationText}>
              {trip.route?.toLocationId?.name || trip.to}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.timeInfo}>
        <View style={styles.timeItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.timeLabel}>Giờ đi:</Text>
          <Text style={styles.timeText}>{formatTime(trip.departureTime)}</Text>
        </View>
        <View style={styles.timeItem}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.timeLabel}>Giờ đến:</Text>
          <Text style={styles.timeText}>{formatTime(trip.arrivalTime)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.seatsInfo}>
          <Ionicons name="car" size={16} color="#666" />
          <Text style={styles.seatsText}>{trip.availableSeats} ghế trống</Text>
        </View>

        <View style={styles.priceInfo}>
          <Text style={styles.priceLabel}>Giá vé:</Text>
          <Text style={styles.priceText}>{formatPrice(trip.price)}</Text>
        </View>
      </View>

      {onBookNow && (
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onBookNow(trip)}
        >
          <Ionicons name="bookmark" size={16} color="white" />
          <Text style={styles.bookButtonText}>Đặt ngay</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  routeInfo: {
    marginBottom: 16,
  },
  locationRow: {
    gap: 12,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  timeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    marginRight: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seatsInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007AFF",
  },
  bookButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default TripCard;

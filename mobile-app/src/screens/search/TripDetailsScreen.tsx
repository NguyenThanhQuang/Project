import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { bookingService } from "../../services/user/bookingService";
import type { Trip } from "../../types/index-types";

type TripDetailsRouteProp = RouteProp<
  {
    TripDetails: {
      trip: Trip;
    };
  },
  "TripDetails"
>;

interface Seat {
  _id: string;
  seatNumber: string;
  status: "available" | "booked" | "held" | "selected";
  price: number;
  isWindow?: boolean;
  isAisle?: boolean;
  row?: number;
  column?: number;
}

const { width } = Dimensions.get("window");

const TripDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<TripDetailsRouteProp>();
  const { trip } = route.params;

  // Validate trip data
  if (!trip) {
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

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [tripData, setTripData] = useState<Trip>(trip);

  useEffect(() => {
    // Ensure we have latest trip details including seat map and totalSeats
    const fetchDetails = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching trip details for:", trip._id);

        const full = await bookingService.getTripDetails(trip._id);
        console.log("✅ Trip details received:", full);

        // Update trip data with full details
        setTripData(full);

        // Generate seats if not available
        if (full.seats && full.seats.length > 0) {
          console.log("✅ Using seats from API:", full.seats.length, "seats");
          setSeats(full.seats as unknown as Seat[]);
        } else {
          // Generate mock seats based on vehicle capacity
          const totalSeats = full.vehicleId?.totalSeats || 45;
          console.log("🔄 Generating mock seats, total:", totalSeats);
          const mockSeats: Seat[] = [];

          for (let i = 1; i <= totalSeats; i++) {
            const row = Math.ceil(i / 4);
            const col = ((i - 1) % 4) + 1;
            const seatNumber = `${String.fromCharCode(64 + row)}${col}`; // A1, A2, A3, A4, B1, B2, etc.

            mockSeats.push({
              _id: `seat-${i}`,
              seatNumber,
              status: Math.random() > 0.3 ? "available" : "booked", // 70% available, 30% booked
              price: full.price || 0,
              isWindow: col === 1 || col === 4,
              isAisle: col === 2 || col === 3,
              row,
              column: col,
            } as unknown as Seat);
          }

          console.log("✅ Generated mock seats:", mockSeats.length);
          setSeats(mockSeats);
        }
      } catch (e) {
        console.error("❌ Error fetching trip details:", e);

        // Use original trip data as fallback
        console.log("🔄 Using original trip data as fallback");
        setTripData(trip);

        // Generate fallback seats
        const totalSeats = trip.vehicleId?.totalSeats || 45;
        console.log("🔄 Generating fallback seats, total:", totalSeats);
        const fallbackSeats: Seat[] = [];

        for (let i = 1; i <= totalSeats; i++) {
          const row = Math.ceil(i / 4);
          const col = ((i - 1) % 4) + 1;
          const seatNumber = `${String.fromCharCode(64 + row)}${col}`;

          fallbackSeats.push({
            _id: `fallback-seat-${i}`,
            seatNumber,
            status: Math.random() > 0.3 ? "available" : "booked", // 70% available, 30% booked
            price: trip.price || 0,
            isWindow: col === 1 || col === 4,
            isAisle: col === 2 || col === 3,
            row,
            column: col,
          } as unknown as Seat);
        }

        console.log("✅ Generated fallback seats:", fallbackSeats.length);
        setSeats(fallbackSeats);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [trip._id]);

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

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr.getTime() - dep.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleSeatSelect = (seatNumber: string) => {
    const seat = seats.find((s) => s.seatNumber === seatNumber);
    if (!seat || seat.status !== "available") return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const getSeatStatus = (seatNumber: string) => {
    const seat = seats.find((s) => s.seatNumber === seatNumber);
    if (!seat) return "available";
    return seat.status as any;
  };

  const getSeatStyle = (seatNumber: string) => {
    const status = getSeatStatus(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);

    if (isSelected) {
      return [styles.seat, styles.selectedSeat];
    }

    switch (status) {
      case "available":
        return [styles.seat, styles.availableSeat];
      case "booked":
        return [styles.seat, styles.bookedSeat];
      case "held":
        return [styles.seat, styles.heldSeat];
      default:
        return [styles.seat, styles.availableSeat];
    }
  };

  const getSeatTextStyle = (seatNumber: string) => {
    const status = getSeatStatus(seatNumber);
    const isSelected = selectedSeats.includes(seatNumber);

    if (isSelected) {
      return styles.selectedSeatText;
    }

    switch (status) {
      case "available":
        return styles.availableSeatText;
      case "booked":
        return styles.bookedSeatText;
      case "held":
        return styles.heldSeatText;
      default:
        return styles.availableSeatText;
    }
  };

  const handleContinueToBooking = () => {
    if (selectedSeats.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một ghế");
      return;
    }

    const totalAmount = selectedSeats.length * (tripData.price || 0);
    (navigation as any).navigate("BookingCheckout", {
      trip: tripData,
      selectedSeats,
      totalAmount,
    });
  };

  const renderSeatMap = () => {
    const seatsPerRow = 4;
    const rows = Math.ceil(seats.length / seatsPerRow);

    return (
      <View style={styles.seatMapContainer}>
        {/* Driver area */}
        <View style={styles.driverArea}>
          <Ionicons name="car" size={24} color="#666" />
          <Text style={styles.driverText}>Tài xế</Text>
        </View>

        {/* Seats */}
        <View style={styles.seatsContainer}>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <View key={rowIndex} style={styles.seatRow}>
              {Array.from({ length: seatsPerRow }, (_, colIndex) => {
                const seatIndex = rowIndex * seatsPerRow + colIndex;
                const seatObj = seats[seatIndex];
                if (!seatObj)
                  return <View key={colIndex} style={styles.emptySeat} />;
                const seatNumber = seatObj.seatNumber;
                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={getSeatStyle(seatNumber)}
                    onPress={() => handleSeatSelect(seatNumber)}
                    disabled={getSeatStatus(seatNumber) !== "available"}
                  >
                    <Text style={getSeatTextStyle(seatNumber)}>
                      {seatNumber}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.availableSeat]} />
            <Text style={styles.legendText}>Có sẵn</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.selectedSeat]} />
            <Text style={styles.legendText}>Đã chọn</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.bookedSeat]} />
            <Text style={styles.legendText}>Đã đặt</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.heldSeat]} />
            <Text style={styles.legendText}>Tạm giữ</Text>
          </View>
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>Chi tiết chuyến xe</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Info Card */}
        <View style={styles.tripInfoCard}>
          <View style={styles.routeHeader}>
            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <View style={styles.locationIcon}>
                  <Ionicons name="location" size={20} color="#1976d2" />
                </View>
                <View style={styles.locationText}>
                  <Text style={styles.locationName}>
                    {tripData.route?.fromLocationId?.name || "Điểm đi"}
                  </Text>
                  <Text style={styles.locationProvince}>
                    {tripData.route?.fromLocationId?.province || ""}
                  </Text>
                </View>
              </View>

              <View style={styles.routeLine}>
                <View style={styles.routeDot} />
                <View style={styles.routeLineInner} />
                <View style={styles.routeDot} />
              </View>

              <View style={styles.locationItem}>
                <View style={styles.locationIcon}>
                  <Ionicons name="location" size={20} color="#e91e63" />
                </View>
                <View style={styles.locationText}>
                  <Text style={styles.locationName}>
                    {tripData.route?.toLocationId?.name || "Điểm đến"}
                  </Text>
                  <Text style={styles.locationProvince}>
                    {tripData.route?.toLocationId?.province || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.detailLabel}>Khởi hành</Text>
                <Text style={styles.detailValue}>
                  {formatTime(
                    tripData.departureTime || new Date().toISOString()
                  )}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="time" size={20} color="#666" />
                <Text style={styles.detailLabel}>Đến nơi</Text>
                <Text style={styles.detailValue}>
                  {formatTime(
                    tripData.expectedArrivalTime || new Date().toISOString()
                  )}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="timer-outline" size={20} color="#666" />
                <Text style={styles.detailLabel}>Thời gian</Text>
                <Text style={styles.detailValue}>
                  {calculateDuration(
                    tripData.departureTime || new Date().toISOString(),
                    tripData.expectedArrivalTime || new Date().toISOString()
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.detailLabel}>Ngày đi</Text>
                <Text style={styles.detailValue}>
                  {formatDate(
                    tripData.departureTime || new Date().toISOString()
                  )}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="business" size={20} color="#666" />
                <Text style={styles.detailLabel}>Nhà xe</Text>
                <Text style={styles.detailValue}>
                  {tripData.companyId?.name || "Nhà xe"}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="car" size={20} color="#666" />
                <Text style={styles.detailLabel}>Loại xe</Text>
                <Text style={styles.detailValue}>
                  {tripData.vehicleId?.type || "Xe khách"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Giá vé:</Text>
            <Text style={styles.priceValue}>
              {formatPrice(tripData.price || 0)}
            </Text>
          </View>
        </View>

        {/* Seat Selection */}
        <View style={styles.seatSelectionCard}>
          <Text style={styles.cardTitle}>Chọn ghế ngồi</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1976d2" />
              <Text style={styles.loadingText}>Đang tải thông tin ghế...</Text>
            </View>
          ) : seats.length > 0 ? (
            renderSeatMap()
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#f44336" />
              <Text style={styles.errorText}>Không thể tải sơ đồ ghế</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  // Retry loading seats
                  const fetchDetails = async () => {
                    try {
                      setLoading(true);
                      const full = await bookingService.getTripDetails(
                        trip._id
                      );
                      setTripData(full);

                      if (full.seats && full.seats.length > 0) {
                        setSeats(full.seats as unknown as Seat[]);
                      } else {
                        const totalSeats = full.vehicleId?.totalSeats || 45;
                        const mockSeats: Seat[] = [];

                        for (let i = 1; i <= totalSeats; i++) {
                          const row = Math.ceil(i / 4);
                          const col = ((i - 1) % 4) + 1;
                          const seatNumber = `${String.fromCharCode(
                            64 + row
                          )}${col}`;

                          mockSeats.push({
                            _id: `seat-${i}`,
                            seatNumber,
                            status:
                              Math.random() > 0.3 ? "available" : "booked",
                            price: full.price || 0,
                            isWindow: col === 1 || col === 4,
                            isAisle: col === 2 || col === 3,
                            row,
                            column: col,
                          } as unknown as Seat);
                        }

                        setSeats(mockSeats);
                      }
                    } catch (e) {
                      console.error("Retry failed:", e);
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchDetails();
                }}
              >
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <View style={styles.selectionSummary}>
            <Text style={styles.summaryTitle}>
              Ghế đã chọn ({selectedSeats.length})
            </Text>
            <View style={styles.selectedSeatsList}>
              {selectedSeats.map((seatNumber) => (
                <View key={seatNumber} style={styles.selectedSeatTag}>
                  <Text style={styles.selectedSeatTagText}>{seatNumber}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.totalPrice}>
              Tổng tiền:{" "}
              {formatPrice(selectedSeats.length * (tripData.price || 0))}
            </Text>
          </View>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSeats.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinueToBooking}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Tiếp tục đặt vé ({selectedSeats.length} ghế)
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
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
  tripInfoCard: {
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
  routeHeader: {
    marginBottom: 20,
  },
  locationContainer: {
    alignItems: "center",
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f8ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  locationText: {
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
  routeLine: {
    alignItems: "center",
    marginVertical: 10,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#1976d2",
  },
  routeLineInner: {
    width: 2,
    height: 30,
    backgroundColor: "#1976d2",
    marginVertical: 5,
  },
  tripDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  priceLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e91e63",
  },
  seatMapContainer: {
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
  seatMapTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  driverArea: {
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  driverText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  seatsContainer: {
    marginBottom: 20,
  },
  seatRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  seat: {
    width: (width - 80) / 4 - 10,
    height: (width - 80) / 4 - 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  availableSeat: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4caf50",
  },
  selectedSeat: {
    backgroundColor: "#1976d2",
    borderColor: "#1976d2",
  },
  bookedSeat: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
  },
  heldSeat: {
    backgroundColor: "#fff3e0",
    borderColor: "#ff9800",
  },
  emptySeat: {
    width: (width - 80) / 4 - 10,
    height: (width - 80) / 4 - 10,
    marginHorizontal: 5,
  },
  availableSeatText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4caf50",
  },
  selectedSeatText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  bookedSeatText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#f44336",
  },
  heldSeatText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ff9800",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  seatSelectionCard: {
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
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  selectionSummary: {
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  selectedSeatsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  selectedSeatTag: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedSeatTagText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e91e63",
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#4caf50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
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
    marginBottom: 24,
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
});

export default TripDetailsScreen;

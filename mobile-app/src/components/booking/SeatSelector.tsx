import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
interface Seat {
  id: string;
  seatNumber: string;
  row: number;
  column: number;
  status: 'available' | 'booked' | 'selected';
  isSelected?: boolean;
}

interface SeatSelectorProps {
  seats: Seat[];
  onSeatSelect: (seatNumber: string) => void;
  onSeatDeselect: (seatNumber: string) => void;
  selectedSeats: string[];
  maxSeats?: number;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({
  seats,
  onSeatSelect,
  onSeatDeselect,
  selectedSeats,
  maxSeats = 10,
}) => {
  const [seatLayout, setSeatLayout] = useState<Seat[][]>([]);

  useEffect(() => {
    organizeSeats();
  }, [seats]);

  const organizeSeats = () => {
    // Organize seats into rows (assuming 4 seats per row)
    const rows: Seat[][] = [];
    const seatsPerRow = 4;
    
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      rows.push(seats.slice(i, i + seatsPerRow));
    }
    
    setSeatLayout(rows);
  };

  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'booked') {
      Alert.alert('Ghế đã được đặt', 'Ghế này đã được đặt bởi hành khách khác');
      return;
    }

    if (selectedSeats.includes(seat.seatNumber)) {
      onSeatDeselect(seat.seatNumber);
    } else {
      if (selectedSeats.length >= maxSeats) {
        Alert.alert('Giới hạn ghế', `Bạn chỉ có thể chọn tối đa ${maxSeats} ghế`);
        return;
      }
      onSeatSelect(seat.seatNumber);
    }
  };

  const getSeatStyle = (seat: Seat) => {
    if (seat.status === 'booked') {
      return [styles.seat, styles.seatBooked];
    }
    
    if (selectedSeats.includes(seat.seatNumber)) {
      return [styles.seat, styles.seatSelected];
    }
    
    return [styles.seat, styles.seatAvailable];
  };

  const getSeatIcon = (seat: Seat) => {
    if (seat.status === 'booked') {
      return 'close-circle';
    }
    
    if (selectedSeats.includes(seat.seatNumber)) {
      return 'checkmark-circle';
    }
    
    return 'ellipse-outline';
  };

  const getSeatIconColor = (seat: Seat) => {
    if (seat.status === 'booked') {
      return '#F44336';
    }
    
    if (selectedSeats.includes(seat.seatNumber)) {
      return '#4CAF50';
    }
    
    return '#666';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chọn ghế ngồi</Text>
        <Text style={styles.subtitle}>
          Đã chọn: {selectedSeats.length}/{maxSeats} ghế
        </Text>
      </View>

      {/* Seat Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatAvailable]} />
          <Text style={styles.legendText}>Có thể chọn</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatSelected]} />
          <Text style={styles.legendText}>Đã chọn</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatBooked]} />
          <Text style={styles.legendText}>Đã đặt</Text>
        </View>
      </View>

      {/* Driver Area */}
      <View style={styles.driverArea}>
        <Ionicons name="car" size={24} color="#666" />
        <Text style={styles.driverText}>Tài xế</Text>
      </View>

      {/* Seats Layout */}
      <ScrollView style={styles.seatsContainer} showsVerticalScrollIndicator={false}>
        {seatLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((seat, seatIndex) => (
              <TouchableOpacity
                key={seat.seatNumber}
                style={getSeatStyle(seat)}
                onPress={() => handleSeatPress(seat)}
                disabled={seat.status === 'booked'}
              >
                <Ionicons
                  name={getSeatIcon(seat)}
                  size={20}
                  color={getSeatIconColor(seat)}
                />
                <Text style={styles.seatNumber}>{seat.seatNumber}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Ghế đã chọn:</Text>
          <View style={styles.selectedSeatsList}>
            {selectedSeats.map((seatNumber) => (
              <View key={seatNumber} style={styles.selectedSeatItem}>
                <Text style={styles.selectedSeatNumber}>{seatNumber}</Text>
                <TouchableOpacity
                  onPress={() => onSeatDeselect(seatNumber)}
                  style={styles.removeSeatButton}
                >
                  <Ionicons name="close" size={16} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  legendItem: {
    alignItems: 'center',
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  driverArea: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  driverText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  seatsContainer: {
    maxHeight: 400,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  seat: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 2,
  },
  seatAvailable: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  seatSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  seatBooked: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  seatNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  summary: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  selectedSeatsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedSeatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedSeatNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 8,
  },
  removeSeatButton: {
    padding: 2,
  },
});

export default SeatSelector;

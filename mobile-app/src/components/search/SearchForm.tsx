import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SearchFormProps, Location } from "../../types/index-types";
import LocationPicker from "./LocationPicker";
import { mockLocations } from "../../data";

const SearchForm: React.FC<SearchFormProps> = ({
  formData,
  onFormChange,
  onSubmit,
  loading = false,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState<Date>(new Date());
  const [selectedFrom, setSelectedFrom] = useState<Location | null>(null);
  const [selectedTo, setSelectedTo] = useState<Location | null>(null);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<Location[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Location[]>([]);
  const [popularLocations, setPopularLocations] = useState<Location[]>([]);

  // Load popular locations on mount
  useEffect(() => {
    loadPopularLocations();
  }, []);

  const loadPopularLocations = async () => {
    try {
      const locations = mockLocations.slice(0, 10);
      setPopularLocations(locations);
    } catch (error) {
      console.error("Error loading popular locations:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    onFormChange(field, value);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateObj(selectedDate);
      const yyyy = selectedDate.getFullYear();
      const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const dd = String(selectedDate.getDate()).padStart(2, "0");
      handleInputChange("departureDate", `${yyyy}-${mm}-${dd}`);
    }
  };

  const handleFromQueryChange = async (query: string) => {
    setFromQuery(query);
    if (query.length >= 2) {
      try {
        const results = mockLocations.filter(
          (loc) =>
            loc.name.toLowerCase().includes(query.toLowerCase()) ||
            loc.province.toLowerCase().includes(query.toLowerCase())
        );
        setFromSuggestions(results);
        setShowFromSuggestions(true);
      } catch (error) {
        console.error("Error searching from locations:", error);
        setFromSuggestions([]);
      }
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  };

  const handleToQueryChange = async (query: string) => {
    setToQuery(query);
    if (query.length >= 2) {
      try {
        const results = mockLocations.filter(
          (loc) =>
            loc.name.toLowerCase().includes(query.toLowerCase()) ||
            loc.province.toLowerCase().includes(query.toLowerCase())
        );
        setToSuggestions(results);
        setShowToSuggestions(true);
      } catch (error) {
        console.error("Error searching to locations:", error);
        setToSuggestions([]);
      }
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const handleFromLocationSelect = (location: Location) => {
    setSelectedFrom(location);
    handleInputChange("from", location.name);
    setFromQuery(location.name);
    setShowFromSuggestions(false);
    console.log("📍 From location selected:", location);
  };

  const handleToLocationSelect = (location: Location) => {
    setSelectedTo(location);
    handleInputChange("to", location.name);
    setToQuery(location.name);
    setShowToSuggestions(false);
    console.log("📍 To location selected:", location);
  };

  const validateForm = () => {
    if (!selectedFrom) {
      Alert.alert("Lỗi", "Vui lòng chọn điểm đi");
      return false;
    }
    if (!selectedTo) {
      Alert.alert("Lỗi", "Vui lòng chọn điểm đến");
      return false;
    }
    if (
      (selectedFrom?.province || selectedFrom?.name) ===
      (selectedTo?.province || selectedTo?.name)
    ) {
      Alert.alert("Lỗi", "Điểm đi và điểm đến không được giống nhau");
      return false;
    }
    if (!formData.departureDate) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày đi");
      return false;
    }
    const passengers = parseInt(formData.passengers, 10);
    if (passengers < 1 || passengers > 10) {
      Alert.alert("Lỗi", "Số hành khách phải từ 1-10 người");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("✅ Form validated, submitting search...");
      onSubmit();
    }
  };

  return (
    <View style={styles.container}>
      {/* From Location */}
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.label}>Điểm đi</Text>
        </View>
        <LocationPicker
          value={formData.from}
          placeholder="Chọn điểm đi"
          onLocationSelect={handleFromLocationSelect}
          suggestions={fromSuggestions}
          showSuggestions={showFromSuggestions}
          onQueryChange={handleFromQueryChange}
          onFocus={() => setShowFromSuggestions(true)}
          onBlur={() => setShowFromSuggestions(false)}
        />
      </View>

      {/* To Location */}
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.label}>Điểm đến</Text>
        </View>
        <LocationPicker
          value={formData.to}
          placeholder="Chọn điểm đến"
          onLocationSelect={handleToLocationSelect}
          suggestions={toSuggestions}
          showSuggestions={showToSuggestions}
          onQueryChange={handleToQueryChange}
          onFocus={() => setShowToSuggestions(true)}
          onBlur={() => setShowToSuggestions(false)}
        />
      </View>

      {/* Date and Passengers Row */}
      <View style={styles.row}>
        {/* Departure Date */}
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <View style={styles.labelContainer}>
            <Ionicons name="calendar" size={20} color="#666" />
            <Text style={styles.label}>Ngày đi</Text>
          </View>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {formData.departureDate || "Chọn ngày"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Passengers */}
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <View style={styles.labelContainer}>
            <Ionicons name="people" size={20} color="#666" />
            <Text style={styles.label}>Số khách</Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.passengers}
              onValueChange={(value) => handleInputChange("passengers", value)}
              style={styles.picker}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Picker.Item
                  key={num}
                  label={num.toString()}
                  value={num.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity
        style={[styles.searchButton, loading && styles.searchButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <Text style={styles.searchButtonText}>Đang tìm...</Text>
        ) : (
          <>
            <Ionicons name="search" size={20} color="white" />
            <Text style={styles.searchButtonText}>Tìm chuyến đi</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={dateObj}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Debug Info (only in development) */}
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Info:</Text>
          <Text style={styles.debugText}>
            Selected From: {selectedFrom?.name || "None"}
          </Text>
          <Text style={styles.debugText}>
            Selected To: {selectedTo?.name || "None"}
          </Text>
          <Text style={styles.debugText}>
            From Suggestions: {fromSuggestions.length}
          </Text>
          <Text style={styles.debugText}>
            To Suggestions: {toSuggestions.length}
          </Text>
          <Text style={styles.debugText}>
            Popular Locations: {popularLocations.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
  },
  searchButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
  },
  searchButtonDisabled: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  debugContainer: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 6,
  },
  debugText: {
    fontSize: 10,
    color: "#888",
    marginBottom: 2,
  },
});

export default SearchForm;

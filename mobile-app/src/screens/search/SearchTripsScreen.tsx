import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SEARCH_STYLES } from "../../theme/screens/searchStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
  getPopularLocations,
  searchLocations,
  getLocationsByProvince,
} from "../../services/user/locationService";
import { bookingService } from "../../services/user/bookingService";
import { Location } from "../../services/user/locationService";
import apiService from "../../services/common/apiService";

const { width } = Dimensions.get("window");

interface Trip {
  _id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  expectedArrivalTime: string;
  price: number;
  availableSeats: number;
  company: {
    name: string;
  };
  seats?: any[];
  route?: {
    fromLocationId: { name: string; province: string };
    toLocationId: { name: string; province: string };
    stops: any[];
  };
  companyId?: { name: string; _id: string };
  vehicleId?: { type: string; totalSeats: number; _id: string };
  status?: string;
}

import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  SearchTrips: undefined;
  TripDetails: { trip: any };
  BookingCheckout: { trip: any; selectedSeats: string[]; totalAmount: number };
};

type SearchTripsScreenNavigationProp = any; // Use any for now to avoid type conflicts

const SearchTripsScreen: React.FC = () => {
  const navigation = useNavigation<SearchTripsScreenNavigationProp>();
  // State
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    passengers: "1",
  });
  const [dateObj, setDateObj] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState<Location | null>(null);
  const [selectedTo, setSelectedTo] = useState<Location | null>(null);
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<Location[]>([]);
  const [toSuggestions, setToSuggestions] = useState<Location[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [recentSearches, setRecentSearches] = useState<
    Array<{ from: string; to: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Popular cities for smart suggestions
  const popularCities = [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "Đà Lạt",
    "Nha Trang",
    "Vũng Tàu",
    "Phan Thiết",
    "Huế",
    "Quy Nhon",
    "Cà Mau",
    "Rạch Giá",
    "Long Xuyên",
    "Mỹ Tho",
    "Bến Tre",
    "Trà Vinh",
    "Sóc Trăng",
    "Bạc Liêu",
    "Cao Lãnh",
  ];

  // Refs
  const fromDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const toDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const loadLocations = async () => {
    try {
      setLoading(true);
      console.log("Loading locations...");

      // Use locationService instead of direct API call
      const locations = await getPopularLocations();
      console.log("Locations loaded:", locations);
      setLocations(locations || []);
    } catch (error) {
      console.error("Error loading locations:", error);
      // Fallback to comprehensive mock data if API fails
      const mockLocations = [
        // Bus Stations in Ho Chi Minh City
        {
          _id: "1",
          name: "Bến xe Miền Đông",
          province: "Hồ Chí Minh",
          type: "bus_station",
        } as Location,
        {
          _id: "2",
          name: "Bến xe Miền Tây",
          province: "Hồ Chí Minh",
          type: "bus_station",
        } as Location,
        {
          _id: "3",
          name: "Bến xe An Sương",
          province: "Hồ Chí Minh",
          type: "bus_station",
        } as Location,
        {
          _id: "4",
          name: "Bến xe Chợ Lớn",
          province: "Hồ Chí Minh",
          type: "bus_station",
        } as Location,
        {
          _id: "5",
          name: "Bến xe Sài Gòn",
          province: "Hồ Chí Minh",
          type: "bus_station",
        } as Location,

        // Bus Stations in Hanoi
        {
          _id: "6",
          name: "Bến xe Mỹ Đình",
          province: "Hà Nội",
          type: "bus_station",
        } as Location,
        {
          _id: "7",
          name: "Bến xe Giáp Bát",
          province: "Hà Nội",
          type: "bus_station",
        } as Location,
        {
          _id: "8",
          name: "Bến xe Nước Ngầm",
          province: "Hà Nội",
          type: "bus_station",
        } as Location,
        {
          _id: "9",
          name: "Bến xe Yên Nghĩa",
          province: "Hà Nội",
          type: "bus_station",
        } as Location,
        {
          _id: "10",
          name: "Bến xe Gia Lâm",
          province: "Hà Nội",
          type: "bus_station",
        } as Location,

        // Bus Stations in Da Nang
        {
          _id: "11",
          name: "Bến xe Trung tâm Đà Nẵng",
          province: "Đà Nẵng",
          type: "bus_station",
        } as Location,
        {
          _id: "12",
          name: "Bến xe Đà Nẵng",
          province: "Đà Nẵng",
          type: "bus_station",
        } as Location,

        // Bus Stations in other provinces
        {
          _id: "13",
          name: "Bến xe Nha Trang",
          province: "Khánh Hòa",
          type: "bus_station",
        } as Location,
        {
          _id: "14",
          name: "Bến xe Đà Lạt",
          province: "Lâm Đồng",
          type: "bus_station",
        } as Location,
        {
          _id: "15",
          name: "Bến xe Huế",
          province: "Thừa Thiên Huế",
          type: "bus_station",
        } as Location,
        {
          _id: "16",
          name: "Bến xe Vũng Tàu",
          province: "Bà Rịa - Vũng Tàu",
          type: "bus_station",
        } as Location,
        {
          _id: "17",
          name: "Bến xe Cần Thơ",
          province: "Cần Thơ",
          type: "bus_station",
        } as Location,
        {
          _id: "18",
          name: "Bến xe Long Xuyên",
          province: "An Giang",
          type: "bus_station",
        } as Location,
        {
          _id: "19",
          name: "Bến xe Rạch Giá",
          province: "Kiên Giang",
          type: "bus_station",
        } as Location,
        {
          _id: "20",
          name: "Bến xe Mỹ Tho",
          province: "Tiền Giang",
          type: "bus_station",
        } as Location,

        // Popular cities/towns
        {
          _id: "21",
          name: "Thành phố Hồ Chí Minh",
          province: "Hồ Chí Minh",
          type: "city",
        } as Location,
        {
          _id: "22",
          name: "Thành phố Hà Nội",
          province: "Hà Nội",
          type: "city",
        } as Location,
        {
          _id: "23",
          name: "Thành phố Đà Nẵng",
          province: "Đà Nẵng",
          type: "city",
        } as Location,
        {
          _id: "24",
          name: "Thành phố Nha Trang",
          province: "Khánh Hòa",
          type: "city",
        } as Location,
        {
          _id: "25",
          name: "Thành phố Đà Lạt",
          province: "Lâm Đồng",
          type: "city",
        } as Location,
        {
          _id: "26",
          name: "Thành phố Huế",
          province: "Thừa Thiên Huế",
          type: "city",
        } as Location,
        {
          _id: "27",
          name: "Thành phố Vũng Tàu",
          province: "Bà Rịa - Vũng Tàu",
          type: "city",
        } as Location,
        {
          _id: "28",
          name: "Thành phố Cần Thơ",
          province: "Cần Thơ",
          type: "city",
        } as Location,
        {
          _id: "29",
          name: "Thành phố Long Xuyên",
          province: "An Giang",
          type: "city",
        } as Location,
        {
          _id: "30",
          name: "Thành phố Rạch Giá",
          province: "Kiên Giang",
          type: "city",
        } as Location,
        {
          _id: "31",
          name: "Thành phố Mỹ Tho",
          province: "Tiền Giang",
          type: "city",
        } as Location,
        {
          _id: "32",
          name: "Thành phố Biên Hòa",
          province: "Đồng Nai",
          type: "city",
        } as Location,
        {
          _id: "33",
          name: "Thành phố Thủ Dầu Một",
          province: "Bình Dương",
          type: "city",
        } as Location,
        {
          _id: "34",
          name: "Thành phố Tân An",
          province: "Long An",
          type: "city",
        } as Location,
        {
          _id: "35",
          name: "Thành phố Cao Lãnh",
          province: "Đồng Tháp",
          type: "city",
        } as Location,
        {
          _id: "36",
          name: "Thành phố Sa Đéc",
          province: "Đồng Tháp",
          type: "city",
        } as Location,
        {
          _id: "37",
          name: "Thành phố Châu Đốc",
          province: "An Giang",
          type: "city",
        } as Location,
        {
          _id: "38",
          name: "Thành phố Hà Tiên",
          province: "Kiên Giang",
          type: "city",
        } as Location,
        {
          _id: "39",
          name: "Thành phố Phú Quốc",
          province: "Kiên Giang",
          type: "city",
        } as Location,
        {
          _id: "40",
          name: "Thành phố Bạc Liêu",
          province: "Bạc Liêu",
          type: "city",
        } as Location,
        {
          _id: "41",
          name: "Thành phố Sóc Trăng",
          province: "Sóc Trăng",
          type: "city",
        } as Location,
        {
          _id: "42",
          name: "Thành phố Trà Vinh",
          province: "Trà Vinh",
          type: "city",
        } as Location,
        {
          _id: "43",
          name: "Thành phố Bến Tre",
          province: "Bến Tre",
          type: "city",
        } as Location,
        {
          _id: "44",
          name: "Thành phố Vĩnh Long",
          province: "Vĩnh Long",
          type: "city",
        } as Location,
        {
          _id: "45",
          name: "Thành phố Tân Uyên",
          province: "Bình Dương",
          type: "city",
        } as Location,
        {
          _id: "46",
          name: "Thành phố Thuận An",
          province: "Bình Dương",
          type: "city",
        } as Location,
        {
          _id: "47",
          name: "Thành phố Dĩ An",
          province: "Bình Dương",
          type: "city",
        } as Location,
        {
          _id: "48",
          name: "Thành phố Long Khánh",
          province: "Đồng Nai",
          type: "city",
        } as Location,
        {
          _id: "49",
          name: "Thành phố Xuân Lộc",
          province: "Đồng Nai",
          type: "city",
        } as Location,
        {
          _id: "50",
          name: "Thành phố Long Thành",
          province: "Đồng Nai",
          type: "city",
        } as Location,
      ];
      setLocations(mockLocations);
      Alert.alert("Thông báo", "Sử dụng dữ liệu mẫu do không thể kết nối API");
    } finally {
      setLoading(false);
    }
  };

  const initDefaults = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    handleInputChange("departureDate", `${yyyy}-${mm}-${dd}`);
    setDateObj(today);
  };

  const loadRecentSearches = async () => {
    try {
      const data = await AsyncStorage.getItem("recentTripSearches");
      if (data) {
        setRecentSearches(JSON.parse(data));
      }
    } catch (e) {
      // ignore
    }
  };

  const saveRecentSearch = async (from: string, to: string) => {
    try {
      const next = [
        { from, to },
        ...recentSearches.filter((s) => !(s.from === from && s.to === to)),
      ].slice(0, 5);
      setRecentSearches(next);
      await AsyncStorage.setItem("recentTripSearches", JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const searchLocation = async (q: string) => {
    const query = (q || "").trim();

    // If no query, return popular cities
    if (query.length < 1) {
      return popularCities.slice(0, 8).map((city, index) => ({
        _id: `popular-${index}`,
        name: city,
        province: city,
        type: "city" as const,
        fullAddress: city,
        location: { type: "Point" as const, coordinates: [0, 0] },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: city.toLowerCase().replace(/\s+/g, "-"),
      }));
    }

    try {
      // 1) Try province-first: if user types a province (e.g., "Hồ Chí Minh"),
      // return all locations in that province so users can pick any station in it.
      if (query.length >= 2) {
        const byProvince = await getLocationsByProvince(query);
        if (Array.isArray(byProvince) && byProvince.length > 0) {
          // Prefer bus stations first, then cities
          const stations = byProvince.filter((l) => l.type === "bus_station");
          const cities = byProvince.filter((l) => l.type !== "bus_station");
          return [...stations, ...cities];
        }
      }

      // 2) Fallback to generic search by name/province substring
      const res = await searchLocations(query);
      if (Array.isArray(res) && res.length > 0) {
        return res;
      }

      // 3) If no API results, show popular cities that match
      const matchingCities = popularCities
        .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
        .map((city, index) => ({
          _id: `match-${index}`,
          name: city,
          province: city,
          type: "city" as const,
          fullAddress: city,
          location: { type: "Point" as const, coordinates: [0, 0] },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          slug: city.toLowerCase().replace(/\s+/g, "-"),
        }));

      return matchingCities;
    } catch (e) {
      console.error("Error in searchLocation:", e);
      // Fallback to popular cities
      return popularCities.slice(0, 5).map((city, index) => ({
        _id: `fallback-${index}`,
        name: city,
        province: city,
        type: "city" as const,
        fullAddress: city,
        location: { type: "Point" as const, coordinates: [0, 0] },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        slug: city.toLowerCase().replace(/\s+/g, "-"),
      }));
    }
  };

  useEffect(() => {
    loadLocations();
    initDefaults();
    loadRecentSearches();
  }, []);

  useEffect(() => {
    if (fromDebounceRef.current) clearTimeout(fromDebounceRef.current);
    if (!showFromSuggestions) return;
    fromDebounceRef.current = setTimeout(async () => {
      const results = await searchLocation(fromQuery);
      setFromSuggestions(results);
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromQuery, showFromSuggestions]);

  useEffect(() => {
    if (toDebounceRef.current) clearTimeout(toDebounceRef.current);
    if (!showToSuggestions) return;
    toDebounceRef.current = setTimeout(async () => {
      const results = await searchLocation(toQuery);
      setToSuggestions(results);
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toQuery, showToSuggestions]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    // Validate YYYY-MM-DD format
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRe.test(formData.departureDate)) {
      Alert.alert(
        "Lỗi",
        "Định dạng ngày đi phải là YYYY-MM-DD (VD: 2025-08-20)"
      );
      return false;
    }
    const d = new Date(formData.departureDate);
    if (isNaN(d.getTime())) {
      Alert.alert("Lỗi", "Ngày đi không hợp lệ");
      return false;
    }
    const passengers = parseInt(formData.passengers, 10);
    if (passengers < 1 || passengers > 10) {
      Alert.alert("Lỗi", "Số hành khách phải từ 1-10 người");
      return false;
    }
    return true;
  };

  const handleSearchTrips = async () => {
    if (!validateForm()) return;

    try {
      setSearching(true);
      setError(null); // Clear any previous errors

      console.log("Searching trips with params:", {
        from: selectedFrom?.province || selectedFrom?.name,
        to: selectedTo?.province || selectedTo?.name,
        date: formData.departureDate,
        passengers: formData.passengers,
      });

      const from = selectedFrom?.province || selectedFrom?.name || "";
      const to = selectedTo?.province || selectedTo?.name || "";

      // Test API connectivity first
      try {
        const testResponse = await apiService.get("/health");
        console.log("API connectivity test successful:", testResponse.data);
      } catch (testError) {
        console.warn(
          "API connectivity test failed, but continuing with search:",
          testError
        );
      }

      const data = await bookingService.searchTrips({
        from,
        to,
        date: formData.departureDate,
        passengers: parseInt(formData.passengers, 10),
      });

      console.log("🔍 Raw data from bookingService:", data);
      console.log("🔍 Number of trips:", data.trips?.length || 0);

      // Transform the data to match our local Trip interface
      const transformedTrips: Trip[] = data.trips.map((trip: any) => ({
        _id: trip._id,
        from:
          trip.from ||
          trip.route?.fromLocationId?.name ||
          trip.route?.fromLocationId?.province ||
          "",
        to:
          trip.to ||
          trip.route?.toLocationId?.name ||
          trip.route?.toLocationId?.province ||
          "",
        departureTime: trip.departureTime,
        arrivalTime: trip.expectedArrivalTime,
        expectedArrivalTime: trip.expectedArrivalTime,
        price: trip.price,
        availableSeats:
          trip.availableSeats ||
          trip.seats?.filter((s: any) => s.status === "available").length ||
          0,
        company: trip.company || trip.companyId || { name: "Unknown Company" },
        seats: trip.seats || [],
      }));

      console.log("🔍 Transformed trips:", transformedTrips);
      console.log("🔍 Number of transformed trips:", transformedTrips.length);

      setTrips(transformedTrips);

      // Check if we're using offline data
      if (data.trips.some((trip: any) => trip._id?.startsWith("mock_"))) {
        Alert.alert(
          "Chế Độ Offline",
          "Đang sử dụng dữ liệu mẫu do không thể kết nối API. Một số tính năng có thể bị hạn chế.",
          [
            { text: "Thử lại", onPress: () => handleSearchTrips() },
            { text: "Tiếp tục", style: "cancel" },
          ]
        );
      } else if (transformedTrips.length === 0) {
        Alert.alert("Thông báo", "Không tìm thấy chuyến xe phù hợp");
      }

      if (from && to) {
        saveRecentSearch(from, to);
      }
    } catch (error: any) {
      console.error("Error searching trips:", error);

      // Provide more specific error messages
      let errorMessage = "Không thể tìm kiếm chuyến xe";

      if (error.message?.includes("Network Error")) {
        errorMessage =
          "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.";

        // Show mock data when network fails
        const mockTrips = generateMockTrips(
          selectedFrom?.province || selectedFrom?.name || "",
          selectedTo?.province || selectedTo?.name || "",
          formData.departureDate
        );
        setTrips(mockTrips);

        Alert.alert(
          "Thông báo",
          "Đang sử dụng dữ liệu mẫu do lỗi kết nối mạng",
          [
            { text: "Thử lại", onPress: () => handleSearchTrips() },
            { text: "Sử dụng dữ liệu mẫu", onPress: () => {} },
          ]
        );
        return;
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Yêu cầu quá thời gian chờ. Vui lòng thử lại.";
      } else if (error.message?.includes("ECONNREFUSED")) {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.";
      } else if (error.response?.status === 404) {
        errorMessage =
          "Không tìm thấy chuyến xe phù hợp với tiêu chí tìm kiếm.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);

      Alert.alert("Lỗi Tìm Kiếm", errorMessage, [
        { text: "Thử lại", onPress: () => handleSearchTrips() },
        { text: "Hủy", style: "cancel" },
      ]);
    } finally {
      setSearching(false);
    }
  };

  // Generate mock trips when API is not available
  const generateMockTrips = (
    from: string,
    to: string,
    date: string
  ): Trip[] => {
    const mockTrips: Trip[] = [];
    const companies = [
      "Phương Trang",
      "Thành Bưởi",
      "Hoàng Long",
      "Mai Linh",
      "Sao Việt",
    ];

    // Generate 3-5 mock trips
    const numTrips = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < numTrips; i++) {
      const departureHour = 6 + i * 2; // 6AM, 8AM, 10AM, etc.
      const departureTime = `${date}T${String(departureHour).padStart(
        2,
        "0"
      )}:00:00`;
      const arrivalHour = departureHour + Math.floor(Math.random() * 4) + 2; // 2-5 hours later
      const arrivalTime = `${date}T${String(arrivalHour).padStart(
        2,
        "0"
      )}:00:00`;

      mockTrips.push({
        _id: `mock_${i}`,
        from: from || "Hồ Chí Minh",
        to: to || "Hà Nội",
        departureTime,
        arrivalTime,
        expectedArrivalTime: arrivalTime,
        price: Math.floor(Math.random() * 300000) + 200000, // 200k - 500k
        availableSeats: Math.floor(Math.random() * 20) + 10, // 10-30 seats
        company: { name: companies[i % companies.length] },
        seats: [],
        status: "active",
      });
    }

    return mockTrips;
  };

  const handleSelectFrom = (loc: Location) => {
    setSelectedFrom(loc);
    setFromQuery(`${loc.name}, ${loc.province}`);
    setShowFromSuggestions(false);
  };

  const handleSelectTo = (loc: Location) => {
    setSelectedTo(loc);
    setToQuery(`${loc.name}, ${loc.province}`);
    setShowToSuggestions(false);
  };

  const swapDirections = () => {
    const prevFrom = selectedFrom;
    const prevTo = selectedTo;
    setSelectedFrom(prevTo);
    setSelectedTo(prevFrom);
    setFromQuery(
      prevTo
        ? `${prevTo.name || prevTo.province}, ${prevTo.province || ""}`.replace(
            /, $/,
            ""
          )
        : ""
    );
    setToQuery(
      prevFrom
        ? `${prevFrom.name || prevFrom.province}, ${
            prevFrom.province || ""
          }`.replace(/, $/, "")
        : ""
    );
  };

  const getSeatStatus = (seatNumber: string, tripSeats?: any[]) => {
    if (!tripSeats) return "available";
    const seat = tripSeats.find((s: any) => s.seatNumber === seatNumber);
    if (!seat) return "available";
    return seat.status;
  };

  const handleSeatSelect = (seatNumber: string, tripSeats?: any[]) => {
    if (!tripSeats) return;
    const seat = tripSeats.find((s: any) => s.seatNumber === seatNumber);
    if (!seat || seat.status !== "available") return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
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

  const handleBookTrip = (trip: Trip) => {
    // Check if this is a mock trip
    if (trip._id.startsWith("mock_")) {
      Alert.alert(
        "Chế Độ Demo",
        "Đây là dữ liệu mẫu. Bạn có thể xem giao diện đặt vé nhưng không thể thực hiện giao dịch thật.",
        [
          {
            text: "Xem giao diện đặt vé",
            onPress: () => {
              // Navigate to booking screen with mock data
              navigation.navigate("TripDetails", { trip });
            },
          },
          { text: "Hủy", style: "cancel" },
        ]
      );
      return;
    }

    // Real trip - proceed normally
    navigation.navigate("TripDetails", { trip });
  };

  // Safe navigation helper
  const safeNavigate = (routeName: string, params?: any) => {
    try {
      if (navigation && navigation.navigate) {
        navigation.navigate(routeName as any, params);
      } else {
        console.error("Navigation not available");
        Alert.alert("Lỗi", "Không thể chuyển trang. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Lỗi", "Không thể chuyển trang. Vui lòng thử lại.");
    }
  };

  const handleTripSelect = (trip: Trip) => {
    // Ensure trip has all required properties before navigation
    const enrichedTrip = {
      ...trip,
      route: trip.route || {
        fromLocationId: { name: trip.from || "Điểm đi", province: "" },
        toLocationId: { name: trip.to || "Điểm đến", province: "" },
        stops: [],
      },
      companyId: trip.company || { name: "Nhà xe", _id: "default" },
      vehicleId: {
        type: "Xe khách",
        totalSeats: trip.availableSeats || 45,
        _id: "default",
      },
      seats: trip.seats || [],
      price: trip.price || 0,
      departureTime: trip.departureTime || new Date().toISOString(),
      expectedArrivalTime: trip.expectedArrivalTime || new Date().toISOString(),
      availableSeats: trip.availableSeats || 0,
      status: "scheduled",
    };

    console.log("Navigating to TripDetails with trip:", enrichedTrip);

    // Use the safe navigation helper
    safeNavigate("TripDetails", { trip: enrichedTrip });
  };

  const handleQuickBook = (trip: Trip) => {
    // Quick booking - directly go to checkout with default seat selection
    console.log("handleQuickBook called with trip:", trip);

    const enrichedTrip = {
      ...trip,
      route: trip.route || {
        fromLocationId: { name: trip.from || "Điểm đi", province: "" },
        toLocationId: { name: trip.to || "Điểm đến", province: "" },
        stops: [],
      },
      companyId: trip.company || { name: "Nhà xe", _id: "default" },
      vehicleId: {
        type: "Xe khách",
        totalSeats: trip.availableSeats || 45,
        _id: "default",
      },
      seats: trip.seats || [],
      price: trip.price || 0,
      departureTime: trip.departureTime || new Date().toISOString(),
      expectedArrivalTime: trip.expectedArrivalTime || new Date().toISOString(),
      availableSeats: trip.availableSeats || 0,
      status: "scheduled",
    };

    console.log("Enriched trip data:", enrichedTrip);

    // Select first available seat or default to A1
    const availableSeats =
      trip.seats?.filter((s: any) => s.status === "available") || [];
    const defaultSeats =
      availableSeats.length > 0 ? [availableSeats[0].seatNumber] : ["A1"];
    const totalAmount = defaultSeats.length * (enrichedTrip.price || 0);

    console.log("About to navigate with params:", {
      trip: enrichedTrip,
      selectedSeats: defaultSeats,
      totalAmount,
    });

    // Use the safe navigation helper
    safeNavigate("BookingCheckout", {
      trip: enrichedTrip,
      selectedSeats: defaultSeats,
      totalAmount,
    });
  };

  if (loading) {
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
            <Text style={styles.headerTitle}>Tìm kiếm chuyến xe</Text>
            <View style={styles.placeholder} />
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          <Text style={styles.loadingSubtext}>Vui lòng chờ trong giây lát</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Tìm kiếm chuyến xe</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={SEARCH_STYLES.recentSearchesSection}>
            <Text style={SEARCH_STYLES.recentSearchesTitle}>
              Tìm kiếm gần đây
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={SEARCH_STYLES.recentSearchesScroll}
            >
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={SEARCH_STYLES.recentSearchChip}
                  onPress={() => {
                    setFromQuery(search.from);
                    setToQuery(search.to);
                    // Set selected locations
                    const fromLocation = popularCities.find(
                      (city) => city === search.from
                    );
                    const toLocation = popularCities.find(
                      (city) => city === search.to
                    );
                    if (fromLocation) {
                      setSelectedFrom({
                        _id: `recent-from-${index}`,
                        name: fromLocation,
                        province: fromLocation,
                        type: "city",
                        fullAddress: fromLocation,
                        location: { type: "Point", coordinates: [0, 0] },
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        slug: fromLocation.toLowerCase().replace(/\s+/g, "-"),
                      });
                    }
                    if (toLocation) {
                      setSelectedTo({
                        _id: `recent-to-${index}`,
                        name: toLocation,
                        province: toLocation,
                        type: "city",
                        fullAddress: toLocation,
                        location: { type: "Point", coordinates: [0, 0] },
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        slug: toLocation.toLowerCase().replace(/\s+/g, "-"),
                      });
                    }
                  }}
                >
                  <Text style={SEARCH_STYLES.recentSearchText}>
                    {search.from} → {search.to}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Quick Search Buttons */}
        <View style={SEARCH_STYLES.quickSearchSection}>
          <Text style={SEARCH_STYLES.quickSearchTitle}>Tìm kiếm nhanh</Text>
          <View style={SEARCH_STYLES.quickSearchGrid}>
            <TouchableOpacity
              style={SEARCH_STYLES.quickSearchButton}
              onPress={() => {
                setFromQuery("Hà Nội");
                setToQuery("TP. Hồ Chí Minh");
                setSelectedFrom({
                  _id: "hn",
                  name: "Hà Nội",
                  province: "Hà Nội",
                  type: "city",
                  fullAddress: "Hà Nội",
                  location: { type: "Point", coordinates: [0, 0] },
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  slug: "ha-noi",
                });
                setSelectedTo({
                  _id: "hcm",
                  name: "TP. Hồ Chí Minh",
                  province: "TP. Hồ Chí Minh",
                  type: "city",
                  fullAddress: "TP. Hồ Chí Minh",
                  location: { type: "Point", coordinates: [0, 0] },
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  slug: "tp-ho-chi-minh",
                });
              }}
            >
              <Text style={SEARCH_STYLES.quickSearchText}>Hà Nội → TP.HCM</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={SEARCH_STYLES.quickSearchButton}
              onPress={() => {
                setFromQuery("TP. Hồ Chí Minh");
                setToQuery("Hà Nội");
                setSelectedFrom({
                  _id: "hcm",
                  name: "TP. Hồ Chí Minh",
                  province: "TP. Hồ Chí Minh",
                  type: "city",
                  fullAddress: "TP. Hồ Chí Minh",
                  location: { type: "Point", coordinates: [0, 0] },
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  slug: "tp-ho-chi-minh",
                });
                setSelectedTo({
                  _id: "hn",
                  name: "Hà Nội",
                  province: "Hà Nội",
                  type: "city",
                  fullAddress: "Hà Nội",
                  location: { type: "Point", coordinates: [0, 0] },
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  slug: "ha-noi",
                });
              }}
            >
              <Text style={SEARCH_STYLES.quickSearchText}>TP.HCM → Hà Nội</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={SEARCH_STYLES.quickSearchButton}
              onPress={() => {
                setFromQuery("Hà Nội");
                setToQuery("Đà Lạt");
                setSelectedFrom({
                  _id: "hn",
                  name: "Hà Nội",
                  province: "Hà Nội",
                  type: "city",
                  fullAddress: "Hà Nội",
                  location: { type: "Point", coordinates: [0, 0] },
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  slug: "ha-noi",
                });
                setSelectedTo({
                  _id: "dl",
                  name: "Đà Lạt",
                  province: "Lâm Đồng",
                  type: "city",
                  fullAddress: "Đà Lạt, Lâm Đồng",
                  location: { type: "Point", coordinates: [0, 0] },
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  slug: "da-lat",
                });
              }}
            >
              <Text style={SEARCH_STYLES.quickSearchText}>Hà Nội → Đà Lạt</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={SEARCH_STYLES.quickSearchButton}
              onPress={() => {
                setFromQuery("TP. Hồ Chí Minh");
                setToQuery("Nha Trang");
                setSelectedFrom({
                  _id: "hcm",
                  name: "TP. Hồ Chí Minh",
                  province: "TP. Hồ Chí Minh",
                  type: "city",
                  fullAddress: "TP. Hồ Chí Minh",
                  location: { type: "Point", coordinates: [0, 0] },
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  slug: "tp-ho-chi-minh",
                });
                setSelectedTo({
                  _id: "nt",
                  name: "Nha Trang",
                  province: "Khánh Hòa",
                  type: "city",
                  fullAddress: "Nha Trang, Khánh Hòa",
                  location: { type: "Point", coordinates: [0, 0] },
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  slug: "nha-trang",
                });
              }}
            >
              <Text style={SEARCH_STYLES.quickSearchText}>
                TP.HCM → Nha Trang
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Form */}
        <View style={styles.searchForm}>
          <Text style={styles.formTitle}>Tìm kiếm chi tiết</Text>

          {/* From Location (Smart search) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Điểm đi *</Text>
            <View style={styles.autocompleteContainer}>
              <TextInput
                style={styles.textInput}
                value={fromQuery}
                onChangeText={(t) => {
                  setFromQuery(t);
                  setShowFromSuggestions(true);
                  setSelectedFrom(null);
                }}
                placeholder="Nhập tên thành phố (VD: Hà Nội, TP.HCM)"
                placeholderTextColor="#999"
                onFocus={() => setShowFromSuggestions(true)}
              />
            </View>
            {/* From suggestions */}
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {fromSuggestions.map((loc) => (
                  <TouchableOpacity
                    key={loc._id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectFrom(loc)}
                  >
                    <View style={styles.suggestionContent}>
                      <View style={styles.suggestionIcon}>
                        <Ionicons
                          name={loc.type === "bus_station" ? "bus" : "location"}
                          size={16}
                          color={
                            loc.type === "bus_station" ? "#1976d2" : "#4caf50"
                          }
                        />
                      </View>
                      <View style={styles.suggestionContent}>
                        <Text style={styles.suggestionName}>{loc.name}</Text>
                        <Text style={styles.suggestionProvince}>
                          {loc.province}
                        </Text>
                        {loc.type === "bus_station" && (
                          <Text style={styles.suggestionType}>Nhà xe</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* To suggestions */}
            {showToSuggestions && toSuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {toSuggestions.map((loc) => (
                  <TouchableOpacity
                    key={loc._id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelectTo(loc)}
                  >
                    <View style={styles.suggestionContent}>
                      <View style={styles.suggestionIcon}>
                        <Ionicons
                          name={loc.type === "bus_station" ? "bus" : "location"}
                          size={16}
                          color={
                            loc.type === "bus_station" ? "#1976d2" : "#4caf50"
                          }
                        />
                      </View>
                      <View style={styles.suggestionContent}>
                        <Text style={styles.suggestionName}>{loc.name}</Text>
                        <Text style={styles.suggestionProvince}>
                          {loc.province}
                        </Text>
                        {loc.type === "bus_station" && (
                          <Text style={styles.suggestionType}>Nhà xe</Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Swap button */}
          <View style={styles.swapWrapper}>
            <TouchableOpacity
              style={styles.swapButton}
              onPress={swapDirections}
            >
              <Ionicons name="swap-vertical" size={18} color="#1976d2" />
              <Text style={styles.swapText}>Đổi chiều</Text>
            </TouchableOpacity>
          </View>

          {/* To Location (Smart search) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Điểm đến *</Text>
            <View style={styles.autocompleteContainer}>
              <TextInput
                style={styles.textInput}
                value={toQuery}
                onChangeText={(t) => {
                  setToQuery(t);
                  setShowToSuggestions(true);
                  setSelectedTo(null);
                }}
                placeholder="Nhập tên thành phố (VD: TP.HCM, Đà Lạt)"
                placeholderTextColor="#999"
                onFocus={() => setShowToSuggestions(true)}
              />
            </View>
          </View>

          {/* Departure Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ngày đi *</Text>
            <View style={styles.dateRow}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                value={formData.departureDate}
                editable={false}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.calendarButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar" size={18} color="#1976d2" />
                <Text style={styles.calendarText}>Chọn</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={dateObj || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                    const yyyy = selectedDate.getFullYear();
                    const mm = String(selectedDate.getMonth() + 1).padStart(
                      2,
                      "0"
                    );
                    const dd = String(selectedDate.getDate()).padStart(2, "0");
                    const dateStr = `${yyyy}-${mm}-${dd}`;
                    setDateObj(selectedDate);
                    handleInputChange("departureDate", dateStr);
                  }
                }}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Quick provinces (popular) */}
          {locations.length > 0 && (
            <View style={styles.quickRow}>
              <Text style={styles.quickLabel}>Tỉnh phổ biến:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickChipsScroll}
              >
                {Array.from(new Set(locations.map((l) => l.province))).map(
                  (prov) => (
                    <TouchableOpacity
                      key={prov}
                      style={styles.chip}
                      onPress={() => {
                        if (!selectedFrom) {
                          const fakeLoc: Location = {
                            _id: prov,
                            name: prov,
                            province: prov,
                            type: "city",
                            fullAddress: prov,
                            location: { type: "Point", coordinates: [0, 0] },
                            isActive: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            slug: prov.toLowerCase().replace(/\s+/g, "-"),
                          };
                          handleSelectFrom(fakeLoc);
                        } else {
                          const fakeLoc: Location = {
                            _id: prov,
                            name: prov,
                            province: prov,
                            type: "city",
                            fullAddress: prov,
                            location: { type: "Point", coordinates: [0, 0] },
                            isActive: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            slug: prov.toLowerCase().replace(/\s+/g, "-"),
                          };
                          handleSelectTo(fakeLoc);
                        }
                      }}
                    >
                      <Text style={styles.chipText}>{prov}</Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>
            </View>
          )}

          {/* Popular bus stations */}
          {locations.filter((l) => l.type === "bus_station").length > 0 && (
            <View style={styles.quickRow}>
              <Text style={styles.quickLabel}>Nhà xe phổ biến:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickChipsScroll}
              >
                {locations
                  .filter((l) => l.type === "bus_station")
                  .map((station) => (
                    <TouchableOpacity
                      key={station._id}
                      style={[styles.chip, styles.busStationChip]}
                      onPress={() => {
                        if (!selectedFrom) {
                          handleSelectFrom(station);
                        } else {
                          handleSelectTo(station);
                        }
                      }}
                    >
                      <Text style={styles.chipText}>{station.name}</Text>
                      <Text style={styles.chipSubText}>{station.province}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}

          {/* Popular cities */}
          {locations.filter((l) => l.type === "city").length > 0 && (
            <View style={styles.quickRow}>
              <Text style={styles.quickLabel}>Thành phố phổ biến:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quickChipsScroll}
              >
                {locations
                  .filter((l) => l.type === "city")
                  .map((city) => (
                    <TouchableOpacity
                      key={city._id}
                      style={[styles.chip, styles.cityChip]}
                      onPress={() => {
                        if (!selectedFrom) {
                          handleSelectFrom(city);
                        } else {
                          handleSelectTo(city);
                        }
                      }}
                    >
                      <Text style={styles.chipText}>{city.name}</Text>
                      <Text style={styles.chipSubText}>{city.province}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <View style={styles.quickRow}>
              <Text style={styles.quickLabel}>Tìm kiếm gần đây:</Text>
              <View style={styles.quickChips}>
                {recentSearches.map((s, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.chip}
                    onPress={() => {
                      const f: Location = {
                        _id: s.from,
                        name: s.from,
                        province: s.from,
                        type: "city",
                        fullAddress: s.from,
                        location: { type: "Point", coordinates: [0, 0] },
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        slug: s.from.toLowerCase().replace(/\s+/g, "-"),
                      };
                      const t: Location = {
                        _id: s.to,
                        name: s.to,
                        province: s.to,
                        type: "city",
                        fullAddress: s.to,
                        location: { type: "Point", coordinates: [0, 0] },
                        isActive: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        slug: s.to.toLowerCase().replace(/\s+/g, "-"),
                      };
                      handleSelectFrom(f);
                      handleSelectTo(t);
                    }}
                  >
                    <Text style={styles.chipText}>
                      {s.from} → {s.to}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Passengers */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số hành khách</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.passengers}
                onValueChange={(value) =>
                  handleInputChange("passengers", value)
                }
                style={styles.picker}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <Picker.Item key={num} label={`${num} người`} value={num} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearchTrips}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="search" size={20} color="white" />
            )}
            <Text style={styles.searchButtonText}>
              {searching ? "Đang tìm kiếm..." : "Tìm kiếm chuyến xe"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Results */}
        {trips.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              Kết quả tìm kiếm ({trips.length} chuyến xe)
            </Text>

            {trips.map((trip, index) => (
              <TouchableOpacity
                key={trip._id}
                style={styles.tripCard}
                onPress={() => handleTripSelect(trip)}
              >
                <View style={styles.tripHeader}>
                  <View style={styles.routeInfo}>
                    <Text style={styles.tripCompany}>{trip.company.name}</Text>
                    <Text style={styles.tripRoute}>
                      {trip.from} → {trip.to}
                    </Text>
                    <Text style={styles.tripTime}>
                      Khởi hành: {formatTime(trip.departureTime)}
                    </Text>
                    <Text style={styles.tripTime}>
                      Đến nơi: {formatTime(trip.expectedArrivalTime)}
                    </Text>
                    <Text style={styles.tripDate}>
                      {formatDate(trip.departureTime)}
                    </Text>
                    <Text style={styles.tripSeats}>
                      Ghế trống: {trip.availableSeats}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>
                      {formatPrice(trip.price)}
                    </Text>
                    <Text style={styles.priceLabel}>/vé</Text>
                  </View>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      Khởi hành: {formatTime(trip.departureTime)}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      Đến nơi: {formatTime(trip.expectedArrivalTime)}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {formatDate(trip.departureTime)}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      Còn {trip.availableSeats} ghế trống
                    </Text>
                  </View>
                </View>

                <View style={styles.tripFooter}>
                  <View
                    style={[styles.statusBadge, { backgroundColor: "#4caf50" }]}
                  >
                    <Text style={styles.statusText}>Sẵn sàng</Text>
                  </View>

                  <View style={styles.tripActions}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => handleTripSelect(trip)}
                    >
                      <Text style={styles.viewButtonText}>Xem chi tiết</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => handleQuickBook(trip)}
                    >
                      <Text style={styles.bookButtonText}>Đặt vé</Text>
                      <Ionicons name="arrow-forward" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Results */}
        {trips.length === 0 && !searching && !error && (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={64} color="#ccc" />
            <Text style={styles.noResultsText}>
              Vui lòng nhập thông tin tìm kiếm để tìm chuyến xe
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && !searching && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color="#f44336" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleSearchTrips}
            >
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  searchForm: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
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
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  calendarText: {
    color: "#1976d2",
    fontWeight: "600",
    fontSize: 14,
  },
  autocompleteContainer: {
    position: "relative",
  },
  suggestionsPanel: {
    position: "absolute",
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 6,
    zIndex: 10,
  },

  swapWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  swapButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  swapText: {
    color: "#1976d2",
    fontSize: 13,
    fontWeight: "600",
  },
  quickRow: {
    marginBottom: 12,
  },
  quickLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  quickChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickChipsScroll: {
    alignItems: "center",
  },
  chip: {
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  chipSubText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  busStationChip: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  cityChip: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  searchButton: {
    backgroundColor: "#1976d2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  tripCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  routeInfo: {
    flex: 1,
  },
  tripCompany: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  tripTime: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  tripDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  tripSeats: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e91e63",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
  },
  tripDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  selectButton: {
    backgroundColor: "#4caf50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  noResults: {
    alignItems: "center",
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingVertical: 6,
    zIndex: 10,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  suggestionIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  suggestionProvince: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  suggestionType: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  selectedLocationContainer: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  selectedLocationContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedLocationIcon: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "white",
    marginRight: 10,
  },
  selectedLocationText: {
    flex: 1,
  },
  selectedLocationName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  selectedLocationProvince: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  selectedLocationType: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  clearButton: {
    padding: 5,
  },

  // Trip actions styles
  tripActions: {
    flexDirection: "row",
    gap: 8,
  },
  viewButton: {
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#0077be",
  },
  viewButtonText: {
    color: "#0077be",
    fontSize: 12,
    fontWeight: "600",
  },
  bookButton: {
    backgroundColor: "#0077be",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bookButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff3cd",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ffeeba",
  },
  errorText: {
    color: "#856404",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Quick Search Styles
  quickSearchSection: {
    backgroundColor: "white",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickSearchTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  quickSearchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickSearchButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  quickSearchText: {
    fontSize: 14,
    color: "#495057",
    fontWeight: "500",
  },
  // Recent Searches Styles
  recentSearchesSection: {
    backgroundColor: "white",
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  recentSearchesScroll: {
    paddingRight: 16,
  },
  recentSearchChip: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#bbdefb",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  recentSearchText: {
    fontSize: 13,
    color: "#1976d2",
    fontWeight: "500",
  },
});

export default SearchTripsScreen;

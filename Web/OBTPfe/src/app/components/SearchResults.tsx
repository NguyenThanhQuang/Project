import { useState } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Snowflake,
  Monitor,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface SearchResultsProps {
  onBack: () => void;
  onTripSelect: (tripId: string) => void;
}

interface Trip {
  id: string;
  companyName: string;
  companyLogo: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  from: string;
  to: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  busType: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
}

const mockTrips: Trip[] = [
  {
    id: "1",
    companyName: "Phương Trang",
    companyLogo: "🚌",
    departureTime: "05:00",
    arrivalTime: "12:30",
    duration: "7h 30m",
    from: "TP. Hồ Chí Minh",
    to: "Đà Lạt",
    price: 250000,
    availableSeats: 15,
    totalSeats: 40,
    busType: "Giường nằm",
    rating: 4.8,
    reviewCount: 234,
    amenities: ["wifi", "coffee", "ac", "tv"],
  },
  {
    id: "2",
    companyName: "Thành Bưởi",
    companyLogo: "🚍",
    departureTime: "06:30",
    arrivalTime: "14:00",
    duration: "7h 30m",
    from: "TP. Hồ Chí Minh",
    to: "Đà Lạt",
    price: 230000,
    availableSeats: 8,
    totalSeats: 40,
    busType: "Giường nằm",
    rating: 4.6,
    reviewCount: 189,
    amenities: ["wifi", "ac"],
  },
  {
    id: "3",
    companyName: "Hoa Mai",
    companyLogo: "🚐",
    departureTime: "14:00",
    arrivalTime: "21:30",
    duration: "7h 30m",
    from: "TP. Hồ Chí Minh",
    to: "Đà Lạt",
    price: 280000,
    availableSeats: 20,
    totalSeats: 40,
    busType: "Giường nằm VIP",
    rating: 4.9,
    reviewCount: 312,
    amenities: ["wifi", "coffee", "ac", "tv"],
  },
];

export function SearchResults({ onBack, onTripSelect }: SearchResultsProps) {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState<"price" | "time" | "duration">("time");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([]);

  const amenityIcons: { [key: string]: { icon: any; label: string } } = {
    wifi: { icon: Wifi, label: t("amenityWifi") },
    coffee: { icon: Coffee, label: t("amenityDrink") },
    ac: { icon: Snowflake, label: t("amenityAC") },
    tv: { icon: Monitor, label: t("amenityTV") },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const sortedTrips = [...mockTrips].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "time")
      return a.departureTime.localeCompare(b.departureTime);
    if (sortBy === "duration") return a.duration.localeCompare(b.duration);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-gray-900 dark:text-white">
              {t("searchResults")}
            </h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      TP.HCM → Đà Lạt
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      28/12/2024
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSortBy("time")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                sortBy === "time"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {t("sortByTime")}
            </button>
            <button
              onClick={() => setSortBy("price")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                sortBy === "price"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {t("sortByPrice")}
            </button>
            <button
              onClick={() => setSortBy("duration")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                sortBy === "duration"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {t("sortByDuration")}
            </button>
          </div>
        </div>
      </header>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            {t("foundTrips")}{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {sortedTrips.length} {t("tripsCount")}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          {sortedTrips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => onTripSelect(trip.id)}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              {/* Company Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center text-2xl">
                    {trip.companyLogo}
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white">
                      {trip.companyName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {trip.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        ({trip.reviewCount} {t("reviews")})
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl text-blue-600 dark:text-blue-400">
                    {formatPrice(trip.price)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {trip.availableSeats} {t("seatsAvailable")}
                  </div>
                </div>
              </div>

              {/* Time Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="text-2xl text-gray-900 dark:text-white mb-1">
                    {trip.departureTime}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {trip.from}
                  </div>
                </div>
                <div className="flex-1 px-4">
                  <div className="relative">
                    <div className="border-t-2 border-gray-300 dark:border-gray-600"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 dark:bg-gray-800 px-2">
                      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{trip.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-right">
                  <div className="text-2xl text-gray-900 dark:text-white mb-1">
                    {trip.arrivalTime}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {trip.to}
                  </div>
                </div>
              </div>

              {/* Bus Type & Amenities */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                    {trip.busType}
                  </span>
                  <div className="flex items-center space-x-2">
                    {trip.amenities.map((amenity) => {
                      const Icon = amenityIcons[amenity].icon;
                      return (
                        <div
                          key={amenity}
                          className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                          title={amenityIcons[amenity].label}
                        >
                          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <span>{t("viewDetails")}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

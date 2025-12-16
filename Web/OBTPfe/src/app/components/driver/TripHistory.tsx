import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../LanguageContext";

interface TripHistoryProps {
  onBack: () => void;
  driverName: string;
}

export function TripHistory({ onBack, driverName }: TripHistoryProps) {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");

  const trips = [
    {
      id: "1",
      date: "05/12/2024",
      route: "TP. HCM → Đà Lạt",
      departureTime: "08:00",
      arrivalTime: "14:30",
      distance: 308,
      passengers: 28,
      revenue: 12600000,
      status: "completed",
    },
    {
      id: "2",
      date: "04/12/2024",
      route: "Đà Lạt → TP. HCM",
      departureTime: "16:00",
      arrivalTime: "22:30",
      distance: 308,
      passengers: 32,
      revenue: 14400000,
      status: "completed",
    },
    {
      id: "3",
      date: "03/12/2024",
      route: "TP. HCM → Vũng Tàu",
      departureTime: "06:00",
      arrivalTime: "08:30",
      distance: 125,
      passengers: 35,
      revenue: 8750000,
      status: "completed",
    },
    {
      id: "4",
      date: "03/12/2024",
      route: "Vũng Tàu → TP. HCM",
      departureTime: "15:00",
      arrivalTime: "17:30",
      distance: 125,
      passengers: 30,
      revenue: 7500000,
      status: "completed",
    },
    {
      id: "5",
      date: "02/12/2024",
      route: "TP. HCM → Nha Trang",
      departureTime: "20:00",
      arrivalTime: "05:30",
      distance: 435,
      passengers: 29,
      revenue: 15950000,
      status: "completed",
    },
  ];

  const stats = {
    week: {
      trips: 12,
      distance: 2450,
      passengers: 365,
      revenue: 89500000,
      rating: 4.8,
    },
    month: {
      trips: 48,
      distance: 9800,
      passengers: 1460,
      revenue: 358000000,
      rating: 4.9,
    },
    year: {
      trips: 576,
      distance: 117600,
      passengers: 17520,
      revenue: 4296000000,
      rating: 4.9,
    },
  };

  const currentStats = stats[selectedPeriod];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t("backToProfile")}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 dark:text-white mb-2">
            {t("tripHistoryTitle")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("tripHistorySubtitle")}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-3 mb-8">
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-6 py-3 rounded-xl transition-all ${
              selectedPeriod === "week"
                ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {t("thisWeek")}
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-6 py-3 rounded-xl transition-all ${
              selectedPeriod === "month"
                ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {t("thisMonth")}
          </button>
          <button
            onClick={() => setSelectedPeriod("year")}
            className={`px-6 py-3 rounded-xl transition-all ${
              selectedPeriod === "year"
                ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {t("thisYear")}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl text-gray-900 dark:text-white mb-1">
              {currentStats.trips}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("tripsCompleted")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl text-gray-900 dark:text-white mb-1">
              {currentStats.distance.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("kmDriven")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-3xl text-gray-900 dark:text-white mb-1">
              {currentStats.passengers.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("passengersServed")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-3xl text-gray-900 dark:text-white mb-1">
              {(currentStats.revenue / 1000000).toFixed(0)}M
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("totalRevenue")}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-3xl text-gray-900 dark:text-white mb-1">
              {currentStats.rating}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("averageRatingLabel")}
            </p>
          </div>
        </div>

        {/* Trip List */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl text-gray-900 dark:text-white">
              {t("tripDetails")}
            </h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {trip.date}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {trip.departureTime} - {trip.arrivalTime}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                        {t("completedLabel")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="text-lg text-gray-900 dark:text-white">
                          {trip.route}
                        </span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400">
                        •
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {trip.distance} km
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        •
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {trip.passengers} {t("passengersLabel")}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl text-blue-600 dark:text-blue-400">
                      {trip.revenue.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("totalRevenue")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl mb-2">{t("performanceExcellent")}</h3>
              <p className="text-blue-100">
                {t("performanceSummary")} {currentStats.trips} {t("inPeriod")}{" "}
                {selectedPeriod === "week"
                  ? t("week")
                  : selectedPeriod === "month"
                  ? t("month")
                  : t("year")}{" "}
                {t("withRating")} {currentStats.rating} ⭐
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl mb-2">
                {(currentStats.revenue / 1000000).toFixed(1)}M VNĐ
              </p>
              <p className="text-blue-100">{t("totalRevenue")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

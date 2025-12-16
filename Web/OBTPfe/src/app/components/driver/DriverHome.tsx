import { useState } from "react";
import {
  Menu,
  Bell,
  User,
  Filter,
  Search,
  TrendingUp,
  X,
  Home,
  MapIcon,
  History,
  DollarSign,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeProvider";

interface Trip {
  id: string;
  route: string;
  from: string;
  to: string;
  departureTime: string;
  date: string;
  vehiclePlate: string;
  status: "about-to-depart" | "running" | "arrived" | "cancelled";
  passengersBoarded: number;
  totalPassengers: number;
  distance: string;
  revenue: number;
}

interface DriverHomeProps {
  driverName: string;
  onTripClick: (tripId: string) => void;
  onProfileClick: () => void;
  onNavigationClick?: () => void;
  onHistoryClick?: () => void;
  onEarningsClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
  onLogout?: () => void;
}

const mockTrips: Trip[] = [
  {
    id: "1",
    route: "TP.HCM → Đà Lạt",
    from: "TP. Hồ Chí Minh",
    to: "Đà Lạt",
    departureTime: "05:00",
    date: "28/12/2024",
    vehiclePlate: "51B-12345",
    status: "about-to-depart",
    passengersBoarded: 15,
    totalPassengers: 40,
    distance: "308 km",
    revenue: 10000000,
  },
  {
    id: "2",
    route: "TP.HCM → Nha Trang",
    from: "TP. Hồ Chí Minh",
    to: "Nha Trang",
    departureTime: "14:30",
    date: "28/12/2024",
    vehiclePlate: "51B-67890",
    status: "running",
    passengersBoarded: 35,
    totalPassengers: 40,
    distance: "448 km",
    revenue: 12000000,
  },
  {
    id: "3",
    route: "Đà Lạt → TP.HCM",
    from: "Đà Lạt",
    to: "TP. Hồ Chí Minh",
    departureTime: "08:00",
    date: "27/12/2024",
    vehiclePlate: "51B-12345",
    status: "arrived",
    passengersBoarded: 38,
    totalPassengers: 40,
    distance: "308 km",
    revenue: 11000000,
  },
];

const statusConfig = {
  "about-to-depart": {
    labelKey: "aboutToDepart",
    color: "bg-blue-500 text-white",
  },
  running: { labelKey: "running", color: "bg-orange-500 text-white" },
  arrived: { labelKey: "arrived", color: "bg-green-500 text-white" },
  cancelled: { labelKey: "cancelled", color: "bg-red-500 text-white" },
};

export function DriverHome({
  driverName,
  onTripClick,
  onProfileClick,
  onNavigationClick,
  onHistoryClick,
  onEarningsClick,
  onSettingsClick,
  onNotificationsClick,
  onLogout,
}: DriverHomeProps) {
  const [activeTab, setActiveTab] = useState<
    "today" | "upcoming" | "completed"
  >("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const mockNotifications = [
    {
      id: 1,
      title: t("newTripAssigned"),
      message: "TP.HCM → Đà Lạt lúc 05:00",
      time: `5 ${t("minutesAgo")}`,
      unread: true,
    },
    {
      id: 2,
      title: t("scheduleChanged"),
      message: "Chuyến #TX-001 đã được cập nhật",
      time: `1 ${t("hourAgo")}`,
      unread: true,
    },
    {
      id: 3,
      title: t("tripCompleted"),
      message: "Đà Lạt → TP.HCM đã hoàn thành",
      time: `3 ${t("hoursAgo")}`,
      unread: false,
    },
  ];

  const getStatusLabel = (status: keyof typeof statusConfig) => {
    return t(statusConfig[status].labelKey);
  };

  const filteredTrips = mockTrips
    .filter((trip) => {
      if (activeTab === "today")
        return trip.status === "about-to-depart" || trip.status === "running";
      if (activeTab === "upcoming") return trip.status === "about-to-depart";
      if (activeTab === "completed") return trip.status === "arrived";
      return true;
    })
    .filter(
      (trip) =>
        trip.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Calculate statistics
  const totalTripsToday = mockTrips.filter(
    (t) => t.status !== "arrived"
  ).length;
  const completedTrips = mockTrips.filter((t) => t.status === "arrived").length;
  const totalRevenue = mockTrips.reduce((sum, t) => sum + t.revenue, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar Menu */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          ></div>
          <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 animate-slide-in-left">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white">
                    <span style={{ fontSize: "var(--text-lg)" }}>
                      {driverName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3
                      style={{ fontSize: "var(--text-base)" }}
                      className="text-gray-900 dark:text-white"
                    >
                      {driverName}
                    </h3>
                    <p
                      style={{ fontSize: "var(--text-sm)" }}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {t("driver")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setShowSidebar(false)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Home className="w-5 h-5" />
                  <span>{t("home")}</span>
                </button>
                <button
                  onClick={() => {
                    setShowSidebar(false);
                    onNavigationClick?.();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <MapIcon className="w-5 h-5" />
                  <span>{t("navigation")}</span>
                </button>
                <button
                  onClick={() => {
                    setShowSidebar(false);
                    onHistoryClick?.();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <History className="w-5 h-5" />
                  <span>{t("tripHistory")}</span>
                </button>
                <button
                  onClick={() => {
                    setShowSidebar(false);
                    onEarningsClick?.();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <DollarSign className="w-5 h-5" />
                  <span>{t("earnings")}</span>
                </button>
                <button
                  onClick={() => {
                    setShowSidebar(false);
                    onSettingsClick?.();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Settings className="w-5 h-5" />
                  <span>{t("settings")}</span>
                </button>
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <span>{t("theme")}</span>
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <span>{t("language")}</span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded">
                    {language === "vi" ? "VI" : "EN"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setShowSidebar(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t("logout")}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          ></div>
          <div className="fixed top-16 right-4 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-slide-in-right">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3
                  style={{ fontSize: "var(--text-lg)" }}
                  className="text-gray-900 dark:text-white"
                >
                  {t("notificationsTitle")}
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    notification.unread
                      ? "bg-blue-50/30 dark:bg-blue-900/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                    <div className="flex-1">
                      <h4
                        style={{ fontSize: "var(--text-sm)" }}
                        className="text-gray-900 dark:text-white mb-1"
                      >
                        {notification.title}
                      </h4>
                      <p
                        style={{ fontSize: "var(--text-sm)" }}
                        className="text-gray-600 dark:text-gray-400 mb-1"
                      >
                        {notification.message}
                      </p>
                      <span
                        style={{ fontSize: "var(--text-xs)" }}
                        className="text-gray-400 dark:text-gray-500"
                      >
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onNotificationsClick?.();
                }}
                className="w-full py-2 text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                {t("viewAll")}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors relative"
              >
                <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              <button
                onClick={onProfileClick}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white">
              <span>{driverName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">{t("hello")}</p>
              <h2 className="text-gray-900 dark:text-white">
                {t("driver")} {driverName}
              </h2>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3 text-white">
              <div className="text-xs mb-1">{t("tripToday")}</div>
              <div className="text-2xl">{totalTripsToday}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-3 text-white">
              <div className="text-xs mb-1">{t("completed")}</div>
              <div className="text-2xl">{completedTrips}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-3 text-white">
              <div className="text-xs mb-1">{t("revenue")}</div>
              <div className="text-sm">{formatPrice(totalRevenue)}</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchTrips")}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-3 px-4 transition-colors ${
              activeTab === "today"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {t("today")}
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-3 px-4 transition-colors ${
              activeTab === "upcoming"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {t("upcoming")}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-3 px-4 transition-colors ${
              activeTab === "completed"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {t("completed")}
          </button>
        </div>
      </header>

      {/* Trip List */}
      <div className="p-4 space-y-4">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t("noTrips")}</p>
          </div>
        ) : (
          filteredTrips.map((trip) => {
            const statusInfo = statusConfig[trip.status];
            return (
              <div
                key={trip.id}
                onClick={() => onTripClick(trip.id)}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all cursor-pointer border border-gray-100 dark:border-gray-700 active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-1">
                      {trip.route}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {trip.departureTime} - {trip.date}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}
                  >
                    {getStatusLabel(trip.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t("vehiclePlate")}
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      {trip.vehiclePlate}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t("distance")}
                    </div>
                    <div className="text-gray-900 dark:text-white">
                      {trip.distance}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600 dark:text-gray-400">
                    {t("boarded")}:{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {trip.passengersBoarded}/{trip.totalPassengers}
                    </span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {formatPrice(trip.revenue)}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500"
                    style={{
                      width: `${
                        (trip.passengersBoarded / trip.totalPassengers) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

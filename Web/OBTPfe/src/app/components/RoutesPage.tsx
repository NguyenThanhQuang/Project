import { ArrowLeft, MapPin, Clock, DollarSign } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface RoutesPageProps {
  onBack: () => void;
  onRouteClick?: (from: string, to: string) => void;
}

export function RoutesPage({ onBack, onRouteClick }: RoutesPageProps) {
  const { t } = useLanguage();

  const routes = [
    {
      from: "TP. Hồ Chí Minh",
      to: "Đà Lạt",
      trips: "45",
      price: "220.000đ",
      duration: "6h",
      image: "🏔️",
    },
    {
      from: "TP. Hồ Chí Minh",
      to: "Nha Trang",
      trips: "38",
      price: "280.000đ",
      duration: "8h",
      image: "🏖️",
    },
    {
      from: "TP. Hồ Chí Minh",
      to: "Vũng Tàu",
      trips: "52",
      price: "120.000đ",
      duration: "2h",
      image: "🌊",
    },
    {
      from: "TP. Hồ Chí Minh",
      to: "Phan Thiết",
      trips: "30",
      price: "150.000đ",
      duration: "4h",
      image: "🏝️",
    },
    {
      from: "TP. Hồ Chí Minh",
      to: "Cần Thơ",
      trips: "25",
      price: "180.000đ",
      duration: "4h",
      image: "🌾",
    },
    {
      from: "Hà Nội",
      to: "Hải Phòng",
      trips: "40",
      price: "150.000đ",
      duration: "2h",
      image: "🏙️",
    },
    {
      from: "Hà Nội",
      to: "Sa Pa",
      trips: "20",
      price: "350.000đ",
      duration: "6h",
      image: "⛰️",
    },
    {
      from: "Hà Nội",
      to: "Huế",
      trips: "15",
      price: "450.000đ",
      duration: "12h",
      image: "🏰",
    },
    {
      from: "Đà Nẵng",
      to: "Hội An",
      trips: "35",
      price: "50.000đ",
      duration: "1h",
      image: "🏮",
    },
    {
      from: "Đà Nẵng",
      to: "Huế",
      trips: "28",
      price: "120.000đ",
      duration: "3h",
      image: "🎋",
    },
    {
      from: "Nha Trang",
      to: "Đà Lạt",
      trips: "22",
      price: "180.000đ",
      duration: "4h",
      image: "🌸",
    },
    {
      from: "Quy Nhơn",
      to: "Nha Trang",
      trips: "18",
      price: "200.000đ",
      duration: "5h",
      image: "🌅",
    },
  ];

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
            <span>{t("home")}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
            {t("allRoutes")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t("routesSubtitle")}
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div
              key={index}
              onClick={() => onRouteClick?.(route.from, route.to)}
              className="group bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-2 cursor-pointer"
            >
              <div className="text-5xl mb-4">{route.image}</div>

              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-lg text-gray-900 dark:text-white mb-1">
                    {route.from}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    → {route.to}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {route.trips} {t("tripsPerDay")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400">
                      {t("from")} {route.price}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm rounded-xl hover:shadow-lg transition-all opacity-0 group-hover:opacity-100">
                    {t("search")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

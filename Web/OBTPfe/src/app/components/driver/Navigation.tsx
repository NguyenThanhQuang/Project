import {
  Navigation as NavigationIcon,
  MapPin,
  Clock,
  Phone,
  AlertCircle,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";

interface NavigationProps {
  onBack: () => void;
  destination: string;
  estimatedArrival: string;
}

export function Navigation({
  onBack,
  destination,
  estimatedArrival,
}: NavigationProps) {
  const { t } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState({
    lat: 10.762622,
    lng: 106.660172,
  }); // HCM
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(245); // km

  // Simulate location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(Math.floor(Math.random() * 30) + 50); // 50-80 km/h
      setDistance((prev) => Math.max(0, prev - 0.5));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Map View */}
      <div className="relative h-screen">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-800">
          {/* Grid pattern to simulate map */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Route line */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 100 100 Q 300 200, 500 400 T 900 700"
              stroke="#3b82f6"
              strokeWidth="4"
              fill="none"
              strokeDasharray="10,5"
            />
            {/* Starting point */}
            <circle cx="100" cy="100" r="8" fill="#10b981" />
            {/* Current position */}
            <circle
              cx="500"
              cy="400"
              r="12"
              fill="#3b82f6"
              className="animate-pulse"
            />
            {/* Destination */}
            <circle cx="900" cy="700" r="8" fill="#ef4444" />
          </svg>
        </div>

        {/* Top Info Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
            >
              <Home className="w-6 h-6" />
            </button>

            <div className="flex-1 mx-4 bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-sm">{destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-sm">{estimatedArrival}</span>
                </div>
              </div>
            </div>

            <button className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all">
              <Phone className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Speed & Distance Panel */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-80">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Tốc độ
                </p>
                <div className="flex items-end justify-center">
                  <span className="text-5xl text-blue-600 dark:text-blue-400">
                    {speed}
                  </span>
                  <span className="text-xl text-gray-600 dark:text-gray-400 ml-2 mb-2">
                    km/h
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Còn lại
                </p>
                <div className="flex items-end justify-center">
                  <span className="text-5xl text-green-600 dark:text-green-400">
                    {distance.toFixed(0)}
                  </span>
                  <span className="text-xl text-gray-600 dark:text-gray-400 ml-2 mb-2">
                    km
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Control Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm z-10">
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Navigation Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <NavigationIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sau 2.5km
                  </p>
                  <p className="text-lg text-gray-900 dark:text-white">
                    Rẽ phải vào Quốc lộ 1A
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-blue-600 dark:text-blue-400">→</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-3">
              <button className="p-4 bg-white dark:bg-gray-800 rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Báo sự cố
                </span>
              </button>

              <button className="p-4 bg-white dark:bg-gray-800 rounded-xl text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                <Phone className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Gọi hỗ trợ
                </span>
              </button>

              <button className="p-4 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl text-center hover:shadow-lg transition-all">
                <MapPin className="w-6 h-6 text-white mx-auto mb-2" />
                <span className="text-sm text-white">Điểm dừng</span>
              </button>
            </div>
          </div>
        </div>

        {/* Location Marker (Current Position) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-500 rounded-full animate-pulse opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { User, X, Search } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  rating: number;
  totalTrips: number;
  status: "available" | "busy";
}

interface DriverAssignmentProps {
  onClose: () => void;
  onAssign: (driverId: string) => void;
  tripId: string;
}

export function DriverAssignment({
  onClose,
  onAssign,
  tripId,
}: DriverAssignmentProps) {
  const { t } = useLanguage();
  const [drivers] = useState<Driver[]>([
    {
      id: "1",
      name: "Nguyễn Văn Tài",
      phone: "0909111222",
      licenseNumber: "B2-12345678",
      rating: 4.8,
      totalTrips: 156,
      status: "available",
    },
    {
      id: "2",
      name: "Trần Minh Đức",
      phone: "0909222333",
      licenseNumber: "B2-23456789",
      rating: 4.9,
      totalTrips: 203,
      status: "available",
    },
    {
      id: "3",
      name: "Lê Hoàng Nam",
      phone: "0909333444",
      licenseNumber: "B2-34567890",
      rating: 4.7,
      totalTrips: 142,
      status: "busy",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white">
              {t("assignDriver")}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchDriver")}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="p-6 space-y-3">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className={`p-4 rounded-2xl border-2 transition-all ${
                driver.status === "available"
                  ? "border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 cursor-pointer"
                  : "border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed"
              }`}
              onClick={() => {
                if (driver.status === "available") {
                  onAssign(driver.id);
                  onClose();
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">
                      {driver.name}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>{driver.phone}</span>
                      <span>•</span>
                      <span>{driver.licenseNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-900 dark:text-white">
                      {driver.rating}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {driver.totalTrips} {t("tripsCount")}
                  </div>
                  <div
                    className={`mt-2 px-3 py-1 rounded-full text-xs ${
                      driver.status === "available"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {driver.status === "available" ? t("available") : t("busy")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

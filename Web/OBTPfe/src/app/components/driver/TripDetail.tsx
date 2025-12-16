import { useState } from "react";
import {
  ArrowLeft,
  Navigation,
  Phone,
  AlertTriangle,
  QrCode,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Filter,
} from "lucide-react";

interface Passenger {
  id: string;
  name: string;
  phone: string;
  seatNumber: string;
  checkedIn: boolean;
  ticketCode: string;
  boardingPoint: string;
}

interface TripDetailProps {
  tripId: string;
  onBack: () => void;
  onScanQR: () => void;
}

const mockPassengers: Passenger[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    phone: "0909123456",
    seatNumber: "A1",
    checkedIn: true,
    ticketCode: "TKT001",
    boardingPoint: "Bến xe Miền Đông",
  },
  {
    id: "2",
    name: "Trần Thị B",
    phone: "0909234567",
    seatNumber: "A2",
    checkedIn: true,
    ticketCode: "TKT002",
    boardingPoint: "Bến xe Miền Đông",
  },
  {
    id: "3",
    name: "Lê Văn C",
    phone: "0909345678",
    seatNumber: "A3",
    checkedIn: false,
    ticketCode: "TKT003",
    boardingPoint: "Bến xe Miền Đông",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    phone: "0909456789",
    seatNumber: "A4",
    checkedIn: false,
    ticketCode: "TKT004",
    boardingPoint: "Bến xe An Sương",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    phone: "0909567890",
    seatNumber: "B1",
    checkedIn: true,
    ticketCode: "TKT005",
    boardingPoint: "Bến xe Miền Đông",
  },
];

export function TripDetail({ tripId, onBack, onScanQR }: TripDetailProps) {
  const [tripStatus, setTripStatus] = useState<
    "not-started" | "in-progress" | "completed"
  >("not-started");
  const [passengers, setPassengers] = useState(mockPassengers);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "checked-in" | "not-checked-in"
  >("all");

  const checkedInCount = passengers.filter((p) => p.checkedIn).length;
  const totalPassengers = passengers.length;
  const checkedInPercentage = (checkedInCount / totalPassengers) * 100;

  const filteredPassengers = passengers.filter((p) => {
    if (filterStatus === "checked-in") return p.checkedIn;
    if (filterStatus === "not-checked-in") return !p.checkedIn;
    return true;
  });

  const handleTripStatusToggle = () => {
    if (tripStatus === "not-started") {
      setTripStatus("in-progress");
    } else if (tripStatus === "in-progress") {
      setTripStatus("completed");
    }
  };

  const handlePassengerCheckIn = (passengerId: string) => {
    setPassengers(
      passengers.map((p) =>
        p.id === passengerId ? { ...p, checkedIn: !p.checkedIn } : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-24">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-white">TP.HCM → Đà Lạt</h1>
              <p className="text-gray-600 dark:text-gray-400">
                05:00 - 28/12/2024
              </p>
            </div>
          </div>

          {/* Info chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm whitespace-nowrap">
              <MapPin className="w-4 h-4" />
              <span>308 km</span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-sm whitespace-nowrap">
              <Clock className="w-4 h-4" />
              <span>7 giờ</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm whitespace-nowrap">
              <DollarSign className="w-4 h-4" />
              <span>10.000.000đ</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Trip Status Button */}
        <button
          onClick={handleTripStatusToggle}
          disabled={tripStatus === "completed"}
          className={`w-full py-6 rounded-3xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
            tripStatus === "not-started"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-green-500/30"
              : tripStatus === "in-progress"
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-red-500/30"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          <span className="text-xl">
            {tripStatus === "not-started" && "BẮT ĐẦU CHUYẾN ĐI"}
            {tripStatus === "in-progress" && "KẾT THÚC CHUYẾN ĐI"}
            {tripStatus === "completed" && "ĐÃ HOÀN THÀNH"}
          </span>
        </button>

        {/* Check-in Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 dark:text-white">Tiến Độ Check-in</h3>
            <span className="text-blue-600 dark:text-blue-400">
              {checkedInCount} / {totalPassengers}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500"
              style={{ width: `${checkedInPercentage}%` }}
            ></div>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Đã lên xe: {checkedInCount}</span>
            <span>Còn lại: {totalPassengers - checkedInCount}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all active:scale-95">
            <Navigation className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Dẫn đường
            </span>
          </button>
          <button className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all active:scale-95">
            <Phone className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Gọi TT
            </span>
          </button>
          <button className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all active:scale-95">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              Báo cáo
            </span>
          </button>
        </div>

        {/* Passenger List */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white">
              Danh Sách Hành Khách
            </h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả ({totalPassengers})</option>
              <option value="checked-in">Đã lên ({checkedInCount})</option>
              <option value="not-checked-in">
                Chưa lên ({totalPassengers - checkedInCount})
              </option>
            </select>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredPassengers.map((passenger) => (
              <div
                key={passenger.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-gray-900 dark:text-white">
                        {passenger.name}
                      </h4>
                      {passenger.checkedIn && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Đã lên xe</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm mb-2">
                      <a
                        href={`tel:${passenger.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {passenger.phone}
                      </a>
                      <span className="text-gray-600 dark:text-gray-400">
                        Ghế: {passenger.seatNumber}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {passenger.boardingPoint} • Mã vé: {passenger.ticketCode}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePassengerCheckIn(passenger.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      passenger.checkedIn
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                    }`}
                  >
                    {passenger.checkedIn && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onScanQR}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 active:scale-95 flex items-center justify-center z-20"
      >
        <QrCode className="w-8 h-8" />
      </button>
    </div>
  );
}

import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Shield,
  Wifi,
  Coffee,
  Star,
  User,
  Tag,
  Percent,
} from "lucide-react";
import { PaymentModal } from "./PaymentModal";
import { PromoCodeModal } from "./PromoCodeModal";
import { Users, Info } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface TripDetailProps {
  tripId: string;
  onBack: () => void;
  onBooking: (selectedSeats: string[]) => void;
}

interface Seat {
  number: string;
  status: "available" | "selected" | "booked" | "holding";
  floor: 1 | 2;
}

const mockSeats: Seat[] = [
  // Tầng 1
  ...Array.from({ length: 20 }, (_, i) => ({
    number: `A${i + 1}`,
    status:
      i < 3
        ? ("booked" as const)
        : i < 5
        ? ("holding" as const)
        : ("available" as const),
    floor: 1 as const,
  })),
  // Tầng 2
  ...Array.from({ length: 20 }, (_, i) => ({
    number: `B${i + 1}`,
    status: i < 2 ? ("booked" as const) : ("available" as const),
    floor: 2 as const,
  })),
];

export function TripDetail({ tripId, onBack, onBooking }: TripDetailProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPromoCodeModal, setShowPromoCodeModal] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const { language } = useLanguage();

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "booked" || seat.status === "holding") return;

    if (selectedSeats.includes(seat.number)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.number));
    } else {
      setSelectedSeats([...selectedSeats, seat.number]);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.number)) {
      return "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-500/50";
    }
    if (seat.status === "booked") {
      return "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-500 cursor-not-allowed opacity-80";
    }
    if (seat.status === "holding") {
      return "bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-500 cursor-not-allowed opacity-70";
    }
    return "bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-md";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const floorSeats = mockSeats.filter((s) => s.floor === activeFloor);

  const handleBookNow = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế trước khi đặt vé");
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    onBooking(selectedSeats);
  };

  const totalAmount = selectedSeats.length * 250000 - discount;

  const handleApplyPromoCode = (code: string) => {
    setPromoCode(code);
    // Simple promo code logic - can be expanded
    if (code === "SUMMER20") {
      setDiscount(selectedSeats.length * 250000 * 0.2);
    } else if (code === "NEWYEAR50K") {
      setDiscount(50000);
    } else if (code === "DALAT15") {
      setDiscount(selectedSeats.length * 250000 * 0.15);
    } else if (code === "WEEKEND10") {
      setDiscount(selectedSeats.length * 250000 * 0.1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-gray-900 dark:text-white">
              Chi tiết chuyến đi
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Trip Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center text-3xl">
              🚌
            </div>
            <div>
              <h2 className="text-gray-900 dark:text-white mb-1">
                Phương Trang
              </h2>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 dark:text-gray-300">4.8</span>
                <span className="text-gray-400">(234 đánh giá)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Khởi hành
                </div>
                <div className="text-gray-900 dark:text-white">
                  05:00 - 28/12/2024
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Tuyến đường
                </div>
                <div className="text-gray-900 dark:text-white">
                  TP.HCM → Đà Lạt
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
              Giường nằm
            </span>
            <div className="flex items-center space-x-2">
              {[Wifi, Coffee, Star, User].map((Icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10 rounded-2xl p-4 mb-4">
            <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Chi tiết xe
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Loại xe
                </div>
                <div className="text-sm text-gray-900 dark:text-white">
                  Giường nằm
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Số giường
                </div>
                <div className="text-sm text-gray-900 dark:text-white">
                  40 giường (2 tầng)
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Biển số
                </div>
                <div className="text-sm text-gray-900 dark:text-white">
                  51B-123.45
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Tiện ích
                </div>
                <div className="text-sm text-gray-900 dark:text-white">
                  WiFi, Nước, TV
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Giá vé</span>
              <span className="text-2xl text-blue-600 dark:text-blue-400">
                {formatPrice(250000)}
              </span>
            </div>
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white">Mã giảm giá</h3>
            <button
              onClick={() => setShowPromoCodeModal(true)}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              Xem tất cả mã
            </button>
          </div>

          {promoCode ? (
            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-green-900 dark:text-green-100 font-mono">
                    {promoCode}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    Đã áp dụng - Giảm {formatPrice(discount)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setPromoCode("");
                  setDiscount(0);
                }}
                className="text-red-600 dark:text-red-400 text-sm hover:underline"
              >
                Xóa
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowPromoCodeModal(true)}
              className="w-full bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10 rounded-2xl p-4 flex items-center justify-between border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
            >
              <div className="flex items-center space-x-3">
                <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Nhấn để chọn mã giảm giá
                </span>
              </div>
              <span className="text-blue-600 dark:text-blue-400">&gt;</span>
            </button>
          )}
        </div>

        {/* Seat Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h3 className="text-gray-900 dark:text-white mb-4">Chọn ghế</h3>

          {/* Floor Toggle */}
          <div className="flex items-center space-x-2 mb-6">
            <button
              onClick={() => setActiveFloor(1)}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeFloor === 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Tầng 1
            </button>
            <button
              onClick={() => setActiveFloor(2)}
              className={`flex-1 py-3 rounded-xl transition-all ${
                activeFloor === 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Tầng 2
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-6 mb-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg"></div>
              <span className="text-gray-600 dark:text-gray-400">Trống</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-600 rounded-lg shadow-lg shadow-blue-500/50"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Đang chọn
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 border-2 border-red-500 rounded-lg opacity-80"></div>
              <span className="text-gray-600 dark:text-gray-400">Đã đặt</span>
            </div>
          </div>

          {/* Seat Map */}
          <div className="relative">
            {/* Driver seat indicator */}
            <div className="flex justify-end mb-4">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Lái xe
                </span>
              </div>
            </div>

            {/* Seats Grid */}
            <div className="grid grid-cols-4 gap-3">
              {floorSeats.map((seat, index) => {
                // Create aisle after every 2 seats
                const showAisle = (index + 1) % 2 === 0;
                return (
                  <div
                    key={seat.number}
                    className={showAisle ? "col-span-1 mr-4" : "col-span-1"}
                  >
                    <button
                      onClick={() => handleSeatClick(seat)}
                      disabled={
                        seat.status === "booked" || seat.status === "holding"
                      }
                      className={`w-full aspect-square border-2 rounded-xl transition-all ${getSeatColor(
                        seat
                      )}`}
                    >
                      <div className="text-sm">{seat.number}</div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            Vui lòng chọn ghế và tiến hành đặt vé. Ghế sẽ được giữ trong 15
            phút.
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedSeats.length > 0
                ? `Đã chọn ${selectedSeats.length} ghế: ${selectedSeats.join(
                    ", "
                  )}`
                : "Chưa chọn ghế"}
            </div>
            <div className="text-xl text-gray-900 dark:text-white">
              {formatPrice(totalAmount)}
            </div>
          </div>
          <button
            onClick={handleBookNow}
            disabled={selectedSeats.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Đặt vé ngay
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
          amount={totalAmount}
          ticketInfo={{
            route: "TP.HCM → Đà Lạt",
            date: "28/12/2024",
            time: "05:00",
            seats: selectedSeats,
          }}
        />
      )}

      {/* Promo Code Modal */}
      {showPromoCodeModal && (
        <PromoCodeModal
          onClose={() => setShowPromoCodeModal(false)}
          onApply={handleApplyPromoCode}
        />
      )}
    </div>
  );
}

import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket as TicketIcon,
  QrCode,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface BookingConfirmationProps {
  onViewTicket: () => void;
  onBackToHome: () => void;
  bookingData: {
    bookingId: string;
    from: string;
    to: string;
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
    companyName: string;
    passengerName: string;
    passengerPhone: string;
  };
}

export function BookingConfirmation({
  onViewTicket,
  onBackToHome,
  bookingData,
}: BookingConfirmationProps) {
  const { t } = useLanguage();

  const handleDownload = () => {
    alert("Đang tải vé PDF...");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Vé xe khách",
        text: `Mã đặt vé: ${bookingData.bookingId}`,
      });
    } else {
      alert("Đã sao chép link vào clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4 shadow-2xl shadow-green-500/30">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl text-gray-900 dark:text-white mb-2">
            Đặt vé thành công!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Mã đặt vé</p>
                <p className="text-3xl tracking-wider">
                  {bookingData.bookingId}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <TicketIcon className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Route */}
            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl">
              <div className="p-3 bg-blue-600 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Tuyến đường
                </p>
                <p className="text-xl text-gray-900 dark:text-white">
                  {bookingData.from} → {bookingData.to}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {bookingData.companyName}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ngày đi
                  </p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white">
                  {bookingData.date}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center space-x-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Giờ khởi hành
                  </p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white">
                  {bookingData.time}
                </p>
              </div>
            </div>

            {/* Passenger Info */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Thông tin hành khách
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Họ tên:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {bookingData.passengerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Số điện thoại:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {bookingData.passengerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Seats */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Số ghế đã đặt
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {bookingData.seats.map((seat, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Total Price */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-700 dark:text-gray-300">
                  Tổng tiền đã thanh toán:
                </span>
                <span className="text-3xl text-blue-600 dark:text-blue-400">
                  {bookingData.totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={onViewTicket}
            className="py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center space-x-2"
          >
            <QrCode className="w-5 h-5" />
            <span>Xem vé điện tử</span>
          </button>

          <button
            onClick={handleDownload}
            className="py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Tải vé PDF</span>
          </button>

          <button
            onClick={handleShare}
            className="py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-xl transition-all flex items-center justify-center space-x-2"
          >
            <Share2 className="w-5 h-5" />
            <span>Chia sẻ</span>
          </button>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
          <p className="text-gray-700 dark:text-gray-300 text-center mb-2">
            <strong>📧 Đã gửi email xác nhận!</strong>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Vé điện tử và thông tin chi tiết đã được gửi đến email của bạn. Vui
            lòng xuất trình mã QR khi lên xe.
          </p>
        </div>

        {/* Back to Home */}
        <button
          onClick={onBackToHome}
          className="w-full mt-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
        >
          ← Về trang chủ
        </button>
      </div>
    </div>
  );
}

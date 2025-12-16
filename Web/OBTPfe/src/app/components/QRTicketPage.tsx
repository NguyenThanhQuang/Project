import {
  Download,
  Share2,
  MapPin,
  Calendar,
  Clock,
  Users,
  Ticket as TicketIcon,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "./LanguageContext";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface QRTicketPageProps {
  onBack: () => void;
  ticketData: {
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
    status: "active" | "used" | "cancelled";
  };
}

export function QRTicketPage({ onBack, ticketData }: QRTicketPageProps) {
  const { t } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    // Generate QR code
    const qrData = JSON.stringify({
      bookingId: ticketData.bookingId,
      passengerName: ticketData.passengerName,
      seats: ticketData.seats,
      date: ticketData.date,
      time: ticketData.time,
    });

    QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: "#1e40af",
        light: "#ffffff",
      },
    }).then((url) => {
      setQrCodeUrl(url);
    });
  }, [ticketData]);

  const statusConfig = {
    active: {
      label: "Hoạt động",
      color:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      badge: "✓",
    },
    used: {
      label: "Đã sử dụng",
      color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      badge: "✗",
    },
    cancelled: {
      label: "Đã hủy",
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      badge: "✗",
    },
  };

  const currentStatus = statusConfig[ticketData.status];

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
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Ticket Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <TicketIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Vé điện tử</p>
                    <p className="text-2xl">VeXe.com</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-xl ${currentStatus.color}`}>
                  {currentStatus.badge} {currentStatus.label}
                </span>
              </div>
              <p className="text-blue-100 text-sm">Mã vé</p>
              <p className="text-3xl tracking-wider mb-2">
                {ticketData.bookingId}
              </p>
              <p className="text-blue-100">{ticketData.companyName}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-8 text-center border-b-2 border-dashed border-gray-200 dark:border-gray-700">
            {qrCodeUrl && (
              <div className="inline-block p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Vui lòng xuất trình mã QR này khi lên xe
            </p>
          </div>

          {/* Trip Details */}
          <div className="p-6 space-y-6">
            {/* Route */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tuyến đường
                  </p>
                  <p className="text-xl text-gray-900 dark:text-white">
                    {ticketData.from} → {ticketData.to}
                  </p>
                </div>
              </div>
            </div>

            {/* DateTime Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ngày đi
                  </p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white">
                  {ticketData.date}
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Giờ khởi hành
                  </p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white">
                  {ticketData.time}
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
                    {ticketData.passengerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SĐT:</span>
                  <span className="text-gray-900 dark:text-white">
                    {ticketData.passengerPhone}
                  </span>
                </div>
              </div>
            </div>

            {/* Seats */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Số ghế
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {ticketData.seats.map((seat, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl text-lg"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Tổng tiền:
                </span>
                <span className="text-3xl text-blue-600 dark:text-blue-400">
                  {ticketData.totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.download = `ticket-${ticketData.bookingId}.png`;
                  link.href = qrCodeUrl;
                  link.click();
                }}
                className="py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Tải xuống</span>
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Vé xe khách",
                      text: `Mã vé: ${ticketData.bookingId}`,
                    });
                  }
                }}
                className="py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Share2 className="w-5 h-5" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>⚠️ Lưu ý quan trọng:</strong>
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1 list-disc list-inside">
              <li>Vui lòng có mặt tại bến xe trước 15 phút</li>
              <li>Xuất trình mã QR cho tài xế khi lên xe</li>
              <li>Mang theo CMND/CCCD để đối chiếu</li>
              <li>Vé chỉ có giá trị cho chuyến đi đã đặt</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cần hỗ trợ? Liên hệ:{" "}
              <strong className="text-blue-600 dark:text-blue-400">
                1900 6067
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

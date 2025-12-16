import {
  ArrowLeft,
  CreditCard,
  Wallet,
  QrCode,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";

interface PaymentPageProps {
  onBack: () => void;
  onPaymentSuccess: (bookingId: string) => void;
  tripData: {
    from: string;
    to: string;
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
    companyName: string;
  };
}

export function PaymentPage({
  onBack,
  onPaymentSuccess,
  tripData,
}: PaymentPageProps) {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "momo" | "vnpay" | "bank"
  >("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const bookingId = "BK" + Date.now();
      onPaymentSuccess(bookingId);
      setIsProcessing(false);
    }, 2000);
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Thẻ tín dụng/ghi nợ",
      icon: CreditCard,
      color: "from-blue-600 to-blue-500",
      description: "Visa, Mastercard, JCB",
    },
    {
      id: "momo",
      name: "Ví MoMo",
      icon: Wallet,
      color: "from-pink-600 to-pink-500",
      description: "Thanh toán qua ví điện tử MoMo",
    },
    {
      id: "vnpay",
      name: "VNPay",
      icon: QrCode,
      color: "from-orange-600 to-orange-500",
      description: "Thanh toán qua VNPay QR",
    },
    {
      id: "bank",
      name: "Chuyển khoản ngân hàng",
      icon: CreditCard,
      color: "from-green-600 to-green-500",
      description: "Chuyển khoản trực tiếp",
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
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-gray-900 dark:text-white mb-2">
            Thanh Toán
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hoàn tất thanh toán để nhận vé
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl text-gray-900 dark:text-white mb-6">
                Chọn phương thức thanh toán
              </h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 bg-gradient-to-r ${method.color} rounded-xl`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-gray-900 dark:text-white">
                            {method.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {method.description}
                          </p>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethod === "card" && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl text-gray-900 dark:text-white mb-6">
                  Thông tin thẻ
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Số thẻ
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Ngày hết hạn
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Tên chủ thẻ
                    </label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN A"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod !== "card" && (
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                <p className="text-gray-700 dark:text-gray-300 text-center">
                  Bạn sẽ được chuyển hướng đến trang thanh toán{" "}
                  {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 sticky top-24">
              <h2 className="text-2xl text-gray-900 dark:text-white mb-6">
                Chi tiết đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Tuyến đường
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {tripData.from} → {tripData.to}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Thời gian
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {tripData.date} - {tripData.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ghế đã chọn
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {tripData.seats.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Giá vé ({tripData.seats.length} ghế)</span>
                  <span>
                    {(tripData.totalPrice * 0.95).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Phí dịch vụ</span>
                  <span>
                    {(tripData.totalPrice * 0.05).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                  <span className="text-lg text-gray-900 dark:text-white">
                    Tổng cộng
                  </span>
                  <span className="text-2xl text-blue-600 dark:text-blue-400">
                    {tripData.totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </span>
                ) : (
                  "Thanh toán ngay"
                )}
              </button>

              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Thanh toán an toàn & bảo mật</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

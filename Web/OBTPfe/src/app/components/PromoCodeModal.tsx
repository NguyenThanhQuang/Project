import { X, Tag, Calendar, MapPin, DollarSign } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { useState } from "react";

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discount: number;
  discountType: "percent" | "fixed";
  validUntil: string;
  minAmount: number;
  maxDiscount?: number;
  applicableRoutes: string[];
}

interface PromoCodeModalProps {
  onClose: () => void;
  onApply: (code: string) => void;
}

const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "SUMMER20",
    description: "Giảm 20% cho các chuyến đi mùa hè",
    discount: 20,
    discountType: "percent",
    validUntil: "2024-12-31",
    minAmount: 200000,
    maxDiscount: 100000,
    applicableRoutes: [
      "TP.HCM → Đà Lạt",
      "TP.HCM → Nha Trang",
      "Hà Nội → Hải Phòng",
    ],
  },
  {
    id: "2",
    code: "NEWYEAR50K",
    description: "Giảm 50,000đ cho đơn hàng đầu tiên",
    discount: 50000,
    discountType: "fixed",
    validUntil: "2025-01-15",
    minAmount: 150000,
    applicableRoutes: ["Tất cả các tuyến"],
  },
  {
    id: "3",
    code: "DALAT15",
    description: "Giảm 15% cho tuyến Đà Lạt",
    discount: 15,
    discountType: "percent",
    validUntil: "2024-12-25",
    minAmount: 180000,
    maxDiscount: 80000,
    applicableRoutes: ["TP.HCM → Đà Lạt", "Hà Nội → Đà Lạt"],
  },
  {
    id: "4",
    code: "WEEKEND10",
    description: "Giảm 10% cho các chuyến cuối tuần",
    discount: 10,
    discountType: "percent",
    validUntil: "2025-01-31",
    minAmount: 100000,
    maxDiscount: 50000,
    applicableRoutes: ["Tất cả các tuyến"],
  },
];

export function PromoCodeModal({ onClose, onApply }: PromoCodeModalProps) {
  const { t, language } = useLanguage();
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  const getDiscountText = (promo: PromoCode) => {
    if (promo.discountType === "percent") {
      return `${promo.discount}%`;
    }
    return formatPrice(promo.discount);
  };

  const handleApply = (code: string) => {
    onApply(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl text-white">
                {t("availablePromoCodes")}
              </h2>
              <p className="text-white/80 text-sm">{t("selectAndApply")}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {mockPromoCodes.map((promo) => (
              <div
                key={promo.id}
                className={`bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-5 border-2 transition-all cursor-pointer ${
                  selectedPromo?.id === promo.id
                    ? "border-blue-600 dark:border-blue-400 shadow-lg"
                    : "border-transparent hover:border-blue-300 dark:hover:border-blue-600"
                }`}
                onClick={() =>
                  setSelectedPromo(
                    selectedPromo?.id === promo.id ? null : promo
                  )
                }
              >
                {/* Promo Code Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2 rounded-xl">
                      <div className="text-xs opacity-80">{t("promoCode")}</div>
                      <div className="font-mono text-lg">{promo.code}</div>
                    </div>
                    <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
                      -{getDiscountText(promo)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {language === "vi" ? promo.description : promo.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("validUntil")}: {formatDate(promo.validUntil)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("minAmount")}: {formatPrice(promo.minAmount)}
                    </span>
                  </div>
                  {promo.maxDiscount && (
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {t("maxDiscount")}: {formatPrice(promo.maxDiscount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Applicable Routes */}
                {selectedPromo?.id === promo.id && (
                  <div className="border-t border-blue-200 dark:border-blue-700 pt-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {t("applicableRoutes")}:
                      </span>
                    </div>
                    <div className="pl-6 space-y-1">
                      {promo.applicableRoutes.map((route, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-2"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                          <span>{route}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(promo.code);
                  }}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  {t("useCode")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

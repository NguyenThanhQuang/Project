import { X, Clock, Tag, MapPin, DollarSign, Calendar, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface PromoCodeDetailModalProps {
  promo: {
    id: string;
    titleVi: string;
    titleEn: string;
    discount: string;
    image: string;
    codeVi: string;
    codeEn: string;
    expiryVi: string;
    expiryEn: string;
    descriptionVi?: string;
    descriptionEn?: string;
    minAmountVi?: string;
    minAmountEn?: string;
    maxDiscountVi?: string;
    maxDiscountEn?: string;
    applicableRoutesVi?: string[];
    applicableRoutesEn?: string[];
  };
  onClose: () => void;
}

export function PromoCodeDetailModal({ promo, onClose }: PromoCodeDetailModalProps) {
  const { language, t } = useLanguage();
  
  const handleCopyCode = () => {
    const code = language === 'vi' ? promo.codeVi : promo.codeEn;
    navigator.clipboard.writeText(code);
    alert(language === 'vi' ? 'Đã sao chép mã!' : 'Code copied!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header with Image */}
        <div className="relative h-48 rounded-t-3xl overflow-hidden">
          <img 
            src={promo.image} 
            alt={language === 'vi' ? promo.titleVi : promo.titleEn}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          
          {/* Discount Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-red-500 text-white px-5 py-2 rounded-full shadow-lg">
              <span className="text-xl">-{promo.discount}</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Title on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-white text-xl mb-2 drop-shadow-lg">
              {language === 'vi' ? promo.titleVi : promo.titleEn}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Promo Code */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-2 border-dashed border-orange-300 dark:border-orange-600">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t('promoCode')}
                </p>
                <div className="flex items-center space-x-3">
                  <Tag className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  <span className="text-2xl font-mono text-gray-900 dark:text-white tracking-wider">
                    {language === 'vi' ? promo.codeVi : promo.codeEn}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                {t('useCode')}
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('validUntil')}
                </p>
                <p className="text-gray-900 dark:text-white">
                  {language === 'vi' ? promo.expiryVi : promo.expiryEn}
                </p>
              </div>
            </div>

            {/* Discount */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t('discount')}
                </p>
                <p className="text-gray-900 dark:text-white">
                  {promo.discount} {language === 'vi' ? 'giảm giá' : 'off'}
                </p>
              </div>
            </div>

            {/* Min Amount */}
            {(promo.minAmountVi || promo.minAmountEn) && (
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('minAmount')}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {language === 'vi' ? (promo.minAmountVi || '200,000đ') : (promo.minAmountEn || '200,000 VND')}
                  </p>
                </div>
              </div>
            )}

            {/* Max Discount */}
            {(promo.maxDiscountVi || promo.maxDiscountEn) && (
              <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <DollarSign className="w-5 h-5 text-teal-600 dark:text-teal-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('maxDiscount')}
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {language === 'vi' ? (promo.maxDiscountVi || '100,000đ') : (promo.maxDiscountEn || '100,000 VND')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {(promo.descriptionVi || promo.descriptionEn) && (
            <div className="space-y-2">
              <h3 className="text-gray-900 dark:text-white flex items-center space-x-2">
                <span>{language === 'vi' ? 'Mô tả chi tiết' : 'Description'}</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {language === 'vi' ? 
                  (promo.descriptionVi || 'Áp dụng giảm giá cho các tuyến đường đã chọn. Chỉ áp dụng một lần cho mỗi khách hàng.') : 
                  (promo.descriptionEn || 'Apply discount to selected routes. Limited to one use per customer.')
                }
              </p>
            </div>
          )}

          {/* Applicable Routes */}
          <div className="space-y-3">
            <h3 className="text-gray-900 dark:text-white flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{t('applicableRoutes')}</span>
            </h3>
            <div className="space-y-2">
              {(language === 'vi' ? 
                (promo.applicableRoutesVi || ['TP. Hồ Chí Minh → Đà Lạt', 'TP. Hồ Chí Minh → Nha Trang', 'TP. Hồ Chí Minh → Vũng Tàu', 'TP. Hồ Chí Minh → Tây Ninh']) : 
                (promo.applicableRoutesEn || ['Ho Chi Minh → Da Lat', 'Ho Chi Minh → Nha Trang', 'Ho Chi Minh → Vung Tau', 'Ho Chi Minh → Tay Ninh'])
              ).map((route, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">{route}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <h4 className="text-blue-900 dark:text-blue-200 mb-2">
              {language === 'vi' ? 'Điều khoản & Điều kiện' : 'Terms & Conditions'}
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-disc list-inside">
              <li>{language === 'vi' ? 'Chỉ áp dụng một lần cho mỗi khách hàng' : 'Limited to one use per customer'}</li>
              <li>{language === 'vi' ? 'Không áp dụng đồng thời với ưu đãi khác' : 'Cannot be combined with other offers'}</li>
              <li>{language === 'vi' ? 'Không hoàn tiền khi hủy vé' : 'Non-refundable for ticket cancellations'}</li>
              <li>{language === 'vi' ? 'Có hiệu lực đến hết ngày ghi trên mã' : 'Valid until the expiry date shown'}</li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all"
          >
            {language === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

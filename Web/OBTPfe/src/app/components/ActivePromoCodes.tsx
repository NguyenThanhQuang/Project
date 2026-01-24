import { Tag, Percent, Calendar, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { useState, useEffect, useRef } from 'react';

// Mock data - in production, this would come from API/backend
const activePromoCodes = [
  {
    id: 'PROMO001',
    code: 'NEWYEAR2025',
    description: 'Giảm giá 20% cho năm mới',
    descriptionEn: 'Get 20% off for new year',
    discountType: 'percentage' as const,
    discountValue: 20,
    minPurchase: 100000,
    maxDiscount: 50000,
    endDate: '2025-01-31',
    bannerImage: 'https://images.unsplash.com/photo-1704399527621-82de0422490c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwY2VsZWJyYXRpb24lMjBmaXJld29ya3N8ZW58MXx8fHwxNzY3NTEyNDI4fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'PROMO002',
    code: 'STUDENT50K',
    description: 'Giảm 50.000đ cho sinh viên',
    descriptionEn: 'Get 50,000đ off for students',
    discountType: 'fixed' as const,
    discountValue: 50000,
    minPurchase: 200000,
    endDate: '2025-06-30',
    bannerImage: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBoYXBweXxlbnwxfHx8fDE3Njc1NjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'PROMO004',
    code: 'WEEKEND15',
    description: 'Giảm 15% cho chuyến cuối tuần',
    descriptionEn: 'Get 15% off for weekend trips',
    discountType: 'percentage' as const,
    discountValue: 15,
    minPurchase: 150000,
    maxDiscount: 40000,
    endDate: '2025-12-31',
    bannerImage: 'https://images.unsplash.com/photo-1748795514342-e1065f88e97d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWVrZW5kJTIwZ2V0YXdheSUyMHZhY2F0aW9ufGVufDF8fHx8MTc2NzU4NjEyNnww&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function ActivePromoCodes() {
  const { language } = useLanguage();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activePromoCodes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activePromoCodes.length) % activePromoCodes.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 3000); // Change slide every 3 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex]);

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Tag className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-gray-900 dark:text-white">
              {language === 'vi' ? '🎉 Mã Khuyến Mãi Hot' : '🎉 Hot Promo Codes'}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'vi' 
              ? 'Sử dụng mã khuyến mãi để nhận ưu đãi đặc biệt cho chuyến đi của bạn'
              : 'Use promo codes to get special discounts for your trips'}
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Track */}
          <div className="overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {activePromoCodes.map((promo) => (
                <div key={promo.id} className="w-full flex-shrink-0 px-4">
                  <div className="group relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                    {/* Banner Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                      <img 
                        src={promo.bannerImage} 
                        alt={promo.code}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      
                      {/* Floating Tag */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full shadow-lg backdrop-blur-xl text-sm font-bold animate-pulse">
                        {language === 'vi' ? '🔥 HOT' : '🔥 HOT'}
                      </div>

                      {/* Code Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-white/80 mb-1">
                              {language === 'vi' ? 'MÃ KHUYẾN MÃI' : 'PROMO CODE'}
                            </div>
                            <div className="text-2xl font-black text-white font-mono tracking-wider">
                              {promo.code}
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(promo.code)}
                            className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-xl rounded-xl transition-all group/btn"
                            title={language === 'vi' ? 'Sao chép mã' : 'Copy code'}
                          >
                            {copiedCode === promo.code ? (
                              <span className="text-white text-xs font-bold">✓</span>
                            ) : (
                              <Copy className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Description */}
                      <p className="text-gray-700 dark:text-gray-300 min-h-[48px]">
                        {language === 'vi' ? promo.description : promo.descriptionEn}
                      </p>

                      {/* Discount Badge */}
                      <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700">
                        <Percent className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                        <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                          {promo.discountType === 'percentage'
                            ? `${promo.discountValue}%`
                            : `${(promo.discountValue / 1000).toFixed(0)}K`}
                        </span>
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {language === 'vi' ? 'GIẢM' : 'OFF'}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        {promo.minPurchase > 0 && (
                          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                            <span>{language === 'vi' ? 'Đơn tối thiểu:' : 'Min order:'}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {promo.minPurchase.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        )}
                        {promo.maxDiscount && (
                          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                            <span>{language === 'vi' ? 'Giảm tối đa:' : 'Max discount:'}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {promo.maxDiscount.toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{language === 'vi' ? 'Hết hạn:' : 'Valid until:'}</span>
                          </div>
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            {promo.endDate}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => copyToClipboard(promo.code)}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                      >
                        {copiedCode === promo.code
                          ? (language === 'vi' ? '✓ Đã sao chép!' : '✓ Copied!')
                          : (language === 'vi' ? 'Sao chép mã' : 'Copy Code')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 border border-gray-200 dark:border-gray-700"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 border border-gray-200 dark:border-gray-700"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center space-x-2 mt-8">
            {activePromoCodes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-blue-600 dark:bg-blue-400'
                    : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {language === 'vi' 
              ? '💡 Mã khuyến mãi sẽ được áp dụng tự động khi đặt vé' 
              : '💡 Promo codes will be applied automatically when booking'}
          </p>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PromoCodeDetailModal } from './PromoCodeDetailModal';

interface Promo {
  id: string;
  titleVi: string;
  titleEn: string;
  discount: string;
  image: string;
  codeVi: string;
  codeEn: string;
  expiryVi: string;
  expiryEn: string;
}

const promos: Promo[] = [
  {
    id: '1',
    titleVi: 'Giảm đến 25% khi đặt vé xe Sài Gòn - Tây Ninh/Vũng Tàu',
    titleEn: 'Up to 25% off for Ho Chi Minh - Tay Ninh/Vung Tau',
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1718547962969-c893b5367450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3VudCUyMHByb21vJTIwYmFubmVyfGVufDF8fHx8MTc2NTIzMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    codeVi: 'VEXERE25',
    codeEn: 'VEXERE25',
    expiryVi: 'Hết hạn: 31/12/2024',
    expiryEn: 'Expires: 31/12/2024'
  },
  {
    id: '2',
    titleVi: 'Giảm đến 25% khi đặt dịch vụ xe khách ở các tuyến đường HOT',
    titleEn: 'Up to 25% off for popular routes',
    discount: '25%',
    image: 'https://images.unsplash.com/photo-1764276680260-1a8716a1cb38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZWFsJTIwcHJvbW90aW9ufGVufDF8fHx8MTc2NTIzMDEyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    codeVi: 'DEALHOTNOW',
    codeEn: 'DEALHOTNOW',
    expiryVi: 'Hết hạn: 15/01/2025',
    expiryEn: 'Expires: 15/01/2025'
  },
  {
    id: '3',
    titleVi: 'Giảm đến 20% khi đặt vé các nhà xe mới mở bán',
    titleEn: 'Up to 20% off for new bus companies',
    discount: '20%',
    image: 'https://images.unsplash.com/photo-1763633924018-73600b980c0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsJTIwb2ZmZXIlMjBzYWxlfGVufDF8fHx8MTc2NTIxMTA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    codeVi: 'NEWBUS20',
    codeEn: 'NEWBUS20',
    expiryVi: 'Hết hạn: 20/01/2025',
    expiryEn: 'Expires: 20/01/2025'
  },
  {
    id: '4',
    titleVi: 'Giảm 15% cho khách hàng đặt vé lần đầu',
    titleEn: '15% off for first-time booking',
    discount: '15%',
    image: 'https://images.unsplash.com/photo-1718547962969-c893b5367450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXNjb3VudCUyMHByb21vJTIwYmFubmVyfGVufDF8fHx8MTc2NTIzMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    codeVi: 'FIRST15',
    codeEn: 'FIRST15',
    expiryVi: 'Hết hạn: 31/01/2025',
    expiryEn: 'Expires: 31/01/2025'
  },
];

export function PromoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState<typeof promos[0] | null>(null);
  const { language, t } = useLanguage();
  
  // Auto-scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  };

  const visiblePromos = [
    promos[(currentIndex - 1 + promos.length) % promos.length],
    promos[currentIndex],
    promos[(currentIndex + 1) % promos.length],
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full border border-orange-200 dark:border-orange-700">
            <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-orange-900 dark:text-orange-200">
              {language === 'vi' ? 'Ưu đãi nổi bật' : 'Featured Promotions'}
            </span>
          </div>
        </div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Slider */}
          <div className="overflow-hidden px-12">
            <div 
              className="flex gap-4 transition-transform duration-500 ease-out"
            >
              {visiblePromos.map((promo, index) => {
                const isCenter = index === 1;
                return (
                  <div
                    key={promo.id}
                    className={`flex-shrink-0 transition-all duration-500 ${
                      isCenter ? 'w-[calc(50%-8px)] opacity-100' : 'w-[calc(25%-8px)] opacity-60'
                    }`}
                    onClick={() => isCenter && setSelectedPromo(promo)}
                  >
                    <div className={`relative group cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ${
                      isCenter ? 'scale-100 hover:scale-[1.02]' : 'scale-90'
                    }`}>
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={promo.image}
                          alt={language === 'vi' ? promo.titleVi : promo.titleEn}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        
                        {/* Discount Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse-glow">
                            <span className="font-bold">-{promo.discount}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm mb-2 line-clamp-2">
                            {language === 'vi' ? promo.titleVi : promo.titleEn}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-3 py-1">
                              <span className="text-white text-xs font-mono">
                                {language === 'vi' ? promo.codeVi : promo.codeEn}
                              </span>
                            </div>
                            <button 
                              className="text-white text-xs underline hover:no-underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPromo(promo);
                              }}
                            >
                              {language === 'vi' ? 'Chi tiết' : 'Details'}
                            </button>
                          </div>
                          <p className="text-white text-xs mt-1">
                            {language === 'vi' ? promo.expiryVi : promo.expiryEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {promos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-orange-500 to-red-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Promo Detail Modal */}
      {selectedPromo && (
        <PromoCodeDetailModal 
          promo={selectedPromo}
          onClose={() => setSelectedPromo(null)}
        />
      )}
    </div>
  );
}
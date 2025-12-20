import { MapPin, TrendingUp, ChevronLeft, ChevronRight, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';

interface PopularRoutesProps {
  onRouteClick?: (from: string, to: string) => void;
}

export function PopularRoutes({ onRouteClick }: PopularRoutesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language, t } = useLanguage();

  const routes = [
    {
      from: 'TP. Hồ Chí Minh',
      to: 'Đà Lạt',
      trips: '45',
      price: '220.000đ',
      duration: '6h 30m',
      image: 'https://images.unsplash.com/photo-1678099006439-dba9e4d3f9f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyMExhdCUyMG1vdW50YWlufGVufDF8fHx8MTc2NTI0NTA0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      from: 'TP. Hồ Chí Minh',
      to: 'Nha Trang',
      trips: '38',
      price: '280.000đ',
      duration: '8h',
      image: 'https://images.unsplash.com/photo-1687025846473-9bd391575faa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaGElMjBUcmFuZyUyMGNvYXN0bGluZXxlbnwxfHx8fDE3NjUyNDUwNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-teal-500 to-emerald-500'
    },
    {
      from: 'TP. Hồ Chí Minh',
      to: 'Vũng Tàu',
      trips: '52',
      price: '120.000đ',
      duration: '2h 30m',
      image: 'https://images.unsplash.com/photo-1663076224163-14f585360f50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWdW5nJTIwVGF1JTIwc3Vuc2V0fGVufDF8fHx8MTc2NTI0NTA0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      from: 'Hà Nội',
      to: 'Hải Phòng',
      trips: '40',
      price: '150.000đ',
      duration: '2h',
      image: 'https://images.unsplash.com/photo-1712990349963-ab5dbd54a450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYWklMjBQaG9uZyUyMHBvcnR8ZW58MXx8fHwxNzY1MjQ1MDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      from: 'Đà Nẵng',
      to: 'Hội An',
      trips: '60',
      price: '50.000đ',
      duration: '45m',
      image: 'https://images.unsplash.com/photo-1696215103476-985902d02b1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyME5hbmclMjBiZWFjaCUyMGJyaWRnZXxlbnwxfHx8fDE3NjUyMzAxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      from: 'Hà Nội',
      to: 'Sa Pa',
      trips: '25',
      price: '300.000đ',
      duration: '5h',
      image: 'https://images.unsplash.com/photo-1613903491514-b3655f390093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyMExhdCUyMGZsb3dlciUyMGNpdHl8ZW58MXx8fHwxNzY1MjMwMTIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  // Auto-scroll animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % routes.length);
    }, 4000); // Change every 4 seconds
    
    return () => clearInterval(interval);
  }, [routes.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + routes.length) % routes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % routes.length);
  };

  const visibleRoutes = [
    routes[(currentIndex - 1 + routes.length) % routes.length],
    routes[currentIndex],
    routes[(currentIndex + 1) % routes.length],
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 rounded-full border border-blue-200 dark:border-blue-700 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-900 dark:text-blue-200">
              {t('popularRoutes')}
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
            <div className="flex gap-4 transition-transform duration-500 ease-out">
              {visibleRoutes.map((route, index) => {
                const isCenter = index === 1;
                return (
                  <div
                    key={route.from + route.to + index}
                    onClick={() => isCenter && onRouteClick?.(route.from, route.to)}
                    className={`flex-shrink-0 transition-all duration-500 ${
                      isCenter ? 'w-[calc(50%-8px)] opacity-100' : 'w-[calc(25%-8px)] opacity-60'
                    }`}
                  >
                    <div className={`relative group cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all ${
                      isCenter ? 'scale-100 hover:scale-[1.02]' : 'scale-90'
                    }`}>
                      <div className="relative h-56 overflow-hidden">
                        <ImageWithFallback
                          src={route.image}
                          alt={`${route.from} to ${route.to}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        
                        {/* Route Badge */}
                        <div className="absolute top-4 left-4 right-4">
                          <div className={`inline-flex px-3 py-1 bg-gradient-to-r ${route.gradient} rounded-full text-white text-xs`}>
                            {route.trips} {language === 'vi' ? 'chuyến/ngày' : 'trips/day'}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center space-x-2 text-white mb-2">
                            <MapPin className="w-4 h-4" />
                            <div className="text-lg">
                              {route.from} → {route.to}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-white/90">
                              <Clock className="w-3 h-3" />
                              <span>{route.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-green-400">
                              <DollarSign className="w-3 h-3" />
                              <span>{language === 'vi' ? 'Từ' : 'From'} {route.price}</span>
                            </div>
                          </div>
                          {isCenter && (
                            <button className="w-full mt-3 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all text-sm">
                              {t('search')}
                            </button>
                          )}
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
            {routes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-blue-500 to-teal-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import { ArrowLeft, MapPin, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';

interface RoutesPageProps {
  onBack: () => void;
  onRouteClick?: (from: string, to: string) => void;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onMyTripsClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onContactClick?: () => void;
  onTicketLookupClick?: () => void;
  onHotlineClick?: () => void;
}

export function RoutesPage({ 
  onBack, 
  onRouteClick,
  isLoggedIn,
  onLoginClick,
  onMyTripsClick,
  onProfileClick,
  onLogout,
  onContactClick,
  onTicketLookupClick,
  onHotlineClick
}: RoutesPageProps) {
  const { t } = useLanguage();

  const routes = [
    { 
      from: 'TP. Hồ Chí Minh', 
      to: 'Đà Lạt', 
      trips: '45', 
      price: '220.000đ', 
      duration: '6h', 
      image: 'https://images.unsplash.com/photo-1688952397241-1857af9c5da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyMExhdCUyMG1vdW50YWluJTIwY2l0eSUyMFZpZXRuYW18ZW58MXx8fHwxNzY1ODU4NTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      from: 'TP. Hồ Chí Minh', 
      to: 'Nha Trang', 
      trips: '38', 
      price: '280.000đ', 
      duration: '8h', 
      image: 'https://images.unsplash.com/photo-1692449353169-20f861617766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaGElMjBUcmFuZyUyMGJlYWNoJTIwY29hc3R8ZW58MXx8fHwxNzY1ODU4NTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-teal-500 to-emerald-500'
    },
    { 
      from: 'TP. Hồ Chí Minh', 
      to: 'Vũng Tàu', 
      trips: '52', 
      price: '120.000đ', 
      duration: '2h', 
      image: 'https://images.unsplash.com/photo-1616510670481-c290222959f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWdW5nJTIwVGF1JTIwc3Vuc2V0JTIwYmVhY2h8ZW58MXx8fHwxNzY1ODU4NTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      from: 'TP. Hồ Chí Minh', 
      to: 'Phan Thiết', 
      trips: '30', 
      price: '150.000đ', 
      duration: '4h', 
      image: 'https://images.unsplash.com/photo-1735786302684-88f447dce57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQaGFuJTIwVGhpZXQlMjBzYW5kJTIwZHVuZXN8ZW58MXx8fHwxNzY1ODU4NTY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-amber-500 to-orange-500'
    },
    { 
      from: 'TP. Hồ Chí Minh', 
      to: 'Cần Thơ', 
      trips: '25', 
      price: '180.000đ', 
      duration: '4h', 
      image: 'https://images.unsplash.com/photo-1673675865894-00df0e4fe6cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYW4lMjBUaG8lMjBNZWtvbmclMjByaXZlcnxlbnwxfHx8fDE3NjU4NTg1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      from: 'Hà Nội', 
      to: 'Hải Phòng', 
      trips: '40', 
      price: '150.000đ', 
      duration: '2h', 
      image: 'https://images.unsplash.com/photo-1757839727191-7aac248ad72b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYWklMjBQaG9uZyUyMHBvcnQlMjBjaXR5fGVufDF8fHx8MTc2NTg1ODU2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      from: 'Hà Nội', 
      to: 'Sa Pa', 
      trips: '20', 
      price: '350.000đ', 
      duration: '6h', 
      image: 'https://images.unsplash.com/photo-1649530928914-c2df337e3007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYXBhJTIwbW91bnRhaW4lMjB0ZXJyYWNlc3xlbnwxfHx8fDE3NjU4NTg1Njl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-indigo-500 to-purple-500'
    },
    { 
      from: 'Hà Nội', 
      to: 'Huế', 
      trips: '15', 
      price: '450.000đ', 
      duration: '12h', 
      image: 'https://images.unsplash.com/photo-1720456485611-a266e43e2bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIdWUlMjBpbXBlcmlhbCUyMGNpdHklMjBWaWV0bmFtfGVufDF8fHx8MTc2NTg1ODU2OXww&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-pink-500 to-rose-500'
    },
    { 
      from: 'Đà Nẵng', 
      to: 'Hội An', 
      trips: '35', 
      price: '50.000đ', 
      duration: '1h', 
      image: 'https://images.unsplash.com/photo-1696215103476-985902d02b1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyME5hbmclMjBiZWFjaCUyMGJyaWRnZXxlbnwxfHx8fDE3NjUyMzAxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-yellow-500 to-amber-500'
    },
    { 
      from: 'Đà Nẵng', 
      to: 'Huế', 
      trips: '28', 
      price: '120.000đ', 
      duration: '3h', 
      image: 'https://images.unsplash.com/photo-1720456485611-a266e43e2bca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIdWUlMjBpbXBlcmlhbCUyMGNpdHklMjBWaWV0bmFtfGVufDF8fHx8MTc2NTg1ODU2OXww&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-blue-600 to-indigo-500'
    },
    { 
      from: 'Nha Trang', 
      to: 'Đà Lạt', 
      trips: '22', 
      price: '180.000đ', 
      duration: '4h', 
      image: 'https://images.unsplash.com/photo-1688952397241-1857af9c5da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxEYSUyMExhdCUyMG1vdW50YWluJTIwY2l0eSUyMFZpZXRuYW18ZW58MXx8fHwxNzY1ODU4NTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-teal-600 to-cyan-500'
    },
    { 
      from: 'Quy Nhơn', 
      to: 'Nha Trang', 
      trips: '18', 
      price: '200.000đ', 
      duration: '5h', 
      image: 'https://images.unsplash.com/photo-1692449353169-20f861617766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOaGElMjBUcmFuZyUyMGJlYWNoJTIwY29hc3R8ZW58MXx8fHwxNzY1ODU4NTY0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      gradient: 'from-emerald-500 to-teal-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header
        onHomeClick={onBack}
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onMyTripsClick={onMyTripsClick}
        onProfileClick={onProfileClick}
        onLogout={onLogout}
        onRoutesClick={() => {}} 
        onContactClick={onContactClick}
        onTicketLookupClick={onTicketLookupClick}
        onHotlineClick={onHotlineClick}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-gray-900 dark:text-white mb-4">
            {t('allRoutes')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('routesSubtitle')}
          </p>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <div
              key={index}
              onClick={() => onRouteClick?.(route.from, route.to)}
              className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-2 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={route.image}
                  alt={`${route.from} to ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Gradient Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 bg-gradient-to-r ${route.gradient} rounded-full text-white text-sm shadow-lg`}>
                    {route.trips} {t('tripsPerDay')}
                  </div>
                </div>

                {/* Route Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center space-x-2 text-white">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <div className="text-lg">
                      {route.from} → {route.to}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-600 dark:text-blue-400">
                      {t('from')} {route.price}
                    </span>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all transform group-hover:scale-105">
                  {t('search')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
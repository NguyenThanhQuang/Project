import { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Star, Download, X as XIcon } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface MyTripsProps {
  onBack: () => void;
}

interface BookedTrip {
  id: string;
  ticketCode: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  companyName: string;
  from: string;
  to: string;
  departureTime: string;
  date: string;
  seatNumber: string;
  price: number;
  busType: string;
  passengerName: string;
  boardingPoint: string;
}

const mockTrips: BookedTrip[] = [
  {
    id: '1',
    ticketCode: 'VX2024123001',
    status: 'upcoming',
    companyName: 'Phương Trang',
    from: 'TP. Hồ Chí Minh',
    to: 'Đà Lạt',
    departureTime: '05:00',
    date: '28/12/2024',
    seatNumber: 'A15',
    price: 250000,
    busType: 'Giường nằm',
    passengerName: 'Nguyễn Văn A',
    boardingPoint: 'Bến xe Miền Đông'
  },
  {
    id: '2',
    ticketCode: 'VX2024122501',
    status: 'completed',
    companyName: 'Thành Bưởi',
    from: 'Hà Nội',
    to: 'Hải Phòng',
    departureTime: '14:00',
    date: '25/12/2024',
    seatNumber: 'B10',
    price: 150000,
    busType: 'Ghế ngồi',
    passengerName: 'Nguyễn Văn A',
    boardingPoint: 'Bến xe Giáp Bát'
  },
  {
    id: '3',
    ticketCode: 'VX2024122001',
    status: 'cancelled',
    companyName: 'Hoa Mai',
    from: 'TP. Hồ Chí Minh',
    to: 'Nha Trang',
    departureTime: '08:00',
    date: '20/12/2024',
    seatNumber: 'A5',
    price: 220000,
    busType: 'Giường nằm',
    passengerName: 'Nguyễn Văn A',
    boardingPoint: 'Bến xe Miền Đông'
  }
];

export function MyTrips({ onBack }: MyTripsProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<BookedTrip | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const statusConfig = {
    upcoming: { label: t('upcomingStatus'), color: 'bg-blue-500 text-white', icon: '🚌' },
    completed: { label: t('completedStatus'), color: 'bg-green-500 text-white', icon: '✓' },
    cancelled: { label: t('cancelledStatus'), color: 'bg-gray-500 text-white', icon: '✗' }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const filteredTrips = mockTrips.filter(trip => {
    if (activeTab === 'all') return true;
    return trip.status === activeTab;
  });

  const handleRateTrip = (trip: BookedTrip) => {
    setSelectedTrip(trip);
    setShowRatingModal(true);
  };

  const submitRating = () => {
    console.log('Rating:', { tripId: selectedTrip?.id, rating, review });
    setShowRatingModal(false);
    setRating(0);
    setReview('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-gray-900 dark:text-white">{t('myTripsTitle')}</h1>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('allTrips')} ({mockTrips.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('upcoming')} ({mockTrips.filter(t => t.status === 'upcoming').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('completed')} ({mockTrips.filter(t => t.status === 'completed').length})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === 'cancelled'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('cancelled')} ({mockTrips.filter(t => t.status === 'cancelled').length})
            </button>
          </div>
        </div>
      </header>

      {/* Trips List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚌</div>
            <h3 className="text-gray-900 dark:text-white mb-2">{t('noTripsYet')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('noTripsDesc')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => {
              const statusInfo = statusConfig[trip.status];
              return (
                <div
                  key={trip.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">{t('ticketCode')}: {trip.ticketCode}</div>
                      <h3 className="text-gray-900 dark:text-white">{trip.companyName}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${statusInfo.color}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </div>

                  {/* Trip Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('route')}</div>
                        <div className="text-gray-900 dark:text-white">{trip.from} → {trip.to}</div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('time')}</div>
                        <div className="text-gray-900 dark:text-white">{trip.departureTime} - {trip.date}</div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('seatNumber')}</div>
                        <div className="text-gray-900 dark:text-white">{trip.seatNumber}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('busType')}</div>
                        <div className="text-gray-900 dark:text-white">{trip.busType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('pickupPoint')}</div>
                        <div className="text-gray-900 dark:text-white">{trip.boardingPoint}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('seatAndPrice')}</div>
                        <div className="text-blue-600 dark:text-blue-400">{formatPrice(trip.price)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>{t('downloadTicket')}</span>
                    </button>
                    
                    {trip.status === 'upcoming' && (
                      <button className="px-6 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-all">
                        {t('cancelTicket')}
                      </button>
                    )}
                    
                    {trip.status === 'completed' && (
                      <button
                        onClick={() => handleRateTrip(trip)}
                        className="px-6 py-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-all flex items-center space-x-2"
                      >
                        <Star className="w-4 h-4" />
                        <span>{t('rateTrip')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedTrip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 dark:text-white">{t('ratingModalTitle')}</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <XIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div className="text-center mb-6">
              <div className="text-gray-900 dark:text-white mb-2">{selectedTrip.companyName}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {selectedTrip.from} → {selectedTrip.to}
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('yourRating')}</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={t('shareExperience')}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={submitRating}
              disabled={rating === 0}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('submitRating')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
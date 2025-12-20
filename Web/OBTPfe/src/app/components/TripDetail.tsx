import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Calendar, Shield, Wifi, Coffee, Star, User, Tag, Percent, Users, Info, Armchair } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { PromoCodeModal } from './PromoCodeModal';
import { useLanguage } from './LanguageContext';

interface TripDetailProps {
  tripId: string;
  onBack: () => void;
  onBooking: (selectedSeats: string[]) => void;
}

interface Seat {
  number: string;
  status: 'available' | 'selected' | 'booked' | 'holding';
  floor: 1 | 2;
  position: 'left' | 'right'; // Trái hoặc phải lối đi
}

// Mock seats cho xe giường nằm 40 chỗ
// Layout: 2 tầng x 20 giường (1-1 layout: Trái-Lối đi-Phải)
const mockSeats: Seat[] = [
  // Tầng 1 - Bên trái (10 giường)
  ...Array.from({ length: 10 }, (_, i) => ({
    number: `${i + 1}`,
    status: i < 2 ? ('booked' as const) : i < 3 ? ('holding' as const) : ('available' as const),
    floor: 1 as const,
    position: 'left' as const
  })),
  // Tầng 1 - Bên phải (10 giường)
  ...Array.from({ length: 10 }, (_, i) => ({
    number: `${i + 11}`,
    status: i < 1 ? ('booked' as const) : ('available' as const),
    floor: 1 as const,
    position: 'right' as const
  })),
  // Tầng 2 - Bên trái (10 giường)
  ...Array.from({ length: 10 }, (_, i) => ({
    number: `${i + 21}`,
    status: i < 1 ? ('booked' as const) : ('available' as const),
    floor: 2 as const,
    position: 'left' as const
  })),
  // Tầng 2 - Bên phải (10 giường)
  ...Array.from({ length: 10 }, (_, i) => ({
    number: `${i + 31}`,
    status: ('available' as const),
    floor: 2 as const,
    position: 'right' as const
  }))
];

export function TripDetail({ tripId, onBack, onBooking }: TripDetailProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPromoCodeModal, setShowPromoCodeModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const { t, language } = useLanguage();

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'holding') return;

    if (selectedSeats.includes(seat.number)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat.number));
    } else {
      setSelectedSeats([...selectedSeats, seat.number]);
    }
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.number)) {
      return 'bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-500/50 scale-105';
    }
    if (seat.status === 'booked') {
      return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white border-gray-400 cursor-not-allowed opacity-60';
    }
    if (seat.status === 'holding') {
      return 'bg-gradient-to-br from-orange-400 to-orange-500 text-white border-orange-400 cursor-not-allowed opacity-60';
    }
    return 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 hover:shadow-md';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Lọc ghế theo tầng
  const leftSeats = mockSeats.filter(s => s.floor === activeFloor && s.position === 'left').sort((a, b) => parseInt(a.number) - parseInt(b.number));
  const rightSeats = mockSeats.filter(s => s.floor === activeFloor && s.position === 'right').sort((a, b) => parseInt(a.number) - parseInt(b.number));

  const handleBookNow = () => {
    if (selectedSeats.length === 0) {
      alert(t('selectSeat'));
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    onBooking(selectedSeats);
  };

  const totalAmount = selectedSeats.length * 250000 - discount;

  const handleApplyPromoCode = (code: string) => {
    setPromoCode(code);
    // Simple promo code logic - can be expanded
    if (code === 'SUMMER20') {
      setDiscount(selectedSeats.length * 250000 * 0.2);
    } else if (code === 'NEWYEAR50K') {
      setDiscount(50000);
    } else if (code === 'DALAT15') {
      setDiscount(selectedSeats.length * 250000 * 0.15);
    } else if (code === 'WEEKEND10') {
      setDiscount(selectedSeats.length * 250000 * 0.1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-2xl text-gray-900 dark:text-white">{t('tripDetails')}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-32">
        {/* Trip Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center text-3xl">
              🚌
            </div>
            <div>
              <h2 className="text-xl text-gray-900 dark:text-white mb-1">{t('busCompany')}: Phương Trang</h2>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-base text-gray-700 dark:text-gray-300">4.8</span>
                <span className="text-sm text-gray-400">(234 {t('reviews')})</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('departureTime')}</div>
                <div className="text-base text-gray-900 dark:text-white">05:00 - 28/12/2024</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('route')}</div>
                <div className="text-base text-gray-900 dark:text-white">TP.HCM → Đà Lạt</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm">
              {t('sleeperBus')}
            </span>
            <div className="flex items-center space-x-2">
              {[Wifi, Coffee, Star, User].map((Icon, i) => (
                <div key={i} className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10 rounded-2xl p-4 mb-4">
            <h4 className="text-base text-gray-600 dark:text-gray-400 mb-3">{t('vehicleDetails')}</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{t('vehicleType')}</div>
                <div className="text-sm text-gray-900 dark:text-white">{t('sleeperBus')}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{t('capacity')}</div>
                <div className="text-sm text-gray-900 dark:text-white">40 {t('beds')} (2 {t('floor2')})</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{t('licensePlate')}</div>
                <div className="text-sm text-gray-900 dark:text-white">51B-123.45</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500">{t('amenities')}</div>
                <div className="text-sm text-gray-900 dark:text-white">WiFi, {t('water')}, TV</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-base text-gray-600 dark:text-gray-400">{t('ticketPrice')}</span>
              <span className="text-2xl text-blue-600 dark:text-blue-400">{formatPrice(250000)}</span>
            </div>
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-gray-900 dark:text-white">{t('promoCode')}</h3>
            <button
              onClick={() => setShowPromoCodeModal(true)}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              {t('viewDetails')}
            </button>
          </div>

          {promoCode ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl p-4 border-2 border-green-300 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="text-sm text-green-700 dark:text-green-300">{t('promoCodeApplied')}</div>
                    <div className="text-base text-green-900 dark:text-green-100">{promoCode}</div>
                  </div>
                </div>
              <button
                onClick={() => {
                  setPromoCode('');
                  setDiscount(0);
                }}
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                {t('delete')}
              </button>
            </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPromoCodeModal(true)}
              className="w-full bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10 rounded-2xl p-4 flex items-center justify-between border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
            >
              <div className="flex items-center space-x-3">
                <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-base text-gray-700 dark:text-gray-300">{t('enterPromoCode')}</span>
              </div>
              <span className="text-blue-600 dark:text-blue-400">&gt;</span>
            </button>
          )}
        </div>

        {/* Seat Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <h3 className="text-xl text-gray-900 dark:text-white mb-4">{t('selectSeat')}</h3>

          {/* Floor Toggle */}
          <div className="flex items-center space-x-2 mb-6">
            <button
              onClick={() => setActiveFloor(1)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all text-base ${
                activeFloor === 1
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('floor1')}
            </button>
            <button
              onClick={() => setActiveFloor(2)}
              className={`flex-1 py-3 rounded-xl font-medium transition-all text-base ${
                activeFloor === 2
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('floor2')}
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg"></div>
              <span className="text-gray-600 dark:text-gray-400">{t('available')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-600 rounded-lg shadow-lg shadow-blue-500/50"></div>
              <span className="text-gray-600 dark:text-gray-400">{t('selected')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 border-2 border-gray-400 rounded-lg opacity-60"></div>
              <span className="text-gray-600 dark:text-gray-400">{t('booked')}</span>
            </div>
          </div>

          {/* Seat Map - Realistic Bus Layout */}
          <div className="relative bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
            {/* Driver seat indicator */}
            <div className="flex justify-end mb-4">
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400">{t('driver')}</span>
              </div>
            </div>

            {/* Bus Layout: Left seats - Aisle - Right seats */}
            <div className="space-y-3">
              {leftSeats.map((leftSeat, index) => {
                const rightSeat = rightSeats[index];
                return (
                  <div key={index} className="flex items-center gap-4">
                    {/* Left Seat */}
                    <button
                      onClick={() => handleSeatClick(leftSeat)}
                      disabled={leftSeat.status === 'booked' || leftSeat.status === 'holding'}
                      className={`flex-1 h-16 border-2 rounded-xl transition-all flex items-center justify-center ${getSeatColor(leftSeat)}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Armchair className="w-5 h-5" />
                        <span className="text-base font-medium">{leftSeat.number}</span>
                      </div>
                    </button>

                    {/* Aisle */}
                    <div className="w-12 flex justify-center">
                      <div className="h-0.5 w-8 bg-gray-300 dark:bg-gray-600"></div>
                    </div>

                    {/* Right Seat */}
                    <button
                      onClick={() => handleSeatClick(rightSeat)}
                      disabled={rightSeat.status === 'booked' || rightSeat.status === 'holding'}
                      className={`flex-1 h-16 border-2 rounded-xl transition-all flex items-center justify-center ${getSeatColor(rightSeat)}`}
                    >
                      <div className="flex items-center space-x-2">
                        <Armchair className="w-5 h-5" />
                        <span className="text-base font-medium">{rightSeat.number}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            {language === 'vi' 
              ? 'Vui lòng chọn ghế và tiến hành đặt vé. Ghế sẽ được giữ trong 15 phút.'
              : 'Please select seats and proceed with booking. Seats will be held for 15 minutes.'}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedSeats.length > 0 
                ? `${t('selected')} ${selectedSeats.length} ${t('seats')}: ${selectedSeats.sort((a, b) => parseInt(a) - parseInt(b)).join(', ')}`
                : language === 'vi' ? 'Chưa chọn ghế' : 'No seats selected'}
            </div>
            <div className="text-2xl text-gray-900 dark:text-white">
              {formatPrice(totalAmount)}
            </div>
            {discount > 0 && (
              <div className="text-sm text-green-600 dark:text-green-400">
                {language === 'vi' ? 'Đã giảm' : 'Discount'}: -{formatPrice(discount)}
              </div>
            )}
          </div>
          <button
            onClick={handleBookNow}
            disabled={selectedSeats.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
          >
            {t('completePayment')}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
          amount={totalAmount}
          ticketInfo={{
            route: 'TP.HCM → Đà Lạt',
            date: '28/12/2024',
            time: '05:00',
            seats: selectedSeats
          }}
        />
      )}

      {/* Promo Code Modal */}
      {showPromoCodeModal && (
        <PromoCodeModal
          onClose={() => setShowPromoCodeModal(false)}
          onApply={handleApplyPromoCode}
        />
      )}
    </div>
  );
}

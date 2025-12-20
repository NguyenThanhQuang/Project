import { useState } from 'react';
import { Search, Ticket, Phone, ArrowLeft, MapPin, Clock, User as UserIcon, CreditCard } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Header } from './Header';

interface TicketLookupProps {
  onBack: () => void;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onMyTripsClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onRoutesClick?: () => void;
  onContactClick?: () => void;
  onTicketLookupClick?: () => void;
  onHotlineClick?: () => void;
}

export function TicketLookup({ 
  onBack,
  isLoggedIn,
  onLoginClick,
  onMyTripsClick,
  onProfileClick,
  onLogout,
  onRoutesClick,
  onContactClick,
  onTicketLookupClick,
  onHotlineClick
}: TicketLookupProps) {
  const { t } = useLanguage();
  const [ticketCode, setTicketCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate search
    setSearchResult({
      ticketCode: 'VX2024123001',
      status: 'confirmed',
      passengerName: 'Nguyễn Văn A',
      phone: '0909123456',
      from: 'TP. Hồ Chí Minh',
      to: 'Đà Lạt',
      departureTime: '05:00',
      date: '28/12/2024',
      seatNumber: 'A15',
      price: 250000,
      companyName: 'Phương Trang',
      busType: 'Giường nằm',
      boardingPoint: 'Bến xe Miền Đông'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header
        onHomeClick={onBack}
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onMyTripsClick={onMyTripsClick}
        onProfileClick={onProfileClick}
        onLogout={onLogout}
        onRoutesClick={onRoutesClick}
        onContactClick={onContactClick}
        onTicketLookupClick={onTicketLookupClick}
        onHotlineClick={onHotlineClick}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-teal-500 text-white p-4 rounded-2xl mb-4">
              <Ticket className="w-8 h-8" />
            </div>
            <h2 className="text-gray-900 dark:text-white mb-2">{t('ticketLookupHeader')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('ticketLookupSubtitle')}
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('ticketCode')}</label>
              <div className="relative">
                <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  placeholder={t('ticketCodePlaceholder')}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('phoneNumber')}</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t('phoneNumberPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>{t('lookupButton')}</span>
            </button>
          </form>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-center text-white">
              <div className="text-lg">✓ {t('ticketConfirmed')}</div>
            </div>

            <div className="p-6">
              {/* Ticket Code */}
              <div className="text-center mb-6">
                <div className="text-3xl text-gray-900 dark:text-white mb-2">{searchResult.ticketCode}</div>
                <div className="text-gray-600 dark:text-gray-400">{t('bookingCode')}</div>
              </div>

              {/* Trip Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('route')}</div>
                      <div className="text-gray-900 dark:text-white">{searchResult.from} → {searchResult.to}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('time')}</div>
                      <div className="text-gray-900 dark:text-white">{searchResult.departureTime} - {searchResult.date}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('passenger')}</div>
                      <div className="text-gray-900 dark:text-white">{searchResult.passengerName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{searchResult.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('seatAndPrice')}</div>
                      <div className="text-gray-900 dark:text-white">{t('seat')} {searchResult.seatNumber} • {formatPrice(searchResult.price)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">{t('busCompany')}</span>
                  <span className="text-gray-900 dark:text-white">{searchResult.companyName}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">{t('busType')}</span>
                  <span className="text-gray-900 dark:text-white">{searchResult.busType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('pickupPoint')}</span>
                  <span className="text-gray-900 dark:text-white">{searchResult.boardingPoint}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  {t('printTicket')}
                </button>
                <button className="py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-all">
                  {t('cancelTicket')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
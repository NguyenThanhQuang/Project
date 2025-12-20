import { Download, Share2, MapPin, Calendar, Clock, Users, Ticket as TicketIcon, ArrowLeft, Phone, AlertCircle } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

interface QRTicketPageProps {
  onBack: () => void;
  ticketData: {
    bookingId: string;
    from: string;
    to: string;
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
    companyName: string;
    passengerName: string;
    passengerPhone: string;
    status: 'active' | 'used' | 'cancelled';
  };
}

export function QRTicketPage({ onBack, ticketData }: QRTicketPageProps) {
  const { t } = useLanguage();
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Generate QR code
    const qrData = JSON.stringify({
      bookingId: ticketData.bookingId,
      passengerName: ticketData.passengerName,
      seats: ticketData.seats,
      date: ticketData.date,
      time: ticketData.time
    });

    QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#ffffff'
      }
    }).then(url => {
      setQrCodeUrl(url);
    });
  }, [ticketData]);

  const statusConfig = {
    active: {
      labelKey: 'active',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      badge: '✓'
    },
    used: {
      labelKey: 'completed',
      color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      badge: '✗'
    },
    cancelled: {
      labelKey: 'cancelled',
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      badge: '✗'
    }
  };

  const currentStatus = statusConfig[ticketData.status];

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
            <span>{t('back')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
              <TicketIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl text-green-900 dark:text-green-100">{t('bookingSuccess')}</h2>
          </div>
          <p className="text-green-700 dark:text-green-300">{t('bookingSuccessDesc')}</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <TicketIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">{t('qrTicketTitle')}</p>
                    <p className="text-2xl">VeXe.com</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-xl ${currentStatus.color}`}>
                  {currentStatus.badge} {t(currentStatus.labelKey)}
                </span>
              </div>
              <p className="text-blue-100 text-sm">{t('bookingCode')}</p>
              <p className="text-3xl tracking-wider mb-2">{ticketData.bookingId}</p>
              <p className="text-blue-100">{ticketData.companyName}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-8 text-center border-b-2 border-dashed border-gray-200 dark:border-gray-700">
            {qrCodeUrl && (
              <div className="inline-block p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              {t('showQRCode')}
            </p>
          </div>

          {/* Trip Details */}
          <div className="p-6 space-y-6">
            {/* Route */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('route')}</p>
                  <p className="text-xl text-gray-900 dark:text-white">
                    {ticketData.from} → {ticketData.to}
                  </p>
                </div>
              </div>
            </div>

            {/* DateTime Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('date')}</p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white">{ticketData.date}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('time')}</p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white">{ticketData.time}</p>
              </div>
            </div>

            {/* Passenger & Seats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('passenger')}</p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white">{ticketData.passengerName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{ticketData.passengerPhone}</p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="flex items-center space-x-2 mb-2">
                  <TicketIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('seatNumber')}</p>
                </div>
                <p className="text-lg text-gray-900 dark:text-white">{ticketData.seats.join(', ')}</p>
              </div>
            </div>

            {/* Total Price */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 rounded-2xl border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <p className="text-lg text-gray-700 dark:text-gray-300">{t('totalAmount')}</p>
                <p className="text-3xl text-blue-600 dark:text-blue-400">
                  {ticketData.totalPrice.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4">
              <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('downloadQR')}</span>
              </button>

              <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('shareQR')}</span>
              </button>

              <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <TicketIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('printQR')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-xl text-yellow-900 dark:text-yellow-100">{t('importantNotes')}</h3>
          </div>
          <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>{t('note1')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>{t('note2')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>{t('note3')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>•</span>
              <span>{t('note4')}</span>
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mt-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl text-gray-900 dark:text-white mb-4">{t('needHelp')}</h3>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('customerCare')}</p>
              <a href="tel:1900123456" className="text-lg text-blue-600 dark:text-blue-400 hover:underline">
                1900 123 456
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

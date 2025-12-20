import { ArrowLeft, Users, CheckCircle, Clock, MapPin, Phone, Navigation, AlertTriangle, Search, QrCode } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface Passenger {
  id: string;
  name: string;
  phone: string;
  seatNumber: string;
  checkedIn: boolean;
  ticketCode: string;
  boardingPoint: string;
}

interface TripDetailProps {
  onBack: () => void;
  onScanQR: () => void;
}

const mockPassengers: Passenger[] = [
  { id: '1', name: 'Nguyễn Văn A', phone: '0909123456', seatNumber: 'A1', checkedIn: true, ticketCode: 'TKT001', boardingPoint: 'Bến xe Miền Đông' },
  { id: '2', name: 'Trần Thị B', phone: '0909234567', seatNumber: 'A2', checkedIn: true, ticketCode: 'TKT002', boardingPoint: 'Bến xe Miền Đông' },
  { id: '3', name: 'Lê Văn C', phone: '0909345678', seatNumber: 'A3', checkedIn: false, ticketCode: 'TKT003', boardingPoint: 'Bến xe Miền Đông' },
  { id: '4', name: 'Phạm Thị D', phone: '0909456789', seatNumber: 'A4', checkedIn: false, ticketCode: 'TKT004', boardingPoint: 'Bến xe An Sương' },
  { id: '5', name: 'Hoàng Văn E', phone: '0909567890', seatNumber: 'B1', checkedIn: true, ticketCode: 'TKT005', boardingPoint: 'Bến xe Miền Đông' },
];

export function TripDetail({ onBack }: TripDetailProps) {
  const { t } = useLanguage();
  const [tripStatus, setTripStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
  const [passengers, setPassengers] = useState(mockPassengers);
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked-in' | 'not-checked-in'>('all');

  const checkedInCount = passengers.filter(p => p.checkedIn).length;
  const totalPassengers = passengers.length;
  const checkedInPercentage = (checkedInCount / totalPassengers) * 100;

  const filteredPassengers = passengers.filter(p => {
    if (filterStatus === 'checked-in') return p.checkedIn;
    if (filterStatus === 'not-checked-in') return !p.checkedIn;
    return true;
  });

  const handleTripStatusToggle = () => {
    if (tripStatus === 'not-started') {
      setTripStatus('in-progress');
    } else if (tripStatus === 'in-progress') {
      setTripStatus('completed');
    }
  };

  const handlePassengerCheckIn = (passengerId: string) => {
    setPassengers(passengers.map(p =>
      p.id === passengerId ? { ...p, checkedIn: !p.checkedIn } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-white">{t('demoDestination')}</h1>
              <p className="text-gray-600 dark:text-gray-400">05:00 - 28/12/2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
            <div className="text-2xl text-gray-900 dark:text-white mb-1">{totalPassengers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalPassengers')}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
            <div className="text-2xl text-gray-900 dark:text-white mb-1">{checkedInCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('checkedIn')}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
            <div className="text-2xl text-gray-900 dark:text-white mb-1">{totalPassengers - checkedInCount}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('waiting')}</div>
          </div>
        </div>

        {/* Check-in Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 dark:text-white">{t('checkinProgress')}</h3>
            <span className="text-blue-600 dark:text-blue-400">{checkedInCount} / {totalPassengers}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500"
              style={{ width: `${(checkedInCount / totalPassengers) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all active:scale-95">
            <Navigation className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">{t('navigation')}</span>
          </button>
          <button className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all active:scale-95">
            <Phone className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">{t('callDispatch')}</span>
          </button>
          <button className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all active:scale-95">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
            <span className="text-xs text-gray-700 dark:text-gray-300">{t('reportIssue')}</span>
          </button>
        </div>

        {/* Passenger List */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white">{t('passengerList')}</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t('all')} ({totalPassengers})</option>
              <option value="checked-in">{t('checkedIn')} ({checkedInCount})</option>
              <option value="not-checked-in">{t('notCheckedIn')} ({totalPassengers - checkedInCount})</option>
            </select>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredPassengers.map((passenger) => (
              <div key={passenger.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-gray-900 dark:text-white">{passenger.name}</h4>
                      {passenger.checkedIn && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>{t('onBoard')}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm mb-2">
                      <a
                        href={`tel:${passenger.phone}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {passenger.phone}
                      </a>
                      <span className="text-gray-600 dark:text-gray-400">{t('seatLabel')} {passenger.seatNumber}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {passenger.boardingPoint} • {t('ticketCodeLabel')} {passenger.ticketCode}
                    </div>
                  </div>
                  <button
                    onClick={() => handlePassengerCheckIn(passenger.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      passenger.checkedIn
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                    }`}
                  >
                    {passenger.checkedIn && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onScanQR}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 active:scale-95 flex items-center justify-center z-20"
      >
        <QrCode className="w-8 h-8" />
      </button>
    </div>
  );
}
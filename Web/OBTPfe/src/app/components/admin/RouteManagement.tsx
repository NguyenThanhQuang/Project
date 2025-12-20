import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Calendar, Clock, UserPlus } from 'lucide-react';
import { DriverAssignment } from '../DriverAssignment';
import { useLanguage } from '../LanguageContext';

interface Trip {
  id: string;
  route: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  vehiclePlate: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: 'scheduled' | 'running' | 'completed' | 'cancelled';
}

export function RouteManagement() {
  const { t, language } = useLanguage();
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      route: 'TP.HCM → Đà Lạt',
      from: 'TP. Hồ Chí Minh',
      to: 'Đà Lạt',
      departureTime: '05:00',
      arrivalTime: '12:30',
      date: '28/12/2024',
      vehiclePlate: '51B-12345',
      price: 250000,
      availableSeats: 15,
      totalSeats: 40,
      status: 'scheduled'
    },
    {
      id: '2',
      route: 'TP.HCM → Nha Trang',
      from: 'TP. Hồ Chí Minh',
      to: 'Nha Trang',
      departureTime: '14:30',
      arrivalTime: '22:30',
      date: '28/12/2024',
      vehiclePlate: '51B-67890',
      price: 220000,
      availableSeats: 8,
      totalSeats: 40,
      status: 'running'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDriverAssignment, setShowDriverAssignment] = useState(false);
  const [selectedTripForDriver, setSelectedTripForDriver] = useState<string | null>(null);

  const statusConfig = {
    scheduled: { label: t('scheduledStatus'), color: 'bg-blue-500' },
    running: { label: t('runningStatus'), color: 'bg-orange-500' },
    completed: { label: t('completedStatus'), color: 'bg-green-500' },
    cancelled: { label: t('cancelledStatus'), color: 'bg-red-500' }
  };

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleAssignDriver = (tripId: string) => {
    setSelectedTripForDriver(tripId);
    setShowDriverAssignment(true);
  };

  const handleDriverAssigned = (driverId: string) => {
    console.log(`Driver ${driverId} assigned to trip ${selectedTripForDriver}`);
    alert(t('driverAssigned'));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">{t('routeManagementTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('routeManagementDesc')}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createNewTrip')}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">{trips.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalTrips')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-blue-600 mb-1">{trips.filter(t => t.status === 'scheduled').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('scheduledTrips')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-orange-600 mb-1">{trips.filter(t => t.status === 'running').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('runningTrips')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-green-600 mb-1">
            {trips.reduce((sum, t) => sum + (t.totalSeats - t.availableSeats), 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalTicketsSold')}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchRoute')}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">{t('allStatus')}</option>
            <option value="scheduled">{t('scheduledStatus')}</option>
            <option value="running">{t('runningStatus')}</option>
            <option value="completed">{t('completedStatus')}</option>
            <option value="cancelled">{t('cancelledStatus')}</option>
          </select>
        </div>
      </div>

      {/* Trip List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('routeColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('timeColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('vehicle')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('priceColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('seatsColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTrips.map((trip) => {
                const statusInfo = statusConfig[trip.status];
                const soldSeats = trip.totalSeats - trip.availableSeats;
                const soldPercentage = (soldSeats / trip.totalSeats) * 100;

                return (
                  <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white">{trip.route}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{trip.date}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white">{trip.departureTime} - {trip.arrivalTime}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{trip.vehiclePlate}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{formatPrice(trip.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-gray-900 dark:text-white">{soldSeats}/{trip.totalSeats}</div>
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-teal-500"
                            style={{ width: `${soldPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${statusInfo.color} rounded-full`}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{statusInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAssignDriver(trip.id)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title={t('assignDriver')}
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 dark:text-white">{t('createNewTrip')}</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('fromLocation')}</label>
                  <input
                    type="text"
                    placeholder="TP. Hồ Chí Minh"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('toLocation')}</label>
                  <input
                    type="text"
                    placeholder="Đà Lạt"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('departureDate')}</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('departureTime')}</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('arrivalTime')}</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('selectVehicle')}</label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                    <option>51B-12345 - {t('sleeperBusOption')} (40 {t('seats')})</option>
                    <option>51B-67890 - {t('vipSleeperBus')} (36 {t('seats')})</option>
                    <option>51B-11111 - {t('seatBusOption')} (45 {t('seats')})</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('ticketPrice')}</label>
                  <input
                    type="number"
                    placeholder="250000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                >
                  {t('createTrip')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Assignment Modal */}
      {showDriverAssignment && selectedTripForDriver && (
        <DriverAssignment
          tripId={selectedTripForDriver}
          onClose={() => setShowDriverAssignment(false)}
          onAssign={handleDriverAssigned}
        />
      )}
    </div>
  );
}
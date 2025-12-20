import { ArrowLeft, Calendar, MapPin, Clock, User, Search, Filter, Plus } from 'lucide-react';
import { useState } from 'react';

interface DriverAssignmentProps {
  onBack: () => void;
}

export function DriverAssignment({ onBack }: DriverAssignmentProps) {
  const [selectedDate, setSelectedDate] = useState('2024-12-05');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const trips = [
    {
      id: '1',
      route: 'TP. HCM → Đà Lạt',
      time: '08:00',
      vehicle: 'Xe giường nằm 40 chỗ',
      plate: '51B-12345',
      driver: null,
      status: 'unassigned'
    },
    {
      id: '2',
      route: 'Đà Lạt → TP. HCM',
      time: '14:00',
      vehicle: 'Xe giường nằm 40 chỗ',
      plate: '51B-67890',
      driver: { id: 'D001', name: 'Nguyễn Văn A', rating: 4.8 },
      status: 'assigned'
    },
    {
      id: '3',
      route: 'TP. HCM → Nha Trang',
      time: '20:00',
      vehicle: 'Xe limousine 22 chỗ',
      plate: '51B-11111',
      driver: { id: 'D002', name: 'Trần Văn B', rating: 4.9 },
      status: 'assigned'
    },
    {
      id: '4',
      route: 'TP. HCM → Vũng Tàu',
      time: '06:00',
      vehicle: 'Xe limousine 22 chỗ',
      plate: '51B-22222',
      driver: null,
      status: 'unassigned'
    }
  ];

  const availableDrivers = [
    { id: 'D001', name: 'Nguyễn Văn A', rating: 4.8, trips: 245, status: 'available' },
    { id: 'D003', name: 'Lê Văn C', rating: 4.7, trips: 189, status: 'available' },
    { id: 'D004', name: 'Phạm Văn D', rating: 4.9, trips: 312, status: 'available' },
    { id: 'D005', name: 'Hoàng Văn E', rating: 4.6, trips: 156, status: 'available' }
  ];

  const handleAssign = (tripId: string) => {
    setSelectedTrip(tripId);
    setShowAssignModal(true);
  };

  const handleConfirmAssign = (driverId: string) => {
    console.log('Assigning driver', driverId, 'to trip', selectedTrip);
    setShowAssignModal(false);
    setSelectedTrip(null);
  };

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
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 dark:text-white mb-2">Phân Công Tài Xế</h1>
          <p className="text-gray-600 dark:text-gray-400">Quản lý phân công tài xế cho các chuyến đi</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tuyến đường..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>

          <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Lọc</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tổng chuyến</p>
            <p className="text-3xl text-gray-900 dark:text-white">{trips.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Đã phân công</p>
            <p className="text-3xl text-green-600 dark:text-green-400">
              {trips.filter(t => t.status === 'assigned').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Chưa phân công</p>
            <p className="text-3xl text-orange-600 dark:text-orange-400">
              {trips.filter(t => t.status === 'unassigned').length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tài xế sẵn sàng</p>
            <p className="text-3xl text-blue-600 dark:text-blue-400">{availableDrivers.length}</p>
          </div>
        </div>

        {/* Trip List */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl text-gray-900 dark:text-white">Danh sách chuyến đi</h2>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {trips.map((trip) => (
              <div key={trip.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="text-lg text-gray-900 dark:text-white">{trip.route}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{trip.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <span>Xe: {trip.vehicle}</span>
                      <span>•</span>
                      <span>Biển số: {trip.plate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {trip.driver ? (
                      <div className="flex items-center space-x-3 px-4 py-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                        <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{trip.driver.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">⭐ {trip.driver.rating}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-xl text-sm">
                        Chưa phân công
                      </span>
                    )}

                    <button
                      onClick={() => handleAssign(trip.id)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>{trip.driver ? 'Đổi tài xế' : 'Phân công'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl text-gray-900 dark:text-white">Chọn tài xế</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Chọn tài xế phù hợp cho chuyến đi
              </p>
            </div>

            <div className="p-6 overflow-y-auto max-h-96 space-y-3">
              {availableDrivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => handleConfirmAssign(driver.id)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white">
                        <span>{driver.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white">{driver.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {driver.trips} chuyến đã hoàn thành
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-lg text-gray-900 dark:text-white">{driver.rating}</span>
                      </div>
                      <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        Sẵn sàng
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAssignModal(false)}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

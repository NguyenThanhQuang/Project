import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Settings } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  seats: number;
  status: 'active' | 'maintenance' | 'inactive';
  manufacturer: string;
  year: number;
  lastMaintenance: string;
}

export function VehicleManagement() {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      plateNumber: '51B-12345',
      type: 'Giường nằm',
      seats: 40,
      status: 'active',
      manufacturer: 'Hyundai Universe',
      year: 2022,
      lastMaintenance: '15/12/2024'
    },
    {
      id: '2',
      plateNumber: '51B-67890',
      type: 'Giường nằm VIP',
      seats: 36,
      status: 'active',
      manufacturer: 'Mercedes-Benz',
      year: 2023,
      lastMaintenance: '20/12/2024'
    },
    {
      id: '3',
      plateNumber: '51B-11111',
      type: 'Ghế ngồi',
      seats: 45,
      status: 'maintenance',
      manufacturer: 'Thaco',
      year: 2021,
      lastMaintenance: '10/12/2024'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const statusConfig = {
    active: { label: t('active'), color: 'bg-green-500' },
    maintenance: { label: t('maintenance'), color: 'bg-yellow-500' },
    inactive: { label: t('inactive'), color: 'bg-red-500' }
  };

  const filteredVehicles = vehicles.filter(v =>
    v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm(t('deleteVehicleConfirm'))) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">{t('vehicleManagementTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('vehicleManagementDesc')}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addNewVehicle')}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">{vehicles.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalVehiclesCount')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-green-600 mb-1">{vehicles.filter(v => v.status === 'active').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('activeVehicles')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-yellow-600 mb-1">{vehicles.filter(v => v.status === 'maintenance').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('maintenanceVehicles')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">{vehicles.reduce((sum, v) => sum + v.seats, 0)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalSeats')}</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchVehicle')}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Vehicle List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('licensePlate')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('vehicleTypeLabel')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('seatNumber')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('manufacturerBrand')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('yearOfManufacture')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('lastMaintenance')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('status')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredVehicles.map((vehicle) => {
                const statusInfo = statusConfig[vehicle.status];
                return (
                  <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{vehicle.plateNumber}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{vehicle.type}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{vehicle.seats}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{vehicle.manufacturer}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{vehicle.year}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{vehicle.lastMaintenance}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 ${statusInfo.color} rounded-full`}></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{statusInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingVehicle(vehicle)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
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

      {/* Add/Edit Modal */}
      {(showAddModal || editingVehicle) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 dark:text-white">
                {editingVehicle ? t('editVehicle') : t('addNewVehicle')}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingVehicle(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('licensePlate')}</label>
                  <input
                    type="text"
                    placeholder="51B-12345"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('vehicleTypeLabel')}</label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                    <option>{t('sleeperBusOption')}</option>
                    <option>{t('vipSleeperBus')}</option>
                    <option>{t('seatBusOption')}</option>
                    <option>{t('limousineOption')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('seatNumber')}</label>
                  <input
                    type="number"
                    placeholder="40"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('yearOfManufacture')}</label>
                  <input
                    type="number"
                    placeholder="2023"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('manufacturerBrand')}</label>
                <input
                  type="text"
                  placeholder="Hyundai Universe"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('status')}</label>
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                  <option value="active">{t('active')}</option>
                  <option value="maintenance">{t('maintenance')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVehicle(null);
                  }}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                >
                  {editingVehicle ? t('update') : t('add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
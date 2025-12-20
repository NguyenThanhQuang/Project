import { useState } from 'react';
import { Bus, Route, Users, DollarSign, TrendingUp, Calendar, Download, FileText } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function CompanyDashboard() {
  const [showReportModal, setShowReportModal] = useState(false);
  const { t } = useLanguage();

  const stats = [
    { label: t('totalVehicles'), value: '24', icon: Bus, color: 'from-blue-500 to-blue-600', change: '+2' },
    { label: t('todayTrips'), value: '36', icon: Route, color: 'from-green-500 to-green-600', change: '+5' },
    { label: t('totalPassengers'), value: '1,248', icon: Users, color: 'from-purple-500 to-purple-600', change: '+12%' },
    { label: t('monthlyRevenue'), value: '285M', icon: DollarSign, color: 'from-orange-500 to-orange-600', change: '+8%' }
  ];

  const recentTrips = [
    { id: '1', route: 'TP.HCM → Đà Lạt', time: '05:00', date: '28/12/2024', vehicle: '51B-12345', booked: 35, total: 40, status: t('running') },
    { id: '2', route: 'TP.HCM → Nha Trang', time: '14:30', date: '28/12/2024', vehicle: '51B-67890', booked: 38, total: 40, status: t('aboutToDepart') },
    { id: '3', route: 'Đà Lạt → TP.HCM', time: '08:00', date: '28/12/2024', vehicle: '51B-12345', booked: 40, total: 40, status: t('completed') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 dark:text-white mb-1">{t('companyDashboard')}</h1>
              <p className="text-gray-600 dark:text-gray-400">Phương Trang Express</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowReportModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>{t('report')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-600 dark:text-green-400 text-sm">{stat.change}</span>
                </div>
                <div className="text-3xl text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 dark:text-white">{t('revenue7Days')}</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm">{t('days7')}</button>
              <button className="px-3 py-1 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">{t('days30')}</button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/10 dark:to-teal-900/10 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-white">{t('recentTrips')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">Tuyến đường</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">Thời gian</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">Xe</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">Đã đặt</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{trip.route}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{trip.time} - {trip.date}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{trip.vehicle}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="text-gray-900 dark:text-white">{trip.booked}/{trip.total}</div>
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-teal-500"
                            style={{ width: `${(trip.booked / trip.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        trip.status === '��ang chạy' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' :
                        trip.status === 'Sắp khởi hành' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' :
                        'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setShowReportModal(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
              <h3 className="text-xl text-gray-900 dark:text-white mb-4">Xuất Báo Cáo</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group">
                  <span className="text-gray-900 dark:text-white">Báo cáo doanh thu</span>
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group">
                  <span className="text-gray-900 dark:text-white">Báo cáo chuyến đi</span>
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group">
                  <span className="text-gray-900 dark:text-white">Báo cáo hành khách</span>
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group">
                  <span className="text-gray-900 dark:text-white">Báo cáo phương tiện</span>
                  <Download className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-full mt-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
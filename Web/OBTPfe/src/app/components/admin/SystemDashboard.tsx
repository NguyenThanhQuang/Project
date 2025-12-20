import { useState } from 'react';
import { Building2, Users, Bus, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, FileText, Plus } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function SystemDashboard() {
  const { t } = useLanguage();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);

  const stats = [
    { label: t('totalCompaniesStats'), value: '156', icon: Building2, color: 'from-blue-500 to-blue-600', change: '+12' },
    { label: t('usersStats'), value: '48,523', icon: Users, color: 'from-green-500 to-green-600', change: '+1,234' },
    { label: t('totalVehiclesStats'), value: '3,847', icon: Bus, color: 'from-purple-500 to-purple-600', change: '+89' },
    { label: t('monthlyRevenueStats'), value: '12.5B', icon: DollarSign, color: 'from-orange-500 to-orange-600', change: '+15%' }
  ];

  const companies = [
    { id: '1', name: 'Phương Trang', vehicles: 145, trips: 523, revenue: '2.1B', status: 'active', rating: 4.8 },
    { id: '2', name: 'Thành Bưởi', vehicles: 98, trips: 412, revenue: '1.8B', status: 'active', rating: 4.6 },
    { id: '3', name: 'Hoa Mai', vehicles: 76, trips: 358, revenue: '1.5B', status: 'active', rating: 4.9 },
    { id: '4', name: 'Mai Linh', vehicles: 112, trips: 489, revenue: '2.0B', status: 'pending', rating: 4.7 },
    { id: '5', name: 'Kumho Samco', vehicles: 134, trips: 501, revenue: '2.2B', status: 'suspended', rating: 4.5 }
  ];

  const statusConfig = {
    active: { label: t('activeLabel'), color: 'bg-green-500', icon: CheckCircle },
    pending: { label: t('pendingLabel'), color: 'bg-yellow-500', icon: AlertCircle },
    suspended: { label: t('suspendedLabel'), color: 'bg-red-500', icon: XCircle }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 dark:text-white mb-1">{t('systemDashboardTitleAlt')}</h1>
              <p className="text-gray-600 dark:text-gray-400">{t('systemAdminLabel')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowReportModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>{t('exportReport')}</span>
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

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 dark:text-white">{t('revenueOverview')}</h3>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm">{t('thisMonth')}</button>
              <button className="px-3 py-1 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">{t('thisQuarter')}</button>
              <button className="px-3 py-1 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700">{t('thisYear')}</button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-16 h-16 text-gray-400" />
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white">{t('topCompanies')}</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={t('search')}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
              <button 
                onClick={() => setShowAddCompanyModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t('addCompany')}</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('companyColumn')}</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('vehiclesColumn')}</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('tripsColumn')}</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('revenueColumn')}</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('ratingColumn')}</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('statusColumn')}</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('actionsColumn')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {companies.map((company) => {
                  const statusInfo = statusConfig[company.status as keyof typeof statusConfig];
                  return (
                    <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white">
                            {company.name.charAt(0)}
                          </div>
                          <div className="text-gray-900 dark:text-white">{company.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{company.vehicles}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{company.trips}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{company.revenue}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-900 dark:text-white">{company.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 ${statusInfo.color} rounded-full`}></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{statusInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                          {t('viewDetails')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

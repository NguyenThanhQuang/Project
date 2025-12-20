import { useState } from 'react';
import { Plus, Search, Edit2, Ban, CheckCircle, Eye, X } from 'lucide-react';
import { Clock } from "lucide-react";
import { useLanguage } from '../LanguageContext';


interface Company {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicles: number;
  trips: number;
  rating: number;
  revenue: number;
  status: 'active' | 'pending' | 'suspended';
  joinDate: string;
}

export function CompanyManagement() {
  const { t } = useLanguage();
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: '1',
      name: 'Phương Trang',
      email: 'contact@phuongtrang.vn',
      phone: '1900545845',
      address: '272 Đường 3/2, Q.10, TP.HCM',
      vehicles: 145,
      trips: 523,
      rating: 4.8,
      revenue: 2100000000,
      status: 'active',
      joinDate: '15/01/2023'
    },
    {
      id: '2',
      name: 'Thành Bưởi',
      email: 'info@thanhbuoi.com',
      phone: '0282222333',
      address: '395 Điện Biên Phủ, Q.3, TP.HCM',
      vehicles: 98,
      trips: 412,
      rating: 4.6,
      revenue: 1800000000,
      status: 'active',
      joinDate: '20/03/2023'
    },
    {
      id: '3',
      name: 'Mai Linh Express',
      email: 'express@mailinh.vn',
      phone: '1900545888',
      address: '123 Nguyễn Thái Bình, Q.1, TP.HCM',
      vehicles: 112,
      trips: 489,
      rating: 4.7,
      revenue: 2000000000,
      status: 'pending',
      joinDate: '10/12/2024'
    }
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const statusConfig = {
    active: { label: t('activeLabel'), color: 'bg-green-500', icon: CheckCircle },
    pending: { label: t('pendingLabel'), color: 'bg-yellow-500', icon: Clock },
    suspended: { label: t('suspendedLabel'), color: 'bg-red-500', icon: Ban }
  };

  const filteredCompanies = companies.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return (price / 1000000000).toFixed(1) + 'B';
  };

  const handleStatusChange = (companyId: string, newStatus: 'active' | 'suspended') => {
    setCompanies(companies.map(c =>
      c.id === companyId ? { ...c, status: newStatus } : c
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">{t('companyManagementTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t('companyManagementDesc')}</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          <span>{t('addCompany')}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">{companies.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalCompaniesAll')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-green-600 mb-1">{companies.filter(c => c.status === 'active').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('activeStatus')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-yellow-600 mb-1">{companies.filter(c => c.status === 'pending').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('pendingLabel')}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">
            {companies.reduce((sum, c) => sum + c.vehicles, 0)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t('totalVehiclesAll')}</div>
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
              placeholder={t('searchByNameEmail')}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">{t('allStatus')}</option>
            <option value="active">{t('activeLabel')}</option>
            <option value="pending">{t('pendingLabel')}</option>
            <option value="suspended">{t('suspendedLabel')}</option>
          </select>
        </div>
      </div>

      {/* Company List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('companyColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('contactColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('vehiclesColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('tripsColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('revenueColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('ratingColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('statusColumn')}</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">{t('actionsColumn')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredCompanies.map((company) => {
                const statusInfo = statusConfig[company.status];
                return (
                  <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center text-white">
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white">{company.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{t('joinedLabel')} {company.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white text-sm">{company.email}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{company.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{company.vehicles}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{company.trips}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">{formatPrice(company.revenue)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-900 dark:text-white">{company.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
                        <span className="text-gray-900 dark:text-white text-sm">{statusInfo.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowDetailModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
                          title={t('viewDetails')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
                          title={t('editAction')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {company.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(company.id, 'suspended')}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                            title={t('suspendAction')}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : company.status === 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(company.id, 'active')}
                            className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400 transition-colors"
                            title={t('activateAction')}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-900 dark:text-white">{selectedCompany.name}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('contactColumn')}</div>
                <div className="text-gray-900 dark:text-white">{selectedCompany.email}</div>
                <div className="text-gray-900 dark:text-white">{selectedCompany.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('address')}</div>
                <div className="text-gray-900 dark:text-white">{selectedCompany.address}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('vehiclesColumn')}</div>
                  <div className="text-2xl text-gray-900 dark:text-white">{selectedCompany.vehicles}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('tripsColumn')}</div>
                  <div className="text-2xl text-gray-900 dark:text-white">{selectedCompany.trips}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

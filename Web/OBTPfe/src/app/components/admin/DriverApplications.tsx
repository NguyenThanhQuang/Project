import { useState } from 'react';
import { User, Phone, Mail, MapPin, FileText, CheckCircle, XCircle, Clock, Eye, Search, Download, Filter, MessageSquare } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface DriverApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  licenseNumber: string;
  experience: string;
  username: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  avatarUrl?: string;
  licenseImageUrl?: string;
  notes?: string;
}

export function DriverApplications() {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<DriverApplication[]>([
    {
      id: 'APP001',
      fullName: 'Nguyễn Văn Tài',
      phone: '0123456789',
      email: 'nvtai@gmail.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      licenseNumber: '123456789',
      experience: '5',
      username: 'driver001',
      status: 'pending',
      submittedAt: '2024-12-01 10:30',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      licenseImageUrl: 'https://images.unsplash.com/photo-1589395937772-110d6c7bf5e7?w=600&h=400&fit=crop'
    },
    {
      id: 'APP002',
      fullName: 'Trần Minh Hoàng',
      phone: '0987654321',
      email: 'tmhoang@gmail.com',
      address: '456 Đường XYZ, Quận 2, TP.HCM',
      licenseNumber: '987654321',
      experience: '3',
      username: 'driver002',
      status: 'pending',
      submittedAt: '2024-12-01 14:20',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      licenseImageUrl: 'https://images.unsplash.com/photo-1554224311-bfef2db8f4fb?w=600&h=400&fit=crop'
    },
    {
      id: 'APP003',
      fullName: 'Lê Văn Nam',
      phone: '0912345678',
      email: 'lvnam@gmail.com',
      address: '789 Đường DEF, Quận 3, TP.HCM',
      licenseNumber: '111222333',
      experience: '7',
      username: 'driver003',
      status: 'approved',
      submittedAt: '2024-11-30 09:15',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
      licenseImageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop',
      notes: 'Tài xế có kinh nghiệm, đã kiểm tra bằng lái hợp lệ.'
    },
    {
      id: 'APP004',
      fullName: 'Phạm Thị Mai',
      phone: '0976543210',
      email: 'ptmai@gmail.com',
      address: '321 Đường GHI, Quận 4, TP.HCM',
      licenseNumber: '444555666',
      experience: '2',
      username: 'driver004',
      status: 'rejected',
      submittedAt: '2024-11-29 16:45',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      licenseImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop',
      notes: 'Kinh nghiệm chưa đủ, yêu cầu tối thiểu 3 năm.'
    }
  ]);

  const [selectedApp, setSelectedApp] = useState<DriverApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showImageModal, setShowImageModal] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    const note = prompt(t('addNoteOptional'));
    setApplications(apps =>
      apps.map(app =>
        app.id === id ? { ...app, status: 'approved' as const, notes: note || app.notes } : app
      )
    );
    setSelectedApp(null);
    alert(t('approveSuccess'));
  };

  const handleReject = (id: string) => {
    const reason = prompt(t('enterRejectReason'));
    if (reason) {
      setApplications(apps =>
        apps.map(app =>
          app.id === id ? { ...app, status: 'rejected' as const, notes: reason } : app
        )
      );
      setSelectedApp(null);
      alert(t('rejectSuccess'));
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Mã đơn', 'Họ tên', 'SĐT', 'Email', 'Bằng lái', 'Kinh nghiệm', 'Trạng thái', 'Ngày nộp'].join(','),
      ...filteredApplications.map(app =>
        [app.id, app.fullName, app.phone, app.email, app.licenseNumber, app.experience + ' năm', app.status, app.submittedAt].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `driver-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredApplications = applications
    .filter(app => filterStatus === 'all' || app.status === filterStatus)
    .filter(app =>
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const statusConfig = {
    pending: { label: t('pendingApplications'), color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    approved: { label: t('approvedApplications'), color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
    rejected: { label: t('rejectedApplications'), color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 dark:text-white mb-2">
            {t('driverApplicationsTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('driverApplicationsSubtitle')}
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>{t('exportExcel')}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('totalApplications')}</p>
              <p className="text-3xl text-gray-900 dark:text-white">{applications.length}</p>
            </div>
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('pendingApplications')}</p>
              <p className="text-3xl text-yellow-600 dark:text-yellow-400">
                {applications.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('approvedApplications')}</p>
              <p className="text-3xl text-green-600 dark:text-green-400">
                {applications.filter(a => a.status === 'approved').length}
              </p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('rejectedApplications')}</p>
              <p className="text-3xl text-red-600 dark:text-red-400">
                {applications.filter(a => a.status === 'rejected').length}
              </p>
            </div>
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl">
              <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Status Filter */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('all')} ({applications.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('pendingApplications')} ({applications.filter(a => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filterStatus === 'approved'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('approvedApplications')} ({applications.filter(a => a.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilterStatus('rejected')}
              className={`px-4 py-2 rounded-xl transition-all ${
                filterStatus === 'rejected'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('rejectedApplications')} ({applications.filter(a => a.status === 'rejected').length})
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchApplications')}
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white w-full md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">{t('driverColumn')}</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">{t('contactColumn')}</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">{t('documentsColumn')}</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">{t('submitDateColumn')}</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">{t('statusColumn')}</th>
                <th className="px-6 py-4 text-left text-sm text-gray-600 dark:text-gray-400">{t('actionsColumn')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredApplications.map((app) => {
                const StatusIcon = statusConfig[app.status].icon;
                return (
                  <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={app.avatarUrl || `https://ui-avatars.com/api/?name=${app.fullName}&background=random`}
                          alt={app.fullName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600"
                        />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{app.fullName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{app.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{app.phone}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{app.licenseNumber}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{app.experience} {t('years')} {t('experience')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{app.submittedAt}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs ${statusConfig[app.status].color}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusConfig[app.status].label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                          title={t('viewDetails')}
                        >
                          <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                              title={t('approve')}
                            >
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
                              title={t('reject')}
                            >
                              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">{t('noApplicationsFound')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">{t('tryChangeFilter')}</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedApp(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedApp.avatarUrl || `https://ui-avatars.com/api/?name=${selectedApp.fullName}&background=random`}
                    alt={selectedApp.fullName}
                    className="w-16 h-16 rounded-2xl border-4 border-white/30 object-cover"
                  />
                  <div>
                    <h2 className="text-2xl mb-1">{selectedApp.fullName}</h2>
                    <p className="text-blue-100 text-sm">{t('applicationCode')}: {selectedApp.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{t('personalInfo')}</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('fullNameLabel')}</p>
                    <p className="text-gray-900 dark:text-white">{selectedApp.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('usernameLabel')}</p>
                    <p className="text-gray-900 dark:text-white">{selectedApp.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('phoneNumberLabel')}</p>
                    <p className="text-gray-900 dark:text-white">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('email')}</p>
                    <p className="text-gray-900 dark:text-white">{selectedApp.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('addressLabel')}</p>
                    <p className="text-gray-900 dark:text-white">{selectedApp.address}</p>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{t('professionalInfo')}</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('licenseNumber')}</p>
                    <p className="text-gray-900 dark:text-white">{selectedApp.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('experience')}</p>
                    <p className="text-gray-900 dark:text-white">{selectedApp.experience} {t('years')}</p>
                  </div>
                </div>
              </div>

              {/* License Image */}
              {selectedApp.licenseImageUrl && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg text-gray-900 dark:text-white mb-4">{t('licenseImageLabel')}</h3>
                  <div 
                    className="cursor-pointer group relative overflow-hidden rounded-xl"
                    onClick={() => setShowImageModal(selectedApp.licenseImageUrl!)}
                  >
                    <img
                      src={selectedApp.licenseImageUrl}
                      alt="License"
                      className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedApp.notes && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>{t('notesLabel')}</span>
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                    <p className="text-gray-900 dark:text-white">{selectedApp.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {selectedApp.status === 'pending' && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
                  <button
                    onClick={() => handleApprove(selectedApp.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>{t('approve')}</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedApp.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>{t('reject')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setShowImageModal(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute -top-12 right-0 p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all"
            >
              <XCircle className="w-6 h-6" />
            </button>
            <img
              src={showImageModal}
              alt="License Full"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
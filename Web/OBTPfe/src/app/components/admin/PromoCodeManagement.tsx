import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Plus, Search, Edit2, Trash2, Tag, Calendar, 
  Percent, Users, CheckCircle, XCircle, Copy, Eye, EyeOff 
} from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
  applicableRoutes?: string[];
  applicableCompanies?: string[];
  bannerImage?: string;
}

export function PromoCodeManagement() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [showCodeValue, setShowCodeValue] = useState<{ [key: string]: boolean }>({});

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      id: 'PROMO001',
      code: 'NEWYEAR2025',
      description: 'Giảm giá 20% cho năm mới',
      discountType: 'percentage',
      discountValue: 20,
      minPurchase: 100000,
      maxDiscount: 50000,
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      usageLimit: 1000,
      usedCount: 234,
      status: 'active',
      createdAt: '2024-12-15',
      applicableRoutes: ['Tất cả'],
      applicableCompanies: ['Tất cả'],
      bannerImage: 'https://images.unsplash.com/photo-1704399527621-82de0422490c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwY2VsZWJyYXRpb24lMjBmaXJld29ya3N8ZW58MXx8fHwxNzY3NTEyNDI4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'PROMO002',
      code: 'STUDENT50K',
      description: 'Giảm 50.000đ cho sinh viên',
      discountType: 'fixed',
      discountValue: 50000,
      minPurchase: 200000,
      startDate: '2024-09-01',
      endDate: '2025-06-30',
      usageLimit: 500,
      usedCount: 123,
      status: 'active',
      createdAt: '2024-08-20',
      applicableRoutes: ['TP.HCM - Đà Lạt', 'TP.HCM - Nha Trang'],
      bannerImage: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBoYXBweXxlbnwxfHx8fDE3Njc1NjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'PROMO003',
      code: 'FIRSTRIDE',
      description: 'Giảm 30% cho chuyến đi đầu tiên',
      discountType: 'percentage',
      discountValue: 30,
      minPurchase: 50000,
      maxDiscount: 100000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 10000,
      usedCount: 8945,
      status: 'expired',
      createdAt: '2023-12-01',
      bannerImage: 'https://images.unsplash.com/photo-1759882608768-168d4c3a91c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXMlMjB0cmF2ZWwlMjBqb3VybmV5fGVufDF8fHx8MTc2NzU4NjEyNnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'PROMO004',
      code: 'WEEKEND15',
      description: 'Giảm 15% cho chuyến cuối tuần',
      discountType: 'percentage',
      discountValue: 15,
      minPurchase: 150000,
      maxDiscount: 40000,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      usageLimit: 2000,
      usedCount: 0,
      status: 'inactive',
      createdAt: '2024-12-20',
      bannerImage: 'https://images.unsplash.com/photo-1748795514342-e1065f88e97d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWVrZW5kJTIwZ2V0YXdheSUyMHZhY2F0aW9ufGVufDF8fHx8MTc2NzU4NjEyNnww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ]);

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    status: 'active' as 'active' | 'inactive',
    bannerImage: ''
  });

  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || promo.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPromo = () => {
    if (!formData.code || !formData.description || !formData.discountValue) {
      alert(language === 'vi' ? 'Vui lòng nhập đầy đủ thông tin!' : 'Please fill all required fields!');
      return;
    }

    const newPromo: PromoCode = {
      id: `PROMO${String(promoCodes.length + 1).padStart(3, '0')}`,
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minPurchase: Number(formData.minPurchase) || 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      usageLimit: Number(formData.usageLimit) || 999999,
      usedCount: 0,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0],
      bannerImage: formData.bannerImage
    };

    setPromoCodes([newPromo, ...promoCodes]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditPromo = () => {
    if (!editingPromo) return;

    setPromoCodes(promoCodes.map(promo =>
      promo.id === editingPromo.id
        ? {
            ...promo,
            code: formData.code.toUpperCase(),
            description: formData.description,
            discountType: formData.discountType,
            discountValue: Number(formData.discountValue),
            minPurchase: Number(formData.minPurchase),
            maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
            startDate: formData.startDate,
            endDate: formData.endDate,
            usageLimit: Number(formData.usageLimit),
            status: formData.status,
            bannerImage: formData.bannerImage
          }
        : promo
    ));

    setEditingPromo(null);
    resetForm();
  };

  const handleDeletePromo = (id: string) => {
    if (confirm(language === 'vi' ? 'Bạn có chắc muốn xóa mã này?' : 'Are you sure you want to delete this promo code?')) {
      setPromoCodes(promoCodes.filter(promo => promo.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minPurchase: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      status: 'active',
      bannerImage: ''
    });
  };

  const openEditModal = (promo: PromoCode) => {
    setEditingPromo(promo);
    setFormData({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: String(promo.discountValue),
      minPurchase: String(promo.minPurchase),
      maxDiscount: promo.maxDiscount ? String(promo.maxDiscount) : '',
      startDate: promo.startDate,
      endDate: promo.endDate,
      usageLimit: String(promo.usageLimit),
      status: promo.status as 'active' | 'inactive',
      bannerImage: promo.bannerImage || ''
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(language === 'vi' ? 'Đã sao chép mã!' : 'Code copied!');
  };

  const toggleShowCode = (id: string) => {
    setShowCodeValue(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      expired: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: language === 'vi' ? 'Đang hoạt động' : 'Active',
      inactive: language === 'vi' ? 'Tạm ngưng' : 'Inactive',
      expired: language === 'vi' ? 'Hết hạn' : 'Expired'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'vi' ? '🏷️ Quản Lý Mã Khuyến Mãi' : '🏷️ Promo Code Management'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'vi' 
              ? 'Tạo và quản lý các mã giảm giá cho khách hàng' 
              : 'Create and manage discount codes for customers'}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>{language === 'vi' ? 'Tạo Mã Mới' : 'Create New Code'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'vi' ? 'Tổng mã' : 'Total Codes'}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{promoCodes.length}</p>
            </div>
            <Tag className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'vi' ? 'Đang hoạt động' : 'Active'}
              </p>
              <p className="text-3xl font-bold text-green-600">
                {promoCodes.filter(p => p.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'vi' ? 'Đã sử dụng' : 'Total Used'}
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {promoCodes.reduce((sum, p) => sum + p.usedCount, 0)}
              </p>
            </div>
            <Users className="w-12 h-12 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'vi' ? 'Hết hạn' : 'Expired'}
              </p>
              <p className="text-3xl font-bold text-red-600">
                {promoCodes.filter(p => p.status === 'expired').length}
              </p>
            </div>
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'vi' ? 'Tìm kiếm mã...' : 'Search codes...'}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{language === 'vi' ? 'Tất cả trạng thái' : 'All Status'}</option>
            <option value="active">{language === 'vi' ? 'Đang hoạt động' : 'Active'}</option>
            <option value="inactive">{language === 'vi' ? 'Tạm ngưng' : 'Inactive'}</option>
            <option value="expired">{language === 'vi' ? 'Hết hạn' : 'Expired'}</option>
          </select>
        </div>
      </div>

      {/* Promo Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromoCodes.map((promo) => (
          <div key={promo.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
            {/* Banner Image */}
            {promo.bannerImage && (
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={promo.bannerImage} 
                  alt={promo.code}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xl ${getStatusBadge(promo.status)}`}>
                    {getStatusText(promo.status)}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono font-bold text-2xl text-blue-600 dark:text-blue-400">
                    {showCodeValue[promo.id] ? promo.code : '••••••••'}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleShowCode(promo.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {showCodeValue[promo.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(promo.code)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title={language === 'vi' ? 'Sao chép' : 'Copy'}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{promo.description}</p>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Percent className="w-5 h-5 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{language === 'vi' ? 'Giảm giá' : 'Discount'}</span>
                </div>
                <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {promo.discountType === 'percentage'
                    ? `${promo.discountValue}%`
                    : `${promo.discountValue.toLocaleString('vi-VN')}đ`}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {promo.minPurchase > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'vi' ? 'Tối thiểu' : 'Min Purchase'}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{promo.minPurchase.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                {promo.maxDiscount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{language === 'vi' ? 'Giảm tối đa' : 'Max Discount'}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{promo.maxDiscount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{language === 'vi' ? 'Sử dụng' : 'Used'}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{promo.usedCount} / {promo.usageLimit}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((promo.usedCount / promo.usageLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{promo.startDate} - {promo.endDate}</span>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => openEditModal(promo)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>{language === 'vi' ? 'Sửa' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => handleDeletePromo(promo.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{language === 'vi' ? 'Xóa' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPromoCodes.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'vi' ? 'Không tìm thấy mã khuyến mãi' : 'No promo codes found'}
            </p>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingPromo) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingPromo
                ? (language === 'vi' ? 'Chỉnh Sửa Mã' : 'Edit Promo Code')
                : (language === 'vi' ? 'Tạo Mã Mới' : 'Create New Promo Code')}
            </h3>

            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'vi' ? 'Mã khuyến mãi' : 'Promo Code'} *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="NEWYEAR2025"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'vi' ? 'Mô tả' : 'Description'} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === 'vi' ? 'Giảm giá 20% cho năm mới...' : 'Get 20% off for new year...'}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              {/* Discount Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Loại giảm giá' : 'Discount Type'}
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  >
                    <option value="percentage">{language === 'vi' ? 'Phần trăm (%)' : 'Percentage (%)'}</option>
                    <option value="fixed">{language === 'vi' ? 'Số tiền cố định (đ)' : 'Fixed Amount (đ)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Giá trị' : 'Value'} *
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? '20' : '50000'}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Min Purchase & Max Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Giá trị tối thiểu' : 'Min Purchase'}
                  </label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                    placeholder="100000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Giảm tối đa' : 'Max Discount'}
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="50000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Ngày bắt đầu' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Ngày kết thúc' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Usage Limit & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Giới hạn sử dụng' : 'Usage Limit'}
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="1000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Trạng thái' : 'Status'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  >
                    <option value="active">{language === 'vi' ? 'Đang hoạt động' : 'Active'}</option>
                    <option value="inactive">{language === 'vi' ? 'Tạm ngưng' : 'Inactive'}</option>
                  </select>
                </div>
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'vi' ? 'Ảnh Banner (URL)' : 'Banner Image (URL)'}
                </label>
                <input
                  type="text"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-...."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === 'vi' 
                    ? '💡 Gợi ý: Sử dụng Unsplash.com để tìm ảnh chất lượng cao miễn phí'
                    : '💡 Tip: Use Unsplash.com to find high-quality free images'}
                </p>
                
                {/* Image Preview */}
                {formData.bannerImage && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'vi' ? 'Xem trước:' : 'Preview:'}
                    </p>
                    <div className="relative h-40 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                      <img 
                        src={formData.bannerImage} 
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="160"%3E%3Crect fill="%23ddd" width="400" height="160"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-xs text-white/80 mb-1">MÃ KHUYẾN MÃI</div>
                        <div className="text-xl font-bold text-white font-mono">{formData.code || 'YOUR CODE'}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPromo(null);
                  resetForm();
                }}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                onClick={editingPromo ? handleEditPromo : handleAddPromo}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {editingPromo
                  ? (language === 'vi' ? 'Cập nhật' : 'Update')
                  : (language === 'vi' ? 'Tạo mã' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
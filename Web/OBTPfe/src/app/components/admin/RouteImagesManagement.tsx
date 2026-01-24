import { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  Upload, Search, Edit2, Trash2, Image as ImageIcon, 
  MapPin, Plus, X, Check, AlertCircle, ExternalLink
} from 'lucide-react';

interface RouteImage {
  id: string;
  routeName: string;
  from: string;
  to: string;
  imageUrl: string;
  thumbnailUrl?: string;
  description: string;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  dimensions: string;
  status: 'active' | 'inactive';
}

export function RouteImagesManagement() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingImage, setEditingImage] = useState<RouteImage | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [routeImages, setRouteImages] = useState<RouteImage[]>([
    {
      id: 'IMG001',
      routeName: 'TP.HCM - Đà Lạt',
      from: 'TP. Hồ Chí Minh',
      to: 'Đà Lạt',
      imageUrl: 'https://images.unsplash.com/photo-1688952397241-1857af9c5da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      description: 'Phong cảnh núi non Đà Lạt',
      uploadedAt: '2024-12-15',
      uploadedBy: 'Admin',
      fileSize: '2.3 MB',
      dimensions: '1080x720',
      status: 'active'
    },
    {
      id: 'IMG002',
      routeName: 'TP.HCM - Nha Trang',
      from: 'TP. Hồ Chí Minh',
      to: 'Nha Trang',
      imageUrl: 'https://images.unsplash.com/photo-1692449353169-20f861617766?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      description: 'Bãi biển Nha Trang tuyệt đẹp',
      uploadedAt: '2024-12-14',
      uploadedBy: 'Admin',
      fileSize: '1.8 MB',
      dimensions: '1080x720',
      status: 'active'
    },
    {
      id: 'IMG003',
      routeName: 'TP.HCM - Vũng Tàu',
      from: 'TP. Hồ Chí Minh',
      to: 'Vũng Tàu',
      imageUrl: 'https://images.unsplash.com/photo-1616510670481-c290222959f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      description: 'Hoàng hôn Vũng Tàu',
      uploadedAt: '2024-12-13',
      uploadedBy: 'Admin',
      fileSize: '2.1 MB',
      dimensions: '1080x720',
      status: 'active'
    },
    {
      id: 'IMG004',
      routeName: 'TP.HCM - Đà Nẵng',
      from: 'TP. Hồ Chí Minh',
      to: 'Đà Nẵng',
      imageUrl: 'https://images.unsplash.com/photo-1696215103476-985902d02b1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      description: 'Cầu Rồng Đà Nẵng',
      uploadedAt: '2024-12-12',
      uploadedBy: 'Admin',
      fileSize: '2.5 MB',
      dimensions: '1080x720',
      status: 'active'
    },
    {
      id: 'IMG005',
      routeName: 'TP.HCM - Phan Thiết',
      from: 'TP. Hồ Chí Minh',
      to: 'Phan Thiết',
      imageUrl: 'https://images.unsplash.com/photo-1735786302684-88f447dce57c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      description: 'Đồi cát Phan Thiết',
      uploadedAt: '2024-12-11',
      uploadedBy: 'Admin',
      fileSize: '1.9 MB',
      dimensions: '1080x720',
      status: 'active'
    },
    {
      id: 'IMG006',
      routeName: 'TP.HCM - Cần Thơ',
      from: 'TP. Hồ Chí Minh',
      to: 'Cần Thơ',
      imageUrl: 'https://images.unsplash.com/photo-1673675865894-00df0e4fe6cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
      description: 'Sông nước miền Tây',
      uploadedAt: '2024-12-10',
      uploadedBy: 'Admin',
      fileSize: '2.0 MB',
      dimensions: '1080x720',
      status: 'active'
    }
  ]);

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    imageUrl: '',
    description: '',
    status: 'active' as 'active' | 'inactive'
  });

  const filteredImages = routeImages.filter(img =>
    img.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddImage = () => {
    if (!formData.from || !formData.to || !formData.imageUrl) {
      alert(language === 'vi' ? 'Vui lòng nhập đầy đủ thông tin!' : 'Please fill all required fields!');
      return;
    }

    const newImage: RouteImage = {
      id: `IMG${String(routeImages.length + 1).padStart(3, '0')}`,
      routeName: `${formData.from} - ${formData.to}`,
      from: formData.from,
      to: formData.to,
      imageUrl: formData.imageUrl,
      description: formData.description,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'Admin',
      fileSize: '2.0 MB',
      dimensions: '1080x720',
      status: formData.status
    };

    setRouteImages([newImage, ...routeImages]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditImage = () => {
    if (!editingImage) return;

    setRouteImages(routeImages.map(img =>
      img.id === editingImage.id
        ? {
            ...img,
            from: formData.from,
            to: formData.to,
            routeName: `${formData.from} - ${formData.to}`,
            imageUrl: formData.imageUrl,
            description: formData.description,
            status: formData.status
          }
        : img
    ));

    setEditingImage(null);
    resetForm();
  };

  const handleDeleteImage = (id: string) => {
    if (confirm(language === 'vi' ? 'Bạn có chắc muốn xóa ảnh này?' : 'Are you sure you want to delete this image?')) {
      setRouteImages(routeImages.filter(img => img.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      from: '',
      to: '',
      imageUrl: '',
      description: '',
      status: 'active'
    });
  };

  const openEditModal = (image: RouteImage) => {
    setEditingImage(image);
    setFormData({
      from: image.from,
      to: image.to,
      imageUrl: image.imageUrl,
      description: image.description,
      status: image.status
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'vi' ? '🖼️ Quản Lý Ảnh Tuyến Đường' : '🖼️ Route Images Management'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'vi' 
              ? 'Quản lý hình ảnh hiển thị cho các tuyến đường' 
              : 'Manage images displayed for routes'}
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
          <span>{language === 'vi' ? 'Thêm Ảnh Mới' : 'Add New Image'}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'vi' ? 'Tổng ảnh' : 'Total Images'}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{routeImages.length}</p>
            </div>
            <ImageIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'vi' ? 'Đang hiển thị' : 'Active'}
              </p>
              <p className="text-3xl font-bold text-green-600">
                {routeImages.filter(img => img.status === 'active').length}
              </p>
            </div>
            <Check className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {language === 'vi' ? 'Tổng dung lượng' : 'Total Size'}
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {(routeImages.length * 2).toFixed(1)} MB
              </p>
            </div>
            <Upload className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm kiếm theo tuyến đường...' : 'Search by route...'}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group"
          >
            {/* Image Preview */}
            <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
              <ImageWithFallback
                src={image.imageUrl}
                alt={image.routeName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button
                  onClick={() => setPreviewImage(image.imageUrl)}
                  className="opacity-0 group-hover:opacity-100 p-3 bg-white dark:bg-gray-800 rounded-full text-gray-900 dark:text-white shadow-lg hover:scale-110 transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  image.status === 'active'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {image.status === 'active' 
                    ? (language === 'vi' ? 'Hiển thị' : 'Active')
                    : (language === 'vi' ? 'Ẩn' : 'Inactive')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Route Name */}
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {image.routeName}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {image.description}
              </p>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  <span className="font-semibold">{language === 'vi' ? 'Kích thước:' : 'Size:'}</span> {image.fileSize}
                </div>
                <div>
                  <span className="font-semibold">{language === 'vi' ? 'Độ phân giải:' : 'Resolution:'}</span> {image.dimensions}
                </div>
                <div className="col-span-2">
                  <span className="font-semibold">{language === 'vi' ? 'Tải lên:' : 'Uploaded:'}</span> {image.uploadedAt}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(image)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">{language === 'vi' ? 'Sửa' : 'Edit'}</span>
                </button>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'vi' ? 'Không tìm thấy ảnh nào' : 'No images found'}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingImage) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingImage
                ? (language === 'vi' ? 'Chỉnh Sửa Ảnh' : 'Edit Image')
                : (language === 'vi' ? 'Thêm Ảnh Mới' : 'Add New Image')}
            </h3>

            <div className="space-y-4">
              {/* Route Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Điểm đi' : 'From'} *
                  </label>
                  <input
                    type="text"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="TP. Hồ Chí Minh"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Điểm đến' : 'To'} *
                  </label>
                  <input
                    type="text"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="Đà Lạt"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'vi' ? 'URL Ảnh' : 'Image URL'} *
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://cdn.vexere.com/dalat.jpg"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
                <div className="mt-2 flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    {language === 'vi' 
                      ? 'Khuyến nghị: Kích thước 1080x720px, định dạng JPG/WebP, dung lượng < 3MB' 
                      : 'Recommended: Size 1080x720px, JPG/WebP format, < 3MB'}
                  </p>
                </div>
              </div>

              {/* Preview */}
              {formData.imageUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'vi' ? 'Xem trước' : 'Preview'}
                  </label>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <ImageWithFallback
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'vi' ? 'Mô tả' : 'Description'}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={language === 'vi' ? 'Phong cảnh núi non Đà Lạt...' : 'Beautiful Dalat mountains...'}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {language === 'vi' ? 'Trạng thái' : 'Status'}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                >
                  <option value="active">{language === 'vi' ? 'Hiển thị' : 'Active'}</option>
                  <option value="inactive">{language === 'vi' ? 'Ẩn' : 'Inactive'}</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingImage(null);
                  resetForm();
                }}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                onClick={editingImage ? handleEditImage : handleAddImage}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {editingImage
                  ? (language === 'vi' ? 'Cập nhật' : 'Update')
                  : (language === 'vi' ? 'Thêm ảnh' : 'Add Image')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </div>
  );
}

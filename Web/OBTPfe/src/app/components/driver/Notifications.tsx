import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, TrendingUp, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface NotificationsProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'achievement';
  title: string;
  message: string;
  time: string;
  read: boolean;
  details?: string;
}

export function Notifications({ onBack }: NotificationsProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [notificationsList, setNotificationsList] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Hoàn thành chuyến đi',
      message: 'Bạn đã hoàn thành chuyến TP.HCM → Đà Lạt lúc 14:30. Đánh giá: 5.0⭐',
      time: '5 phút trước',
      read: false,
      details: 'Chuyến đi TP.HCM → Đà Lạt đã hoàn thành xuất sắc. Thời gian: 6 giờ 30 phút. Khoảng cách: 308km. Số hành khách: 38/40. Doanh thu: 11,000,000đ. Khách hàng đã đánh giá 5 sao và để lại nhận xét tích cực về thái độ phục vụ chuyên nghiệp của bạn.'
    },
    {
      id: '2',
      type: 'info',
      title: 'Chuyến đi mới được phân công',
      message: 'Bạn đã được phân công chuyến Đà Lạt → TP.HCM vào 16:00 ngày mai',
      time: '1 giờ trước',
      read: false,
      details: 'Chuyến đi mới:\n- Tuyến: Đà Lạt → TP. Hồ Chí Minh\n- Thời gian khởi hành: 16:00 - 09/12/2024\n- Xe: 51B-12345 (Giường nằm 40 chỗ)\n- Số hành khách đã đặt: 28/40\n- Điểm đón: Bến xe Đà Lạt\n- Điểm trả: Bến xe Miền Đông\n\nVui lòng kiểm tra xe và chuẩn bị trước 30 phút.'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Nhắc nhở bảo dưỡng xe',
      message: 'Xe 51B-12345 cần bảo dưỡng định kỳ trong vòng 7 ngày tới',
      time: '2 giờ trước',
      read: false,
      details: 'Thông tin bảo dưỡng:\n- Xe: 51B-12345\n- Số km đã chạy: 98,500 km\n- Lần bảo dưỡng cuối: 05/10/2024\n- Hạng mục cần bảo dưỡng:\n  + Thay dầu động cơ\n  + Kiểm tra phanh\n  + Kiểm tra hệ thống treo\n  + Thay lọc gió\n\nVui lòng liên hệ bộ phận kỹ thuật để đặt lịch bảo dưỡng.'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Thành tích mới! 🎉',
      message: 'Chúc mừng! Bạn đã đạt 50 chuyến đi trong tháng này. Nhận thưởng 2,000,000đ',
      time: '1 ngày trước',
      read: true,
      details: 'Chúc mừng bạn đã đạt thành tích:\n\n🏆 50 CHUYẾN ĐI TRONG THÁNG 12\n\nThống kê tháng này:\n- Tổng chuyến: 50\n- Đánh giá trung bình: 4.9⭐\n- Tỷ lệ hoàn thành đúng giờ: 98%\n- Tổng doanh thu: 125,000,000đ\n\nPhần thưởng:\n- Tiền thưởng: 2,000,000đ\n- Huy hiệu: Tài xế xuất sắc tháng 12\n\nTiền thưởng sẽ được chuyển vào lương tháng này.'
    },
    {
      id: '5',
      type: 'info',
      title: 'Cập nhật giá cước',
      message: 'Giá cước tuyến TP.HCM → Đà Lạt đã được cập nhật từ ngày 01/12',
      time: '2 ngày trước',
      read: true,
      details: 'Bảng giá mới tuyến TP.HCM → Đà Lạt:\n\n- Ghế ngồi: 280,000đ → 300,000đ (+7%)\n- Giường nằm: 350,000đ → 380,000đ (+8.5%)\n- VIP: 450,000đ → 480,000đ (+6.7%)\n\nLý do điều chỉnh: Chi phí nhiên liệu tăng, phí đường bộ tăng.\n\nÁp dụng từ: 01/12/2024\n\nVui lòng thông báo cho hành khách khi đặt vé.'
    },
    {
      id: '6',
      type: 'success',
      title: 'Thanh toán lương tháng 11',
      message: 'Lương tháng 11 đã được chuyển vào tài khoản: 75,000,000đ',
      time: '3 ngày trước',
      read: true,
      details: 'Chi tiết lương tháng 11/2024:\n\nLương cơ bản: 15,000,000đ\nPhụ cấp xăng xe: 8,000,000đ\nThưởng chuyến đi: 25,000,000đ\nThưởng đánh giá cao: 5,000,000đ\nPhụ cấp đêm: 12,000,000đ\nThưởng KPI: 10,000,000đ\n----------------------------\nTổng cộng: 75,000,000đ\n\nKhấu trừ:\n- Bảo hiểm: -2,000,000đ\n- Thuế TNCN: -3,500,000đ\n\nThực nhận: 69,500,000đ\n\nĐã chuyển vào TK: 0123456789 (VCB)'
    },
    {
      id: '7',
      type: 'warning',
      title: 'Bằng lái sắp hết hạn',
      message: 'Bằng lái xe của bạn sẽ hết hạn vào 15/08/2025. Vui lòng gia hạn sớm.',
      time: '1 tuần trước',
      read: true,
      details: 'Thông tin bằng lái:\n\nSố bằng lái: 012345678\nHạng: E (Xe khách)\nNgày cấp: 15/08/2015\nNơi cấp: Cục CSGT - Bộ CA\nNgày hết hạn: 15/08/2025\n\nCòn: 8 tháng\n\nHướng dẫn gia hạn:\n1. Chuẩn bị hồ sơ: CMND, bằng lái cũ, giấy khám sức khỏe\n2. Nộp hồ sơ tại Sở GTVT hoặc online\n3. Thời gian xử lý: 5-7 ngày làm việc\n\nLiên hệ bộ phận hành chính để được hỗ trợ.'
    }
  ]);

  const filteredNotifications = notificationsList.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'warning': return <AlertCircle className="w-6 h-6 text-orange-500" />;
      case 'achievement': return <TrendingUp className="w-6 h-6 text-purple-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20';
      case 'achievement': return 'bg-purple-50 dark:bg-purple-900/20';
      default: return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    // Mark as read
    if (!notification.read) {
      setNotificationsList(prev =>
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
  };

  const handleMarkAllAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotificationsList(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Notification Detail Modal */}
      {selectedNotification && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedNotification(null)}
          ></div>
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl z-50 animate-scale-in max-h-[80vh] overflow-hidden flex flex-col">
            <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${getBackgroundColor(selectedNotification.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    {getIcon(selectedNotification.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-900 dark:text-white mb-2">
                      {selectedNotification.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedNotification.time}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                  {selectedNotification.message}
                </p>
                
                {selectedNotification.details && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <h3 className="text-gray-900 dark:text-white mb-3">{t('detailsLabel')}</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {selectedNotification.details}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  {t('closeButton')}
                </button>
                <button
                  onClick={() => {
                    handleDeleteNotification(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('backToProfile')}</span>
            </button>

            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
            >
              {t('markAllRead')}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-2xl text-gray-900 dark:text-white">{t('notificationsPageTitle')}</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount} {t('unreadNotifications')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {t('allNotifications')} ({notificationsList.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-3 rounded-xl transition-all ${
              filter === 'unread'
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {t('unreadOnly')} ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-6 py-3 rounded-xl transition-all ${
              filter === 'read'
                ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {t('readOnly')} ({notificationsList.length - unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                !notification.read ? 'border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="p-5">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${getBackgroundColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg text-gray-900 dark:text-white">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                        )}
                      </h3>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {notification.time}
                      </p>
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        {t('viewDetailsButton')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('noNotifications')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {filter === 'unread' ? t('allRead') : t('noNewNotifications')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Save, Bell, Lock, Globe, Database, Mail, Building2, DollarSign, Shield, Clock, MapPin, Users, Truck, CreditCard } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'general' | 'company' | 'notifications' | 'security' | 'payment' | 'backup'>('general');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    name: 'Nhà Xe Phương Trang',
    email: 'contact@phuongtrang.vn',
    phone: '1900 6067',
    address: '272 Đề Thám, Phường Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh',
    taxCode: '0123456789',
    website: 'https://phuongtrang.vn',
    logo: ''
  });

  // Pricing Settings
  const [pricingSettings, setPricingSettings] = useState({
    baseRate: 5000,
    perKmRate: 15000,
    cancellationFee: 20,
    lateCancellationHours: 24,
    childDiscountPercent: 50,
    studentDiscountPercent: 10
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    vnpayEnabled: true,
    momoEnabled: true,
    zalopayEnabled: true,
    bankTransferEnabled: true,
    cashEnabled: true
  });

  const tabs = [
    { id: 'general', icon: Globe, label: t('general') },
    { id: 'company', icon: Building2, label: t('companyInfo') },
    { id: 'notifications', icon: Bell, label: t('notifications') },
    { id: 'security', icon: Shield, label: t('security') },
    { id: 'payment', icon: CreditCard, label: t('payment') },
    { id: 'backup', icon: Database, label: t('backup') }
  ];

  const handleSave = () => {
    alert(t('success') + '!');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl text-gray-900 dark:text-white mb-2">{t('settings')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('settingsSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-3 sticky top-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all mb-2 ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {selectedTab === 'general' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 dark:text-white">{t('generalSettings')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('generalSettingsDesc')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('timezone')}</label>
                    <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                      <option>(GMT+7) Bangkok, Hanoi, Jakarta</option>
                      <option>(GMT+8) Hong Kong, Singapore</option>
                      <option>(GMT+9) Tokyo, Seoul</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('defaultLanguage')}</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as 'vi' | 'en')}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {t('currentLanguage')}: {language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('dateFormat')}</label>
                    <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('currency')}</label>
                    <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                      <option>VNĐ - Việt Nam Đồng</option>
                      <option>USD - US Dollar</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 dark:text-white">{t('businessHours')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('businessHoursDesc')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-700 dark:text-gray-300 py-3">{t('weekdays')}</div>
                    <input
                      type="time"
                      defaultValue="06:00"
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-gray-700 dark:text-gray-300 py-3">{t('weekend')}</div>
                    <input
                      type="time"
                      defaultValue="05:00"
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                    <input
                      type="time"
                      defaultValue="23:00"
                      className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Company Settings */}
          {selectedTab === 'company' && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 dark:text-white">{t('companySettings')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('companySettingsDesc')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('companyName')}</label>
                    <input
                      type="text"
                      value={companySettings.name}
                      onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={companySettings.email}
                        onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('phone')}</label>
                      <input
                        type="tel"
                        value={companySettings.phone}
                        onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('address')}</label>
                    <textarea
                      value={companySettings.address}
                      onChange={(e) => setCompanySettings({...companySettings, address: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('taxCode')}</label>
                      <input
                        type="text"
                        value={companySettings.taxCode}
                        onChange={(e) => setCompanySettings({...companySettings, taxCode: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">Website</label>
                      <input
                        type="url"
                        value={companySettings.website}
                        onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('companyLogo')}</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                        {t('uploadLogo')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 dark:text-white">{t('pricingSettings')}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('pricingSettingsDesc')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('baseRate')}</label>
                      <input
                        type="number"
                        value={pricingSettings.baseRate}
                        onChange={(e) => setPricingSettings({...pricingSettings, baseRate: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('perKmRate')}</label>
                      <input
                        type="number"
                        value={pricingSettings.perKmRate}
                        onChange={(e) => setPricingSettings({...pricingSettings, perKmRate: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('cancellationFee')}</label>
                      <input
                        type="number"
                        value={pricingSettings.cancellationFee}
                        onChange={(e) => setPricingSettings({...pricingSettings, cancellationFee: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('lateCancellationHours')}</label>
                      <input
                        type="number"
                        value={pricingSettings.lateCancellationHours}
                        onChange={(e) => setPricingSettings({...pricingSettings, lateCancellationHours: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('childDiscount')}</label>
                      <input
                        type="number"
                        value={pricingSettings.childDiscountPercent}
                        onChange={(e) => setPricingSettings({...pricingSettings, childDiscountPercent: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('studentDiscount')}</label>
                      <input
                        type="number"
                        value={pricingSettings.studentDiscountPercent}
                        onChange={(e) => setPricingSettings({...pricingSettings, studentDiscountPercent: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications */}
          {selectedTab === 'notifications' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl text-gray-900 dark:text-white">{t('notificationSettings')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('notificationSettingsDesc')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">{t('emailNotifications')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('emailNotificationsDesc')}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">{t('pushNotifications')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('pushNotificationsDesc')}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">{t('smsNotifications')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('smsNotificationsDesc')}</div>
                  </div>
                  <label className="relative inline-flex items-cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Email Templates */}
                <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-gray-900 dark:text-white mb-4">{t('emailTemplates')}</h4>
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      <div className="text-gray-900 dark:text-white">{t('bookingConfirmEmail')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('bookingConfirmEmailDesc')}</div>
                    </button>
                    <button className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      <div className="text-gray-900 dark:text-white">{t('cancellationEmail')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('cancellationEmailDesc')}</div>
                    </button>
                    <button className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      <div className="text-gray-900 dark:text-white">{t('reminderEmail')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('reminderEmailDesc')}</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {selectedTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl text-gray-900 dark:text-white">{t('securitySettings')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('securitySettingsDesc')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-900 dark:text-white mb-1">{t('changePassword')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('changePasswordDesc')}</div>
                    </div>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">{t('twoFactorAuth')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('twoFactorAuthDesc')}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-900 dark:text-white mb-1">{t('loginHistory')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('loginHistoryDesc')}</div>
                    </div>
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                <button className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-gray-900 dark:text-white mb-1">{t('manageSession')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('manageSessionDesc')}</div>
                    </div>
                    <Shield className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                {/* Security Policies */}
                <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-gray-900 dark:text-white mb-4">{t('securityPolicies')}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('sessionTimeout')}</label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('maxLoginAttempts')}</label>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {selectedTab === 'payment' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl text-gray-900 dark:text-white">{t('paymentGateway')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('paymentGatewayDesc')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white">💳</span>
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white mb-1">{t('vnpay')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('vnpayDesc')}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.vnpayEnabled}
                      onChange={(e) => setPaymentSettings({...paymentSettings, vnpayEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
                      <span className="text-white">M</span>
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white mb-1">{t('momo')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('momoDesc')}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.momoEnabled}
                      onChange={(e) => setPaymentSettings({...paymentSettings, momoEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white">Z</span>
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white mb-1">{t('zalopay')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('zalopayDesc')}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.zalopayEnabled}
                      onChange={(e) => setPaymentSettings({...paymentSettings, zalopayEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white">🏦</span>
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white mb-1">{t('bankTransfer')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('bankTransferDesc')}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.bankTransferEnabled}
                      onChange={(e) => setPaymentSettings({...paymentSettings, bankTransferEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <span className="text-white">💵</span>
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white mb-1">{t('cash')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t('cashDesc')}</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.cashEnabled}
                      onChange={(e) => setPaymentSettings({...paymentSettings, cashEnabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Backup */}
          {selectedTab === 'backup' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl text-gray-900 dark:text-white">{t('backupSettings')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('backupSettingsDesc')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <div className="text-gray-900 dark:text-white mb-1">{t('autoBackup')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('autoBackupDesc')}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoBackup}
                      onChange={(e) => setAutoBackup(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('backupFrequency')}</label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                    <option>{t('daily')}</option>
                    <option>{t('weekly')}</option>
                    <option>{t('monthly')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('retentionDays')}</label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                <button className="w-full p-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>{t('backupNow')}</span>
                </button>

                {/* Recent Backups */}
                <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-gray-900 dark:text-white mb-4">{t('recentBackups')}</h4>
                  <div className="space-y-3">
                    {[
                      { date: '05/12/2024 02:00', size: '245 MB', status: 'success' },
                      { date: '04/12/2024 02:00', size: '242 MB', status: 'success' },
                      { date: '03/12/2024 02:00', size: '238 MB', status: 'success' }
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <div className="text-gray-900 dark:text-white text-sm">{backup.date}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{backup.size}</div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all">
                          {t('restore')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{t('saveAllChanges')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

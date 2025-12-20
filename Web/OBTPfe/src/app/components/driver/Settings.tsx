import { ArrowLeft, Save, Globe, Clock, DollarSign, Bell, Shield, Database, Upload, Check } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'general' | 'company' | 'pricing' | 'notifications' | 'security' | 'backup'>('general');
  const [showSuccess, setShowSuccess] = useState(false);

  // General settings
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [currency, setCurrency] = useState('VND');

  // Company settings
  const [companyName, setCompanyName] = useState('Nhà Xe Phương Trang');
  const [address, setAddress] = useState('123 Đường ABC, Quận 1, TP. HCM');
  const [taxCode, setTaxCode] = useState('0123456789');
  const [website, setWebsite] = useState('https://vexere.com');

  // Pricing settings
  const [baseRate, setBaseRate] = useState('50000');
  const [perKmRate, setPerKmRate] = useState('5000');
  const [cancellationFee, setCancellationFee] = useState('10');
  const [lateCancellationHours, setLateCancellationHours] = useState('24');

  // Notification settings
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  // Security settings
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Backup settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [retentionDays, setRetentionDays] = useState('30');

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general' as const, label: t('general'), icon: Globe },
    { id: 'company' as const, label: t('companyInfo'), icon: Upload },
    { id: 'pricing' as const, label: t('payment'), icon: DollarSign },
    { id: 'notifications' as const, label: t('notifications'), icon: Bell },
    { id: 'security' as const, label: t('security'), icon: Shield },
    { id: 'backup' as const, label: t('backup'), icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
            <Check className="w-6 h-6" />
            <span className="font-medium">{t('success')}! {t('saveChanges')}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back')}</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-gray-900 dark:text-white">{t('settings')}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('settingsSubtitle')}</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{t('saveAllChanges')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Tabs Sidebar */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-6 py-4 flex items-center space-x-3 transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl text-gray-900 dark:text-white mb-2">{t('generalSettings')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('generalSettingsDesc')}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('timezone')}</label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                      >
                        <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh (GMT+7)</option>
                        <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                        <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('dateFormat')}</label>
                      <select
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('currency')}</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                      >
                        <option value="VND">VND (₫)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                      <h3 className="text-lg text-gray-900 dark:text-white mb-4">{t('businessHours')}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('weekdays')}</label>
                          <input
                            type="text"
                            defaultValue="08:00 - 18:00"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('weekend')}</label>
                          <input
                            type="text"
                            defaultValue="08:00 - 17:00"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Settings */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl text-gray-900 dark:text-white mb-2">{t('companySettings')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('companySettingsDesc')}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('companyName')}</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('address')}</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('taxCode')}</label>
                        <input
                          type="text"
                          value={taxCode}
                          onChange={(e) => setTaxCode(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('website')}</label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('companyLogo')}</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                          {t('uploadLogo')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Settings */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl text-gray-900 dark:text-white mb-2">{t('pricingSettings')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('pricingSettingsDesc')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('baseRate')}</label>
                        <input
                          type="number"
                          value={baseRate}
                          onChange={(e) => setBaseRate(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('perKmRate')}</label>
                        <input
                          type="number"
                          value={perKmRate}
                          onChange={(e) => setPerKmRate(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('cancellationFee')}</label>
                        <input
                          type="number"
                          value={cancellationFee}
                          onChange={(e) => setCancellationFee(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('lateCancellationHours')}</label>
                        <input
                          type="number"
                          value={lateCancellationHours}
                          onChange={(e) => setLateCancellationHours(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                      <h3 className="text-lg text-gray-900 dark:text-white mb-4">Giảm giá</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('childDiscount')}</label>
                          <input
                            type="number"
                            defaultValue="25"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('studentDiscount')}</label>
                          <input
                            type="number"
                            defaultValue="10"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl text-gray-900 dark:text-white mb-2">{t('notificationSettings')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('notificationSettingsDesc')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="text-gray-900 dark:text-white mb-1">{t('emailNotifications')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('emailNotificationsDesc')}</p>
                      </div>
                      <button
                        onClick={() => setEmailNotif(!emailNotif)}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          emailNotif ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            emailNotif ? 'left-7' : 'left-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="text-gray-900 dark:text-white mb-1">{t('pushNotifications')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('pushNotificationsDesc')}</p>
                      </div>
                      <button
                        onClick={() => setPushNotif(!pushNotif)}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          pushNotif ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            pushNotif ? 'left-7' : 'left-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="text-gray-900 dark:text-white mb-1">{t('smsNotifications')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('smsNotificationsDesc')}</p>
                      </div>
                      <button
                        onClick={() => setSmsNotif(!smsNotif)}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          smsNotif ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            smsNotif ? 'left-7' : 'left-1'
                          }`}
                        ></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl text-gray-900 dark:text-white mb-2">{t('securitySettings')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('securitySettingsDesc')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <h3 className="text-gray-900 dark:text-white mb-2">{t('changePassword')}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t('changePasswordDesc')}</p>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                        {t('changePassword')}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="text-gray-900 dark:text-white mb-1">{t('twoFactorAuth')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('twoFactorAuthDesc')}</p>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            twoFactorEnabled ? 'left-7' : 'left-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                      <h3 className="text-lg text-gray-900 dark:text-white mb-4">{t('securityPolicies')}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('sessionTimeout')}</label>
                          <input
                            type="number"
                            value={sessionTimeout}
                            onChange={(e) => setSessionTimeout(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('maxLoginAttempts')}</label>
                          <input
                            type="number"
                            value={maxLoginAttempts}
                            onChange={(e) => setMaxLoginAttempts(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Backup Settings */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl text-gray-900 dark:text-white mb-2">{t('backupSettings')}</h2>
                    <p className="text-gray-600 dark:text-gray-400">{t('backupSettingsDesc')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="text-gray-900 dark:text-white mb-1">{t('autoBackup')}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('autoBackupDesc')}</p>
                      </div>
                      <button
                        onClick={() => setAutoBackup(!autoBackup)}
                        className={`relative w-14 h-8 rounded-full transition-all ${
                          autoBackup ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                            autoBackup ? 'left-7' : 'left-1'
                          }`}
                        ></div>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('backupFrequency')}</label>
                        <select
                          value={backupFrequency}
                          onChange={(e) => setBackupFrequency(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        >
                          <option value="daily">{t('daily')}</option>
                          <option value="weekly">{t('weekly')}</option>
                          <option value="monthly">{t('monthly')}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t('retentionDays')}</label>
                        <input
                          type="number"
                          value={retentionDays}
                          onChange={(e) => setRetentionDays(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all">
                      {t('backupNow')}
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                      <h3 className="text-lg text-gray-900 dark:text-white mb-4">{t('recentBackups')}</h3>
                      <div className="space-y-2">
                        {[
                          { date: '08/12/2024 02:00', size: '2.5 GB' },
                          { date: '07/12/2024 02:00', size: '2.4 GB' },
                          { date: '06/12/2024 02:00', size: '2.3 GB' },
                        ].map((backup, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                            <div>
                              <p className="text-gray-900 dark:text-white">{backup.date}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{backup.size}</p>
                            </div>
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all">
                              {t('restore')}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

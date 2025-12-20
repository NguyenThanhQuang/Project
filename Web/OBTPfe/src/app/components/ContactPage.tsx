import { ArrowLeft, MapPin, Phone, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { Header } from './Header';

interface ContactPageProps {
  onBack: () => void;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onMyTripsClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onRoutesClick?: () => void;
  onTicketLookupClick?: () => void;
  onHotlineClick?: () => void;
}

export function ContactPage({ 
  onBack,
  isLoggedIn,
  onLoginClick,
  onMyTripsClick,
  onProfileClick,
  onLogout,
  onRoutesClick,
  onTicketLookupClick,
  onHotlineClick
}: ContactPageProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t('messageSent'));
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Header
        onHomeClick={onBack}
        isLoggedIn={isLoggedIn}
        onLoginClick={onLoginClick}
        onMyTripsClick={onMyTripsClick}
        onProfileClick={onProfileClick}
        onLogout={onLogout}
        onRoutesClick={onRoutesClick}
        onContactClick={() => {}}
        onTicketLookupClick={onTicketLookupClick}
        onHotlineClick={onHotlineClick}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
            {t('contactTitle')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('contactSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl text-gray-900 dark:text-white mb-6">{t('contactInfo')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-teal-500 text-white rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-1">{t('addressLabel')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('addressValue')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-1">{t('phoneLabel')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">1900 6067</p>
                    <p className="text-gray-600 dark:text-gray-400">+84 123 456 789</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-1">{t('emailLabel')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">support@vexe.com</p>
                    <p className="text-gray-600 dark:text-gray-400">info@vexe.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>{t('mapLocation')}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl text-gray-900 dark:text-white mb-6">{t('sendMessage')}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t('email')} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t('message')} *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                  placeholder="Nội dung tin nhắn..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{t('send')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
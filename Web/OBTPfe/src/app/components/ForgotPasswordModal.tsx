import { useState } from 'react';
import { X, Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface ForgotPasswordModalProps {
  onClose: () => void;
  userType: 'driver' | 'company' | 'system' | 'customer';
}

export function ForgotPasswordModal({ onClose, userType }: ForgotPasswordModalProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const config = {
    driver: {
      title: t('forgotPasswordDriver'),
      gradient: 'from-blue-600 to-teal-500',
      shadowColor: 'blue'
    },
    company: {
      title: t('forgotPasswordCompany'),
      gradient: 'from-indigo-600 to-blue-500',
      shadowColor: 'indigo'
    },
    system: {
      title: t('forgotPasswordSystem'),
      gradient: 'from-slate-700 to-slate-600',
      shadowColor: 'slate'
    },
    customer: {
      title: t('forgotPasswordCustomer'),
      gradient: 'from-blue-600 to-teal-500',
      shadowColor: 'blue'
    }
  };

  const currentConfig = config[userType];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleClose = () => {
    setEmail('');
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${currentConfig.gradient} p-6 relative`}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl text-white pr-10">
            {currentConfig.title}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {t('enterEmailToReset')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {t('registeredEmail')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {t('resetLinkNote')}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 bg-gradient-to-r ${currentConfig.gradient} text-white rounded-xl hover:shadow-xl hover:shadow-${currentConfig.shadowColor}-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t('sendingEmail')}</span>
                  </span>
                ) : (
                  t('sendResetLinkButton')
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${currentConfig.gradient} rounded-full mb-4`}>
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-gray-900 dark:text-white">
                {t('emailSentSuccess')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('checkEmailMessage')} <strong>{email}</strong> {t('checkEmailFor')}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  💡 <strong>{t('noteLabel')}</strong> {t('checkSpamFolder')}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                <span className="flex items-center justify-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t('backToLogin')}</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
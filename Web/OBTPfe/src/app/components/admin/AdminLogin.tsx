import { useState } from 'react';
import { User, Lock, Shield, Building2, ArrowLeft } from 'lucide-react';
import { ForgotPasswordModal } from '../ForgotPasswordModal';
import { useLanguage } from '../LanguageContext';

interface AdminLoginProps {
  onLoginSuccess: (adminData: { name: string; id: string; email: string }) => void;
  onBack: () => void;
  adminType: 'company' | 'system';
}

export function AdminLogin({ onLoginSuccess, onBack, adminType }: AdminLoginProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const config = {
    company: {
      icon: Building2,
      title: t('companyAdminTitle'),
      subtitle: t('companyLoginSubtitle'),
      gradient: 'from-indigo-600 to-blue-500',
      shadowColor: 'indigo'
    },
    system: {
      icon: Shield,
      title: t('systemAdminTitle'),
      subtitle: t('systemLoginSubtitle'),
      gradient: 'from-slate-700 to-slate-600',
      shadowColor: 'slate'
    }
  };

  const currentConfig = config[adminType];
  const Icon = currentConfig.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      if (username && password) {
        onLoginSuccess({
          name: adminType === 'company' ? 'Nguyễn Văn Quản Lý' : 'Admin Hệ Thống',
          id: adminType === 'company' ? 'QL001' : 'ADM001',
          email: adminType === 'company' ? 'quanly@vexe.com' : 'admin@vexe.com'
        });
      } else {
        alert('Vui lòng nhập đầy đủ thông tin!');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentConfig.gradient} flex items-center justify-center p-4`}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-4 flex items-center space-x-2 text-white hover:text-opacity-80 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('backToHome')}</span>
        </button>

        {/* Login Card */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${currentConfig.gradient} rounded-3xl mb-4 shadow-lg shadow-${currentConfig.shadowColor}-500/30`}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl text-gray-900 dark:text-white mb-2">
              {currentConfig.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentConfig.subtitle}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                {t('username')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('enterUsername')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('enterPassword')}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-600 dark:text-gray-400">{t('rememberMe')}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className={`bg-gradient-to-r ${currentConfig.gradient} bg-clip-text text-transparent hover:underline`}
              >
                {t('forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 bg-gradient-to-r ${currentConfig.gradient} text-white rounded-xl hover:shadow-2xl hover:shadow-${currentConfig.shadowColor}-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('loggingIn')}</span>
                </span>
              ) : (
                t('login')
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className={`mt-6 p-4 bg-${currentConfig.shadowColor}-50 dark:bg-${currentConfig.shadowColor}-900/30 rounded-xl border border-${currentConfig.shadowColor}-200 dark:border-${currentConfig.shadowColor}-700`}>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
              <strong>Demo:</strong> {t('demoLoginInstruction')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              {t('demoExample')}
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal
          userType={adminType}
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
}
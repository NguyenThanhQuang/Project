import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface ChangePasswordProps {
  onBack: () => void;
}

export function ChangePassword({ onBack }: ChangePasswordProps) {
  const { t } = useLanguage();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordRequirements = [
    { label: t('minLength'), met: newPassword.length >= 8 },
    { label: t('hasUppercase'), met: /[A-Z]/.test(newPassword) },
    { label: t('hasLowercase'), met: /[a-z]/.test(newPassword) },
    { label: t('hasNumber'), met: /[0-9]/.test(newPassword) },
    { label: t('hasSpecialChar'), met: /[!@#$%^&*]/.test(newPassword) }
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return;
    }

    if (!newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (!allRequirementsMet) {
      setError('Mật khẩu mới không đáp ứng yêu cầu');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        onBack();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('backToProfile')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl mb-4 shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl text-gray-900 dark:text-white mb-2">{t('changePasswordTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('changePasswordSubtitle')}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-green-700 dark:text-green-300">
                {t('passwordChangeSuccess')}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {t('redirecting')}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-2xl flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t('currentPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('enterCurrentPassword')}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t('newPasswordLabel')}
            </label>
            <div className="relative mb-4">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('enterNewPassword')}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {newPassword && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('passwordRequirements')}</p>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {req.met ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                    )}
                    <span className={`text-sm ${req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t('confirmNewPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('reEnterNewPassword')}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-sm text-red-500 mt-2">{t('passwordMismatchError')}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={success}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {success ? t('redirecting') : t('changePasswordButton')}
          </button>
        </form>

        {/* Security Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg text-gray-900 dark:text-white mb-3">{t('securityTipsTitle')}</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span>{t('securityTip1')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span>{t('securityTip2')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span>{t('securityTip3')}</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-500">•</span>
              <span>{t('securityTip4')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
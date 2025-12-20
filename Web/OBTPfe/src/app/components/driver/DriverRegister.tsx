import { useState } from 'react';
import { User, Lock, Phone, Mail, MapPin, FileText, ArrowLeft, Upload, Car, Camera, X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface DriverRegisterProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
  onBackToHome: () => void;
}

export function DriverRegister({ onRegisterSuccess, onBackToLogin, onBackToHome }: DriverRegisterProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    experience: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert(t('passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      alert(t('passwordTooShort'));
      return;
    }

    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      alert(t('registrationSuccessMessage'));
      onRegisterSuccess();
      setIsLoading(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  const removeLicense = () => {
    setLicensePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 dark:from-blue-900 dark:via-blue-800 dark:to-teal-800 py-8 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Back buttons */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToLogin}
            className="flex items-center space-x-2 text-white hover:text-blue-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('backToLoginPage')}</span>
          </button>
          <button
            onClick={onBackToHome}
            className="text-white hover:text-blue-100 transition-all text-sm"
          >
            {t('backToHomePage')} →
          </button>
        </div>

        {/* Registration Card */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl mb-4 shadow-lg shadow-blue-500/30">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl text-gray-900 dark:text-white mb-2">
              {t('driverRegistrationTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('driverRegistrationSubtitle')}
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div>
              <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>{t('avatarSection')}</span>
              </h3>
              
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {avatarPreview ? (
                    <div className="relative group">
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-gray-200 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-500">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all inline-flex items-center space-x-2">
                      <Camera className="w-5 h-5" />
                      <span>{t('chooseAvatar')}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t('imageFormat')}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{t('personalInfoSection')}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('fullNameLabel')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('fullNamePlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('phoneLabel')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('phonePlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('emailField')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('emailPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('addressLabel')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={t('addressPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>{t('professionalInfoSection')}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('licenseNumberField')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder={t('licenseNumberPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('experienceLabel')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder={t('experiencePlaceholder')}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('licenseImageLabel')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  
                  {licensePreview ? (
                    <div className="relative group">
                      <img
                        src={licensePreview}
                        alt="License"
                        className="w-full max-h-64 object-contain bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-gray-200 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={removeLicense}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-gray-50 dark:bg-gray-700/50">
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('uploadLicenseImage')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {t('imageFormat')}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLicenseChange}
                        className="hidden"
                        required
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>{t('accountInfoSection')}</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('usernameField')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder={t('usernamePlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('passwordField')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={t('passwordPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('confirmPasswordField')} <span className="text-red-500">{t('required')}</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder={t('confirmPasswordPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="pt-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('agreeToTerms')} <a href="#" className="text-blue-600 hover:underline">{t('termsAndConditions')}</a> {t('and')} <a href="#" className="text-blue-600 hover:underline">{t('privacyPolicyLink')}</a> {t('ofVeXe')}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('processing')}</span>
                </span>
              ) : (
                t('registerButton')
              )}
            </button>
          </form>

          {/* Info Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              <strong>{t('registrationNote')}</strong> {t('registrationNoteText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
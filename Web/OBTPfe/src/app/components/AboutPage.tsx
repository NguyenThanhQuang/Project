import { ArrowLeft, Award, Users, MapPin, TrendingUp, Shield, Clock, HeartHandshake } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { Header } from './Header';

interface AboutPageProps {
  onBack: () => void;
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onMyTripsClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onRoutesClick?: () => void;
  onContactClick?: () => void;
  onTicketLookupClick?: () => void;
  onHotlineClick?: () => void;
}

export function AboutPage({ 
  onBack,
  isLoggedIn,
  onLoginClick,
  onMyTripsClick,
  onProfileClick,
  onLogout,
  onRoutesClick,
  onContactClick,
  onTicketLookupClick,
  onHotlineClick
}: AboutPageProps) {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, labelKey: 'customers', value: '10,000,000+', color: 'from-blue-600 to-blue-500' },
    { icon: MapPin, labelKey: 'routesCount', value: '500+', color: 'from-green-600 to-green-500' },
    { icon: TrendingUp, labelKey: 'partnerCompanies', value: '200+', color: 'from-purple-600 to-purple-500' },
    { icon: Award, labelKey: 'yearsExperience', value: '10+', color: 'from-orange-600 to-orange-500' }
  ];

  const values = [
    {
      icon: Shield,
      titleKey: 'safetyAndTrust',
      descKey: 'safetyDescription',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      titleKey: 'onTime',
      descKey: 'onTimeDescription',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: HeartHandshake,
      titleKey: 'dedicatedService',
      descKey: 'dedicatedServiceDescription',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      titleKey: 'highQuality',
      descKey: 'highQualityDescription',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const timeline = [
    { year: '2014', titleKey: 'founded', descKey: 'foundedDesc' },
    { year: '2016', titleKey: 'expansion', descKey: 'expansionDesc' },
    { year: '2019', titleKey: 'mobileApp', descKey: 'mobileAppDesc' },
    { year: '2021', titleKey: '5M', descKey: 'milestone5M' },
    { year: '2023', titleKey: 'award', descKey: 'awardDesc' },
    { year: '2024', titleKey: 'present', descKey: 'presentDesc' }
  ];

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
        onContactClick={onContactClick}
        onTicketLookupClick={onTicketLookupClick}
        onHotlineClick={onHotlineClick}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl text-gray-900 dark:text-white mb-6 animate-fade-in">
            {t('aboutUs')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('aboutDescription')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform"
              >
                <div className={`inline-flex p-4 bg-gradient-to-r ${stat.color} rounded-2xl mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl text-gray-900 dark:text-white mb-2">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-400">{t(stat.labelKey)}</p>
              </div>
            );
          })}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl mb-4">{t('mission')}</h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              {t('missionDescription')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl text-gray-900 dark:text-white mb-4">{t('vision')}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {t('visionDescription')}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-4xl text-gray-900 dark:text-white text-center mb-12">
            {t('coreValues')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all"
                >
                  <div className={`inline-flex p-4 bg-gradient-to-r ${value.color} rounded-2xl mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 dark:text-white mb-3">{t(value.titleKey)}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t(value.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-4xl text-gray-900 dark:text-white text-center mb-12">
            {t('developmentJourney')}
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 to-teal-500"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
                      <span className="text-3xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                        {item.year}
                      </span>
                      <h3 className="text-xl text-gray-900 dark:text-white mt-2 mb-2">{t(item.titleKey)}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{t(item.descKey)}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full border-4 border-white dark:border-gray-900"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl mb-4">{t('readyToExplore')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('bookToday')}
          </p>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all text-lg hover:scale-105"
          >
            {t('bookNow')}
          </button>
        </div>
      </div>
    </div>
  );
}
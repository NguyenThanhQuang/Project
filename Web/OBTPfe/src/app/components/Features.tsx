import { Shield, Clock, Ticket, Headphones, Award, CreditCard } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      titleKey: 'safeAndSecure',
      descKey: 'safeAndSecureDesc',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      icon: Clock,
      titleKey: 'timeSaving',
      descKey: 'timeSavingDesc',
      gradient: 'from-teal-500 to-teal-600'
    },
    {
      icon: Ticket,
      titleKey: 'bestPrice',
      descKey: 'bestPriceDesc',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: Headphones,
      titleKey: 'support247',
      descKey: 'support247Desc',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      icon: Award,
      titleKey: 'qualityAssured',
      descKey: 'qualityAssuredDesc',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      icon: CreditCard,
      titleKey: 'multiplePayments',
      descKey: 'multiplePaymentsDesc',
      gradient: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-teal-500/5 dark:from-blue-500/10 dark:to-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 dark:from-teal-500/10 dark:to-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 dark:text-white mb-3">{t('features')}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{t('featuresSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group text-center p-8 rounded-3xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-3">{t(feature.titleKey)}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t(feature.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

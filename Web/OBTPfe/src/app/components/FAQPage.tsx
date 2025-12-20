import { ArrowLeft, ChevronDown, Search, HelpCircle, Ticket, CreditCard, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from './LanguageContext';

interface FAQPageProps {
  onBack: () => void;
}

export function FAQPage({ onBack }: FAQPageProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: t('allCategories'), icon: HelpCircle },
    { id: 'booking', name: t('bookingCategory'), icon: Ticket },
    { id: 'payment', name: t('paymentCategory'), icon: CreditCard },
    { id: 'trip', name: t('tripCategory'), icon: MapPin },
    { id: 'support', name: t('supportCategory'), icon: Phone }
  ];

  const faqs = [
    {
      id: '1',
      category: 'booking',
      question: t('faq1Q'),
      answer: t('faq1A')
    },
    {
      id: '2',
      category: 'booking',
      question: t('faq2Q'),
      answer: t('faq2A')
    },
    {
      id: '3',
      category: 'booking',
      question: t('faq3Q'),
      answer: t('faq3A')
    },
    {
      id: '4',
      category: 'payment',
      question: t('faq4Q'),
      answer: t('faq4A')
    },
    {
      id: '5',
      category: 'payment',
      question: t('faq5Q'),
      answer: t('faq5A')
    },
    {
      id: '6',
      category: 'payment',
      question: t('faq6Q'),
      answer: t('faq6A')
    },
    {
      id: '7',
      category: 'trip',
      question: t('faq7Q'),
      answer: t('faq7A')
    },
    {
      id: '8',
      category: 'trip',
      question: t('faq8Q'),
      answer: t('faq8A')
    },
    {
      id: '9',
      category: 'trip',
      question: t('faq9Q'),
      answer: t('faq9A')
    },
    {
      id: '10',
      category: 'support',
      question: t('faq10Q'),
      answer: t('faq10A')
    },
    {
      id: '11',
      category: 'support',
      question: t('faq11Q'),
      answer: t('faq11A')
    },
    {
      id: '12',
      category: 'support',
      question: t('faq12Q'),
      answer: t('faq12A')
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <span>{t('backToHome')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl mb-6 shadow-lg">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl text-gray-900 dark:text-white mb-4">
            {t('faqTitle')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('faqSubtitle')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchFAQ')}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md border border-gray-200 dark:border-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
            >
              <button
                onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 transition-transform ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedId === faq.id && (
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
              {t('noApplicationsFound')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {t('tryChangeFilter')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

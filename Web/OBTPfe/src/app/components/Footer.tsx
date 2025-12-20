import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface FooterProps {
  onAboutClick?: () => void;
  onFAQClick?: () => void;
  onContactClick?: () => void;
}

export function Footer({ onAboutClick, onFAQClick, onContactClick }: FooterProps = {}) {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-teal-500 text-white px-4 py-3 rounded-2xl shadow-lg">
                <span className="text-2xl">🚌</span>
              </div>
              <span className="text-2xl bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                VeXe.com
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('platformDescription')}
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-400 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">{t('aboutUs')}</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={onAboutClick} className="hover:text-blue-400 transition-all">{t('aboutCompany')}</button>
              </li>
              <li>
                <button onClick={onFAQClick} className="hover:text-blue-400 transition-all">{t('faq')}</button>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">{t('termsOfService')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">{t('privacyPolicy')}</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4">{t('support')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">{t('bookingGuide')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">{t('refundPolicy')}</a>
              </li>
              <li>
                <button onClick={onContactClick} className="hover:text-blue-400 transition-all">{t('contact')}</button>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all">{t('feedbackAndComplaint')}</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span>{t('addressValue')}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-400" />
                <a href="tel:19006067" className="hover:text-blue-400 transition-all">1900 6067</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:support@vexe.com" className="hover:text-blue-400 transition-all">support@vexe.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; 2024 VeXe.com. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Bus } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface FooterProps {
  onAboutClick?: () => void;
  onFAQClick?: () => void;
  onContactClick?: () => void;
  onNavigate?: (page: string) => void;
}

export function Footer({ onAboutClick, onFAQClick, onContactClick, onNavigate }: FooterProps = {}) {
  const { t } = useLanguage();
  
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };
  
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Bus className="w-10 h-10 text-blue-400" />
              <span className="text-2xl bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Online Bus Ticket Platform
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
                <button onClick={() => handleNavigation('about-us')} className="hover:text-blue-400 transition-all">{t('aboutCompany')}</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('faq')} className="hover:text-blue-400 transition-all">{t('faq')}</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('terms')} className="hover:text-blue-400 transition-all">{t('termsOfService')}</button>
              </li>
              <li>
                <button onClick={() => handleNavigation('privacy')} className="hover:text-blue-400 transition-all">{t('privacyPolicy')}</button>
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
                <button onClick={() => handleNavigation('contact-us')} className="hover:text-blue-400 transition-all">{t('contact')}</button>
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
                <a href="mailto:support@busticket.com" className="hover:text-blue-400 transition-all">support@busticket.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; 2025 Online Bus Ticket Platform. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}
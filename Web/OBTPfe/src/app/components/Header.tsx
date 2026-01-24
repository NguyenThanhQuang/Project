import { Bus, User, Globe, Menu, Sun, Moon, ChevronDown, LogOut, Ticket, UserCircle, Phone } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageContext';
import { useState } from 'react';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  onMyTripsClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onRoutesClick?: () => void;
  onContactClick?: () => void;
  onTicketLookupClick?: () => void;
  onHotlineClick?: () => void;
  onHomeClick?: () => void;
}

export function Header({ 
  isLoggedIn = false, 
  onLoginClick,
  onMyTripsClick,
  onProfileClick,
  onLogout,
  onRoutesClick,
  onContactClick,
  onTicketLookupClick,
  onHotlineClick,
  onHomeClick
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={onHomeClick}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <Bus className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent whitespace-nowrap">
              Online Bus Ticket Platform
            </span>
          </button>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={onHomeClick}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all relative group"
            >
              {t('home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={onRoutesClick}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all relative group"
            >
              {t('routes')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={onTicketLookupClick}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all relative group"
            >
              {t('ticketLookup')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={onContactClick}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all relative group"
            >
              {t('contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-teal-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onHotlineClick}
              className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 group"
            >
              <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>{t('hotline')}</span>
            </button>
            
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 group"
            >
              <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="uppercase">{language}</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105"
                >
                  <User className="w-4 h-4" />
                  <span>{t('account')}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-scale-in">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-600/10 to-teal-500/10">
                      <div className="text-gray-900 dark:text-white">Nguyễn Văn A</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">nguyenvana@example.com</div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onMyTripsClick?.();
                        }}
                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
                      >
                        <Ticket className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                        <span className="text-gray-900 dark:text-white">{t('myTrips')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onProfileClick?.();
                        }}
                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group"
                      >
                        <UserCircle className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                        <span className="text-gray-900 dark:text-white">{t('profile')}</span>
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout?.();
                        }}
                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left group"
                      >
                        <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <span className="text-red-600 dark:text-red-400">{t('logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105"
              >
                <User className="w-4 h-4" />
                <span>{t('login')}</span>
              </button>
            )}
            
            <button className="lg:hidden p-2 text-gray-700 dark:text-gray-300">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

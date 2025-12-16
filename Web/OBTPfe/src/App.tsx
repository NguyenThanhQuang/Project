import { ThemeProvider } from './app/components/ThemeProvider';
import { LanguageProvider, useLanguage } from './app/components/LanguageContext';
import { DriverApp } from './app/components/driver/DriverApp';
import { AdminApp } from './app/components/admin/AdminApp';
import { AppRouter } from './app/components/AppRouter';
import { useState } from 'react';
import { Car, Building2, Settings, X } from 'lucide-react';

type AppMode = 'customer' | 'driver' | 'company-admin' | 'system-admin';

function PortalButtons({ 
  showPortalButtons, 
  setAppMode 
}: { 
  showPortalButtons: boolean; 
  setAppMode: (mode: AppMode) => void;
}) {
  const { t } = useLanguage();
  const [expandedPortal, setExpandedPortal] = useState(false);

  if (!showPortalButtons) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!expandedPortal ? (
        <button
          onClick={() => setExpandedPortal(true)}
          className="group relative p-4 bg-gradient-to-br from-blue-600 to-teal-500 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 animate-pulse-glow"
          title={t('managementPortal')}
        >
          <Settings className="w-7 h-7 animate-spin-slow" style={{ animationDuration: '3s' }} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
        </button>
      ) : (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 animate-scale-in" style={{ minWidth: '280px' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 style={{ fontSize: 'var(--text-base)' }} className="text-gray-900 dark:text-white">
              {t('managementPortal')}
            </h3>
            <button
              onClick={() => setExpandedPortal(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <button
            onClick={() => setAppMode('driver')}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105"
          >
            <Car className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div style={{ fontSize: 'var(--text-sm)' }}>{t('driverPortalTitle')}</div>
              <div style={{ fontSize: 'var(--text-xs)' }} className="opacity-80">{t('manageTrips')}</div>
            </div>
          </button>
          
          <button
            onClick={() => setAppMode('company-admin')}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105"
          >
            <Building2 className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div style={{ fontSize: 'var(--text-sm)' }}>{t('companyAdminTitle')}</div>
              <div style={{ fontSize: 'var(--text-xs)' }} className="opacity-80">{t('manageBusiness')}</div>
            </div>
          </button>
          
          <button
            onClick={() => setAppMode('system-admin')}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-xl shadow-lg hover:shadow-slate-500/30 transition-all hover:scale-105"
          >
            <Settings className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div style={{ fontSize: 'var(--text-sm)' }}>{t('systemAdminTitle')}</div>
              <div style={{ fontSize: 'var(--text-xs)' }} className="opacity-80">{t('manageSystem')}</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('customer');
  const [showPortalButtons, setShowPortalButtons] = useState(true);

  // Check URL hash for initial mode
  const hash = window.location.hash;
  const initialMode = 
    hash === '#driver' ? 'driver' :
    hash === '#company-admin' ? 'company-admin' :
    hash === '#system-admin' ? 'system-admin' :
    'customer';

  if (appMode !== initialMode && appMode === 'customer') {
    setAppMode(initialMode as AppMode);
  }

  if (appMode === 'driver') {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <DriverApp onLogout={() => setAppMode('customer')} />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  if (appMode === 'company-admin') {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AdminApp adminType="company" onLogout={() => setAppMode('customer')} />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  if (appMode === 'system-admin') {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <AdminApp adminType="system" onLogout={() => setAppMode('customer')} />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <AppRouter onPageChange={(isHome) => setShowPortalButtons(isHome)} />
          
          {/* Quick access portals - only show on home page */}
          <PortalButtons 
            showPortalButtons={showPortalButtons}
            setAppMode={setAppMode}
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Keyboard } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess: (passengerName: string, seatNumber: string) => void;
}

export function QRScanner({ onClose, onScanSuccess }: QRScannerProps) {
  const { t } = useLanguage();
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [passengerInfo, setPassengerInfo] = useState<{name: string; seat: string} | null>(null);

  // Simulate scan success after 2 seconds for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      handleScanSuccess('Nguyễn Văn A', 'A1');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleScanSuccess = (name: string, seat: string) => {
    setPassengerInfo({ name, seat });
    setScanResult('success');
    // Simulate vibration
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    onScanSuccess(name, seat);
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      // Simulate validation
      if (manualCode.length >= 6) {
        handleScanSuccess('Nguyễn Văn A', 'A1');
      } else {
        setScanResult('error');
        setTimeout(() => setScanResult(null), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Camera View */}
      <div className="relative w-full h-full">
        {/* Simulated camera feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/20 text-6xl">📷</div>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Scanning frame */}
            <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-3xl"></div>
              
              {/* Scanning line animation */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Instruction text */}
        <div className="absolute top-1/4 left-0 right-0 text-center px-6">
          <p className="text-white text-lg mb-2">{t('scanQRInstruction')}</p>
          <p className="text-white/70 text-sm">{t('holdSteady')}</p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Manual input button */}
        {!showManualInput && (
          <button
            onClick={() => setShowManualInput(true)}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all flex items-center space-x-2"
          >
            <Keyboard className="w-5 h-5" />
            <span>{t('manualEntry')}</span>
          </button>
        )}

        {/* Manual input form */}
        {showManualInput && (
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 shadow-2xl">
            <h3 className="text-gray-900 dark:text-white mb-4">{t('enterTicketCode')}</h3>
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={t('enterTicketCodePlaceholder')}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder:text-gray-400"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowManualInput(false)}
                  className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-lg transition-all"
                >
                  {t('confirm')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Scan result overlay */}
        {scanResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl mx-4 ${
              scanResult === 'success' ? 'border-4 border-green-500' : 'border-4 border-red-500'
            }`}>
              {scanResult === 'success' ? (
                <>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-gray-900 dark:text-white text-center mb-2">{t('checkinSuccess')}</h3>
                  {passengerInfo && (
                    <p className="text-gray-600 dark:text-gray-400 text-center">{passengerInfo.name} - {t('seatLabel')} {passengerInfo.seat}</p>
                  )}
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-gray-900 dark:text-white text-center mb-2">{t('invalidTicket')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">{t('pleaseTryAgain')}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
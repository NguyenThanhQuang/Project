import { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Check } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface PaymentModalProps {
  onClose: () => void;
  onPaymentComplete: () => void;
  amount: number;
  ticketInfo: {
    route: string;
    date: string;
    time: string;
    seats: string[];
  };
}

export function PaymentModal({ onClose, onPaymentComplete, amount, ticketInfo }: PaymentModalProps) {
  const { t, language } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'momo' | 'bank-transfer'>('credit-card');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        onPaymentComplete();
      }, 1500);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US').format(price) + (language === 'vi' ? 'đ' : ' VND');
  };

  if (completed) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl text-gray-900 dark:text-white mb-2">{t('paymentSuccess')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('ticketConfirmed')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900 dark:text-white">{t('payment')}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Ticket Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-6">
            <h4 className="text-gray-900 dark:text-white mb-4">{t('ticketInfo')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('routeLabel')}</span>
                <span className="text-gray-900 dark:text-white">{ticketInfo.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('dateLabel')}</span>
                <span className="text-gray-900 dark:text-white">{ticketInfo.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('departureTimeLabel')}</span>
                <span className="text-gray-900 dark:text-white">{ticketInfo.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('seatNumberLabel')}</span>
                <span className="text-gray-900 dark:text-white">{ticketInfo.seats.join(', ')}</span>
              </div>
              <div className="pt-3 mt-3 border-t border-blue-200 dark:border-blue-800 flex justify-between">
                <span className="text-gray-900 dark:text-white">{t('totalAmount')}</span>
                <span className="text-xl text-blue-600 dark:text-blue-400">{formatPrice(amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-gray-900 dark:text-white mb-4">{t('paymentMethod')}</h4>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('credit-card')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'credit-card'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'credit-card'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-gray-900 dark:text-white">{t('creditCard')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('creditCardDesc')}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('momo')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'momo'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'momo'
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-gray-900 dark:text-white">{t('momoWallet')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('momoWalletDesc')}</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('bank-transfer')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === 'bank-transfer'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === 'bank-transfer'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-gray-900 dark:text-white">{t('bankTransfer')}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('bankTransferDesc')}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'credit-card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('cardNumber')}</label>
                <input
                  type="text"
                  placeholder={t('cardNumberPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('expiryDate')}</label>
                  <input
                    type="text"
                    placeholder={t('expiryDatePlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t('cardholderName')}</label>
                <input
                  type="text"
                  placeholder={t('cardholderPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handlePayment}
              disabled={processing}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? t('processingPayment') : `${t('payButton')} ${formatPrice(amount)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
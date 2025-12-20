import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface EarningsProps {
  onBack: () => void;
}

export function Earnings({ onBack }: EarningsProps) {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const earnings = {
    week: {
      total: 18500000,
      base: 15000000,
      bonus: 2500000,
      fuel: 1000000,
      net: 17500000
    },
    month: {
      total: 75000000,
      base: 62000000,
      bonus: 8000000,
      fuel: 5000000,
      net: 70000000
    },
    year: {
      total: 900000000,
      base: 744000000,
      bonus: 96000000,
      fuel: 60000000,
      net: 840000000
    }
  };

  const transactions = [
    {
      id: '1',
      date: '05/12/2024',
      description: 'Chuyến TP. HCM → Đà Lạt',
      amount: 12600000,
      type: 'earning'
    },
    {
      id: '2',
      date: '04/12/2024',
      description: 'Chuyến Đà Lạt → TP. HCM',
      amount: 14400000,
      type: 'earning'
    },
    {
      id: '3',
      date: '04/12/2024',
      description: 'Phụ cấp ca đêm',
      amount: 500000,
      type: 'bonus'
    },
    {
      id: '4',
      date: '03/12/2024',
      description: 'Chuyến TP. HCM → Vũng Tàu',
      amount: 8750000,
      type: 'earning'
    },
    {
      id: '5',
      date: '03/12/2024',
      description: 'Chi phí nhiên liệu',
      amount: -350000,
      type: 'expense'
    },
    {
      id: '6',
      date: '03/12/2024',
      description: 'Chuyến Vũng Tàu → TP. HCM',
      amount: 7500000,
      type: 'earning'
    },
    {
      id: '7',
      date: '02/12/2024',
      description: 'Chuyến TP. HCM → Nha Trang',
      amount: 15950000,
      type: 'earning'
    },
    {
      id: '8',
      date: '02/12/2024',
      description: 'Thưởng hoàn thành tốt',
      amount: 1000000,
      type: 'bonus'
    }
  ];

  const currentEarnings = earnings[selectedPeriod];

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
            <span>Quay lại</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 dark:text-white mb-2">{t('earningsTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('earningsSubtitle')}</p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-3">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-6 py-3 rounded-xl transition-all ${
                selectedPeriod === 'week'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-6 py-3 rounded-xl transition-all ${
                selectedPeriod === 'month'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Tháng này
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-6 py-3 rounded-xl transition-all ${
                selectedPeriod === 'year'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              Năm nay
            </button>
          </div>

          <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Xuất báo cáo</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
            <DollarSign className="w-10 h-10 mb-4 opacity-80" />
            <p className="text-blue-100 text-sm mb-2">{t('totalEarnings')}</p>
            <p className="text-4xl mb-1">{(currentEarnings.total / 1000000).toFixed(1)}M</p>
            <div className="flex items-center space-x-1 text-sm text-blue-100">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{t('baseEarnings')}</p>
            <p className="text-3xl text-gray-900 dark:text-white mb-1">
              {(currentEarnings.base / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('currencyVND')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{t('bonusEarnings')}</p>
            <p className="text-3xl text-green-600 dark:text-green-400 mb-1">
              +{(currentEarnings.bonus / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('currencyVND')}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Thu nhập ròng</p>
            <p className="text-3xl text-blue-600 dark:text-blue-400 mb-1">
              {(currentEarnings.net / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sau trừ chi phí</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-gray-900 dark:text-white">Chi tiết thu nhập</h2>
              <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1">
                <Filter className="w-4 h-4" />
                <span>Lọc</span>
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === 'earning' ? 'bg-green-100 dark:bg-green-900/30' :
                      transaction.type === 'bonus' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {transaction.type === 'earning' && <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />}
                      {transaction.type === 'bonus' && <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                      {transaction.type === 'expense' && <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />}
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white">{transaction.description}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`text-xl ${
                    transaction.amount > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Bonus Progress */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl p-6 text-white shadow-xl">
              <h3 className="text-xl mb-4">Mục tiêu tháng này</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Hoàn thành 50 chuyến</span>
                  <span>48/50</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div className="bg-white rounded-full h-3" style={{ width: '96%' }}></div>
                </div>
              </div>
              <p className="text-orange-100 text-sm">Còn 2 chuyến để nhận thưởng 2,000,000đ</p>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl text-gray-900 dark:text-white mb-4">💡 Mẹo tăng thu nhập</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Nhận thêm ca đêm để có phụ cấp cao hơn</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Duy trì đánh giá 4.5⭐ trở lên</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Hoàn thành đúng giờ mọi chuyến đi</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

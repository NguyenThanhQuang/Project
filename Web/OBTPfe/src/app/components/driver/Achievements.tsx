import { ArrowLeft, Award, Star, TrendingUp, Trophy, Target, Zap, Heart, Shield, Crown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../LanguageContext';

interface AchievementsProps {
  onBack: () => void;
}

export function Achievements({ onBack }: AchievementsProps) {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'reviews'>('achievements');

  const achievements = [
    {
      id: '1',
      icon: Trophy,
      title: 'Tài xế xuất sắc',
      description: 'Hoàn thành 100 chuyến đi',
      progress: 100,
      total: 100,
      unlocked: true,
      reward: '5,000,000đ',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '2',
      icon: Star,
      title: 'Đánh giá 5 sao',
      description: 'Nhận 50 đánh giá 5 sao',
      progress: 48,
      total: 50,
      unlocked: false,
      reward: '3,000,000đ',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '3',
      icon: Zap,
      title: 'Tốc độ ánh sáng',
      description: 'Hoàn thành 20 chuyến đúng giờ liên tiếp',
      progress: 20,
      total: 20,
      unlocked: true,
      reward: '2,000,000đ',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '4',
      icon: Heart,
      title: 'Yêu thích khách hàng',
      description: 'Nhận 100 lời khen từ khách',
      progress: 87,
      total: 100,
      unlocked: false,
      reward: '4,000,000đ',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: '5',
      icon: Shield,
      title: 'An toàn tuyệt đối',
      description: '365 ngày không vi phạm',
      progress: 280,
      total: 365,
      unlocked: false,
      reward: '10,000,000đ',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '6',
      icon: Crown,
      title: 'Huyền thoại',
      description: 'Hoàn thành 500 chuyến đi',
      progress: 312,
      total: 500,
      unlocked: false,
      reward: '20,000,000đ',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const reviews = [
    {
      id: '1',
      passenger: 'Nguyễn Thị B',
      rating: 5,
      comment: 'Tài xế lái xe rất an toàn và nhiệt tình. Xe sạch sẽ, đúng giờ. Rất hài lòng!',
      route: 'TP.HCM → Đà Lạt',
      date: '05/12/2024',
      avatar: 'NT'
    },
    {
      id: '2',
      passenger: 'Trần Văn C',
      rating: 5,
      comment: 'Anh tài xế rất vui vẻ, chuyên nghiệp. Lái xe êm ái, cho mình ngủ ngon cả đường.',
      route: 'Đà Lạt → TP.HCM',
      date: '04/12/2024',
      avatar: 'TV'
    },
    {
      id: '3',
      passenger: 'Lê Thị D',
      rating: 5,
      comment: 'Tuyệt vời! Đúng giờ, xe mới, tài xế thân thiện. Sẽ ủng hộ tiếp.',
      route: 'TP.HCM → Vũng Tàu',
      date: '03/12/2024',
      avatar: 'LT'
    },
    {
      id: '4',
      passenger: 'Phạm Văn E',
      rating: 5,
      comment: 'Lái xe cẩn thận, an toàn. Giúp đỡ nhiệt tình khi cần. Cảm ơn anh!',
      route: 'Vũng Tàu → TP.HCM',
      date: '03/12/2024',
      avatar: 'PV'
    },
    {
      id: '5',
      passenger: 'Hoàng Thị F',
      rating: 5,
      comment: 'Chuyến đi thoải mái, tài xế niềm nở. Xe sạch sẽ, có wifi. Perfect!',
      route: 'TP.HCM → Nha Trang',
      date: '02/12/2024',
      avatar: 'HT'
    },
    {
      id: '6',
      passenger: 'Võ Văn G',
      rating: 4,
      comment: 'Tốt, chỉ có điều đường hơi gập ghềnh nhưng tài xế lái rất ổn.',
      route: 'Nha Trang → TP.HCM',
      date: '01/12/2024',
      avatar: 'VV'
    }
  ];

  const stats = {
    totalAchievements: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    avgRating: 4.9,
    totalReviews: reviews.length,
    fiveStars: reviews.filter(r => r.rating === 5).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('backToProfile')}</span>
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <h1 className="text-2xl text-gray-900 dark:text-white">{t('achievementsPageTitle')}</h1>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedTab('achievements')}
              className={`px-6 py-3 rounded-xl transition-all ${
                selectedTab === 'achievements'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {t('achievementsTab')} ({stats.unlocked}/{stats.totalAchievements})
            </button>
            <button
              onClick={() => setSelectedTab('reviews')}
              className={`px-6 py-3 rounded-xl transition-all ${
                selectedTab === 'reviews'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {t('reviewsTab')} ({stats.avgRating}⭐)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedTab === 'achievements' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl">
                <Trophy className="w-10 h-10 mb-3 opacity-80" />
                <p className="text-white/80 text-sm mb-1">{t('achievementsUnlocked')}</p>
                <p className="text-4xl">{stats.unlocked}/{stats.totalAchievements}</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-xl">
                <Star className="w-10 h-10 mb-3 opacity-80" />
                <p className="text-white/80 text-sm mb-1">{t('totalRewards')}</p>
                <p className="text-4xl">
                  {(achievements.filter(a => a.unlocked).reduce((sum, a) => sum + parseInt(a.reward.replace(/[,đ]/g, '')), 0) / 1000000).toFixed(0)}M
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
                <TrendingUp className="w-10 h-10 mb-3 opacity-80" />
                <p className="text-white/80 text-sm mb-1">{t('averageProgress')}</p>
                <p className="text-4xl">
                  {Math.round(achievements.reduce((sum, a) => sum + (a.progress / a.total * 100), 0) / achievements.length)}%
                </p>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                const progress = (achievement.progress / achievement.total) * 100;
                
                return (
                  <div
                    key={achievement.id}
                    className={`bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 ${
                      achievement.unlocked ? 'ring-2 ring-yellow-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 bg-gradient-to-r ${achievement.color} rounded-2xl`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      {achievement.unlocked && (
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm">
                          ✓ {t('unlocked')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          {achievement.progress}/{achievement.total}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Reward */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('rewardLabel')}</span>
                      <span className={`text-lg ${achievement.unlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {achievement.reward}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Review Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('averageRatingStats')}</p>
                <p className="text-4xl text-blue-600 dark:text-blue-400 mb-1">{stats.avgRating}</p>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('totalReviewsStats')}</p>
                <p className="text-4xl text-gray-900 dark:text-white">{stats.totalReviews}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('fiveStarsCount')}</p>
                <p className="text-4xl text-green-600 dark:text-green-400">{stats.fiveStars}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('satisfactionRate')}</p>
                <p className="text-4xl text-purple-600 dark:text-purple-400">
                  {Math.round((stats.fiveStars / stats.totalReviews) * 100)}%
                </p>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      <span>{review.avatar}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg text-gray-900 dark:text-white">{review.passenger}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {review.route} • {review.date}
                          </p>
                        </div>
                        <div className="flex text-yellow-500">
                          {[1,2,3,4,5].map(i => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i <= review.rating ? 'fill-current' : ''}`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
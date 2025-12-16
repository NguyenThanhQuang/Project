import {
  ArrowLeft,
  User,
  History,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  Star,
  Award,
  TrendingUp,
  IdCard,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface DriverProfileProps {
  driverName: string;
  employeeCode: string;
  onBack: () => void;
  onLogout: () => void;
  onProfileDetailClick?: () => void;
  onHistoryClick?: () => void;
  onNotificationsClick?: () => void;
  onChangePasswordClick?: () => void;
  onAchievementsClick?: () => void;
}

export function DriverProfile({
  driverName,
  employeeCode,
  onBack,
  onLogout,
  onProfileDetailClick,
  onHistoryClick,
  onNotificationsClick,
  onChangePasswordClick,
  onAchievementsClick,
}: DriverProfileProps) {
  const { t } = useLanguage();

  const menuItems = [
    { icon: IdCard, label: t("personalInfo"), onClick: onProfileDetailClick },
    { icon: History, label: t("tripHistory"), onClick: onHistoryClick },
    {
      icon: Bell,
      label: t("notifications"),
      onClick: onNotificationsClick,
      badge: 3,
    },
    {
      icon: Lock,
      label: t("changePasswordOption"),
      onClick: onChangePasswordClick,
    },
    {
      icon: Award,
      label: t("achievementsAndRatings"),
      onClick: onAchievementsClick,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="px-4 py-4 flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-gray-900 dark:text-white">
            {t("profileAndSettings")}
          </h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Driver Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-6 shadow-lg text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-white mb-1">{driverName}</h2>
              <p className="text-white/80">
                {t("employeeCode")}: {employeeCode}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white/90 text-sm">
                  4.9 • {t("excellentDriver")}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl mb-1">47</div>
              <div className="text-white/80 text-sm">{t("tripsCount")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">4.9</div>
              <div className="text-white/80 text-sm">{t("rating")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">98%</div>
              <div className="text-white/80 text-sm">{t("onTime")}</div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-gray-900 dark:text-white">
              {t("thisMonthStats")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {t("totalTripsThisMonth")}
              </div>
              <div className="text-2xl text-blue-600 dark:text-blue-400">
                12
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                +2 {t("comparedToLastMonth")}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
              <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                {t("revenueLabel")}
              </div>
              <div className="text-2xl text-green-600 dark:text-green-400">
                120M
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                VNĐ
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <span className="text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

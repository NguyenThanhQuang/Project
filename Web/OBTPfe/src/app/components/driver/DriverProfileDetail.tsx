import {
  ArrowLeft,
  User,
  Phone,
  CreditCard,
  IdCard,
  Mail,
  MapPin,
  Calendar,
  Camera,
  Edit,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../LanguageContext";

interface DriverProfileDetailProps {
  driverName: string;
  employeeCode: string;
  onBack: () => void;
}

export function DriverProfileDetail({
  driverName,
  employeeCode,
  onBack,
}: DriverProfileDetailProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: driverName,
    phone: "0123456789",
    email: "nguyenvantai@vexe.com",
    cccd: "079123456789",
    licenseNumber: "B2-123456",
    licenseExpiry: "15/08/2028",
    address: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
    dateOfBirth: "15/08/1990",
    joinDate: "01/01/2020",
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t("backToProfile")}</span>
            </button>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>{t("editProfile")}</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  {t("cancelEdit")}
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  {t("saveProfile")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-600 to-teal-500 rounded-3xl p-8 shadow-2xl text-white mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30">
                <User className="w-16 h-16" />
              </div>
              <button className="absolute bottom-0 right-0 p-3 bg-white text-blue-600 rounded-full shadow-lg hover:scale-110 transition-all">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl mb-2">{profileData.name}</h1>
              <p className="text-blue-100 text-lg mb-3">
                {t("employeeCodeLabel")}: {employeeCode}
              </p>
              <div className="flex items-center space-x-4">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm">
                  🚗 {t("professionalDriver")}
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-sm">
                  ⭐ 4.9/5.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20">
            <h2 className="text-2xl text-gray-900 dark:text-white">
              {t("personalInfoSection")}
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ tên */}
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <User className="w-4 h-4" />
                  <span>{t("fullNameLabel")}</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    {profileData.name}
                  </p>
                )}
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{t("dateOfBirth")}</span>
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.dateOfBirth
                      .split("/")
                      .reverse()
                      .join("-")}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        dateOfBirth: e.target.value
                          .split("-")
                          .reverse()
                          .join("/"),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    {profileData.dateOfBirth}
                  </p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>{t("phoneNumberLabel")}</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    {profileData.phone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>{t("emailAddress")}</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    {profileData.email}
                  </p>
                )}
              </div>

              {/* CCCD */}
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <IdCard className="w-4 h-4" />
                  <span>{t("idCardNumber")}</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.cccd}
                    onChange={(e) =>
                      setProfileData({ ...profileData, cccd: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    {profileData.cccd}
                  </p>
                )}
              </div>

              {/* Ngày vào làm */}
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{t("joinedDate")}</span>
                </label>
                <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  {profileData.joinDate}
                </p>
              </div>
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{t("addressInfo")}</span>
              </label>
              {isEditing ? (
                <textarea
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData({ ...profileData, address: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              ) : (
                <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  {profileData.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Driver License Information */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <h2 className="text-2xl text-gray-900 dark:text-white">
              {t("licenseInfoSection")}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Số bằng lái */}
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <CreditCard className="w-4 h-4" />
                  <span>{t("licenseNumberInfo")}</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.licenseNumber}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        licenseNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    {profileData.licenseNumber}
                  </p>
                )}
              </div>

              {/* Ngày hết hạn */}
              <div>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{t("licenseExpiry")}</span>
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.licenseExpiry
                      .split("/")
                      .reverse()
                      .join("-")}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        licenseExpiry: e.target.value
                          .split("-")
                          .reverse()
                          .join("/"),
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-lg text-gray-900 dark:text-white px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    {profileData.licenseExpiry}
                  </p>
                )}
              </div>
            </div>

            {/* License Image Preview */}
            <div className="mt-6">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
                {t("licenseImages")}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("frontSide")}
                    </p>
                  </div>
                </div>
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="text-center">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("backSide")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

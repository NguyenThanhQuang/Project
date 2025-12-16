import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Award,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  rating: number;
  totalTrips: number;
  status: "available" | "busy" | "off-duty";
  vehicleAssigned: string;
  joinDate: string;
}

export function DriverManagement() {
  const { t } = useLanguage();
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "1",
      name: "Nguyễn Văn Tài",
      phone: "0909111222",
      email: "nvtai@example.com",
      licenseNumber: "B2-12345678",
      rating: 4.8,
      totalTrips: 156,
      status: "available",
      vehicleAssigned: "51B-12345",
      joinDate: "15/01/2023",
    },
    {
      id: "2",
      name: "Trần Minh Đức",
      phone: "0909222333",
      email: "tmduc@example.com",
      licenseNumber: "B2-23456789",
      rating: 4.9,
      totalTrips: 203,
      status: "busy",
      vehicleAssigned: "51B-67890",
      joinDate: "20/02/2023",
    },
    {
      id: "3",
      name: "Lê Hoàng Nam",
      phone: "0909333444",
      email: "lhnam@example.com",
      licenseNumber: "B2-34567890",
      rating: 4.7,
      totalTrips: 142,
      status: "available",
      vehicleAssigned: "51B-11111",
      joinDate: "10/03/2023",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const statusConfig = {
    available: { label: t("availableStatus"), color: "bg-green-500" },
    busy: { label: t("busyStatus"), color: "bg-orange-500" },
    "off-duty": { label: t("offDutyStatus"), color: "bg-gray-500" },
  };

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-1">
            {t("driverManagementTitle")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t("driverManagementDesc")}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t("addDriver")}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">
            {drivers.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("totalDriversCount")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-green-600 mb-1">
            {drivers.filter((d) => d.status === "available").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("availableDrivers")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-orange-600 mb-1">
            {drivers.filter((d) => d.status === "busy").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("busyDrivers")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">
            {(
              drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length
            ).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("averageRating")}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchDriver")}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">{t("allStatus")}</option>
            <option value="available">{t("availableStatus")}</option>
            <option value="busy">{t("busyStatus")}</option>
            <option value="off-duty">{t("offDutyStatus")}</option>
          </select>
        </div>
      </div>

      {/* Driver List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("driverColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("contactColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("licenseColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("assignedVehicleColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("ratingColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("tripsColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredDrivers.map((driver) => {
                const statusInfo = statusConfig[driver.status];
                return (
                  <tr
                    key={driver.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white">
                          {driver.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white">
                            {driver.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t("joinedDate")}: {driver.joinDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Phone className="w-4 h-4" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{driver.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {driver.vehicleAssigned}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-900 dark:text-white">
                          {driver.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {driver.totalTrips}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 ${statusInfo.color} rounded-full`}
                        ></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {statusInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 dark:text-white">
                {t("addNewDriverTitle")}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("fullName")}
                  </label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    {t("phoneNumber")}
                  </label>
                  <input
                    type="tel"
                    placeholder="0909123456"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("email")}
                </label>
                <input
                  type="email"
                  placeholder="driver@example.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("licenseNumberLabel")}
                </label>
                <input
                  type="text"
                  placeholder="B2-12345678"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">
                  {t("assignedVehicleColumn")}
                </label>
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white">
                  <option>51B-12345 - {t("sleeperBusOption")}</option>
                  <option>51B-67890 - {t("vipSleeperBus")}</option>
                  <option>51B-11111 - {t("seatBusOption")}</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-2xl hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                >
                  {t("addDriver")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

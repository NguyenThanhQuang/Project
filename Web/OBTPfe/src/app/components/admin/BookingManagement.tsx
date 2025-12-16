import { useState } from "react";
import { Search, Download, Eye, X as XIcon } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface Booking {
  id: string;
  ticketCode: string;
  passengerName: string;
  phone: string;
  route: string;
  date: string;
  time: string;
  seatNumber: string;
  price: number;
  status: "confirmed" | "cancelled" | "completed";
  bookingDate: string;
  vehiclePlate: string;
}

export function BookingManagement() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      ticketCode: "VX2024123001",
      passengerName: "Nguyễn Văn A",
      phone: "0909123456",
      route: "TP.HCM → Đà Lạt",
      date: "28/12/2024",
      time: "05:00",
      seatNumber: "A15",
      price: 250000,
      status: "confirmed",
      bookingDate: "20/12/2024 14:30",
      vehiclePlate: "51B-12345",
    },
    {
      id: "2",
      ticketCode: "VX2024123002",
      passengerName: "Trần Thị B",
      phone: "0909234567",
      route: "TP.HCM → Nha Trang",
      date: "28/12/2024",
      time: "14:30",
      seatNumber: "B10",
      price: 220000,
      status: "confirmed",
      bookingDate: "21/12/2024 10:15",
      vehiclePlate: "51B-67890",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const statusConfig = {
    confirmed: { label: t("confirmedBookings"), color: "bg-green-500" },
    cancelled: { label: t("cancelledBookings"), color: "bg-red-500" },
    completed: { label: t("completedStatus"), color: "bg-blue-500" },
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.ticketCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery);
    const matchesStatus = filterStatus === "all" || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-900 dark:text-white mb-1">
          {t("bookingManagementTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t("bookingManagementDesc")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">
            {bookings.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("totalBookingsCount")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-green-600 mb-1">
            {bookings.filter((b) => b.status === "confirmed").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("confirmedBookings")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-red-600 mb-1">
            {bookings.filter((b) => b.status === "cancelled").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("cancelledBookings")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("totalRevenueLabel")}
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
              placeholder={t("searchBooking")}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">{t("allStatus")}</option>
            <option value="confirmed">{t("confirmedBookings")}</option>
            <option value="cancelled">{t("cancelledBookings")}</option>
            <option value="completed">{t("completedStatus")}</option>
          </select>
        </div>
      </div>

      {/* Booking List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("ticketCodeColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("passengerColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("routeColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("timeColumn")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("seat")}
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400 uppercase">
                  {t("priceColumn")}
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
              {filteredBookings.map((booking) => {
                const statusInfo = statusConfig[booking.status];
                return (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white">
                        {booking.ticketCode}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {booking.bookingDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white">
                        {booking.passengerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {booking.route}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white">
                        {booking.time}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {booking.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {booking.seatNumber}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {formatPrice(booking.price)}
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
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 dark:text-white">
                {t("bookingDetails")}
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t("ticketCode")}
                </div>
                <div className="text-2xl text-gray-900 dark:text-white">
                  {selectedBooking.ticketCode}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("passenger")}
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {selectedBooking.passengerName}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("phoneNumber")}
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {selectedBooking.phone}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {t("route")}
                </div>
                <div className="text-gray-900 dark:text-white">
                  {selectedBooking.route}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("departureTime")}
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {selectedBooking.time} - {selectedBooking.date}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("seatNumber")}
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {selectedBooking.seatNumber}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("vehicle")}
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {selectedBooking.vehiclePlate}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("ticketPrice")}
                  </div>
                  <div className="text-blue-600 dark:text-blue-400">
                    {formatPrice(selectedBooking.price)}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>{t("downloadTicket")}</span>
                </button>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

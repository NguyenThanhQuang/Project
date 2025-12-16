import { useState } from "react";
import { Search, Star, Trash2, Eye, MessageCircle } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  companyName: string;
  route: string;
  rating: number;
  comment: string;
  date: string;
  tripDate: string;
  status: "published" | "hidden" | "flagged";
  likes: number;
}

export function ReviewManagement() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      userName: "Nguyễn Văn A",
      userAvatar: "A",
      companyName: "Phương Trang",
      route: "TP.HCM → Đà Lạt",
      rating: 5,
      comment:
        "Dịch vụ tuyệt vời, xe sạch sẽ, tài xế lái xe an toàn. Sẽ tiếp tục ủng hộ!",
      date: "25/12/2024",
      tripDate: "20/12/2024",
      status: "published",
      likes: 12,
    },
    {
      id: "2",
      userName: "Trần Thị B",
      userAvatar: "B",
      companyName: "Thành Bưởi",
      route: "TP.HCM → Nha Trang",
      rating: 4,
      comment: "Xe tốt, nhưng khởi hành muộn 15 phút. Nhìn chung vẫn ok.",
      date: "24/12/2024",
      tripDate: "22/12/2024",
      status: "published",
      likes: 5,
    },
    {
      id: "3",
      userName: "Lê Văn C",
      userAvatar: "C",
      companyName: "Mai Linh Express",
      route: "Hà Nội → Hải Phòng",
      rating: 2,
      comment: "Xe cũ, ghế không thoải mái, không đáng giá tiền.",
      date: "23/12/2024",
      tripDate: "21/12/2024",
      status: "flagged",
      likes: 3,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const statusConfig = {
    published: { label: t("publishedLabel"), color: "bg-green-500" },
    hidden: { label: t("hiddenLabel"), color: "bg-gray-500" },
    flagged: { label: t("flaggedLabel"), color: "bg-red-500" },
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating =
      filterRating === "all" || r.rating === parseInt(filterRating);
    const matchesStatus = filterStatus === "all" || r.status === filterStatus;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-900 dark:text-white mb-1">
          {t("reviewManagementTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t("reviewManagementDesc")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">
            {reviews.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("totalReviewsStats")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-2xl text-yellow-500">
              {avgRating.toFixed(1)}
            </span>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("averageRating")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-green-600 mb-1">
            {reviews.filter((r) => r.status === "published").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("publishedReviews")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-red-600 mb-1">
            {reviews.filter((r) => r.status === "flagged").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t("flaggedReviews")}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-2xl text-gray-900 dark:text-white mb-1">
            {reviews.filter((r) => r.rating === 5).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            5 {t("stars")}
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
              placeholder={t("searchReviews")}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">{t("allRatings")}</option>
            <option value="5">5 {t("stars")}</option>
            <option value="4">4 {t("stars")}</option>
            <option value="3">3 {t("stars")}</option>
            <option value="2">2 {t("stars")}</option>
            <option value="1">1 {t("stars")}</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">{t("allStatus")}</option>
            <option value="published">{t("publishedLabel")}</option>
            <option value="hidden">{t("hiddenLabel")}</option>
            <option value="flagged">{t("flaggedLabel")}</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white text-lg">
                  {review.userAvatar}
                </div>
                <div>
                  <div className="text-gray-900 dark:text-white mb-1">
                    {review.userName}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {review.companyName} • {review.route}
                  </div>
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t("tripDateLabel")} {review.tripDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 ${
                    statusConfig[review.status].color
                  } rounded-full`}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {statusConfig[review.status].label}
                </span>
              </div>
            </div>

            <p className="text-gray-900 dark:text-white mb-4">
              {review.comment}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{review.date}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {review.likes} {t("likesLabel")}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title={t("viewDetails")}
                >
                  <Eye className="w-4 h-4" />
                </button>
                {review.status !== "hidden" ? (
                  <button
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
                    title={t("hideReview")}
                  >
                    {t("hideReview")}
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg text-sm transition-colors"
                    title={t("showReview")}
                  >
                    {t("showReview")}
                  </button>
                )}
                <button
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title={t("deleteReview")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

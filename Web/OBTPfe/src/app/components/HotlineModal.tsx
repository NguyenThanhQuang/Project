import { X, Phone, Headphones, Wrench, MessageSquare } from "lucide-react";
import { useLanguage } from "./LanguageContext";

interface HotlineModalProps {
  onClose: () => void;
}

export function HotlineModal({ onClose }: HotlineModalProps) {
  const { t } = useLanguage();

  const hotlines = [
    {
      icon: Phone,
      title: t("customerService"),
      number: "1900 6067",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Headphones,
      title: t("bookingSupport"),
      number: "1900 1234",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Wrench,
      title: t("technicalSupport"),
      number: "1900 5678",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: MessageSquare,
      title: t("complaint"),
      number: "1900 9999",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-500 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1">{t("hotlineTitle")}</h2>
              <p className="text-blue-100 text-sm">{t("hotlineSubtitle")}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {hotlines.map((hotline, index) => {
            const Icon = hotline.icon;
            return (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-4 bg-gradient-to-br ${hotline.color} text-white rounded-2xl group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white mb-1">
                      {hotline.title}
                    </h3>
                    <a
                      href={`tel:${hotline.number.replace(/\s/g, "")}`}
                      className="text-2xl bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent group-hover:scale-105 inline-block transition-transform"
                    >
                      {hotline.number}
                    </a>
                  </div>
                  <button
                    onClick={() =>
                      (window.location.href = `tel:${hotline.number.replace(
                        /\s/g,
                        ""
                      )}`)
                    }
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-b-3xl border-t border-gray-200 dark:border-gray-600">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            📧 Email: support@vexe.com | 🕐 Hỗ trợ 24/7
          </p>
        </div>
      </div>
    </div>
  );
}

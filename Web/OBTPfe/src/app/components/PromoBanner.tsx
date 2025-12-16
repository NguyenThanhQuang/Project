import { Tag, Sparkles } from "lucide-react";
import { useLanguage } from "./LanguageContext";

export function PromoBanner() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 dark:from-blue-700 dark:via-teal-700 dark:to-emerald-700 rounded-3xl p-12 md:p-16 text-center text-white overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl">
                <Tag className="w-10 h-10" />
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-100" />
              <span>{t("limitedOffer")}</span>
            </div>
            <h2 className="text-white mb-6">{t("specialOfferTitle")}</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              {t("useCode")}{" "}
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg">
                FIRST20
              </span>{" "}
              {t("whenCheckout")}
            </p>
            <button className="bg-white text-blue-600 px-10 py-4 rounded-xl hover:shadow-2xl transition-all hover:scale-105">
              {t("bookNowAndSave")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
